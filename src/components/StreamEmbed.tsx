"use client";

import React, { useState, useEffect } from 'react';
import { getLiveStreamId } from '@/lib/youtube';

interface StreamEmbedProps {
  twitchChannel: string;
  youtubeChannel: string;
  youtubeStreamUrl?: string;
  platform?: 'twitch' | 'youtube';
  onPlatformChange?: (platform: 'twitch' | 'youtube') => void;
  hideControls?: boolean;
  onYoutubeVideoIdChange?: (videoId: string | null) => void; // Callback do przekazywania ID streamu YouTube
}

const StreamEmbed: React.FC<StreamEmbedProps> = ({
  twitchChannel,
  youtubeChannel,
  youtubeStreamUrl,
  platform = 'twitch',
  onPlatformChange,
  hideControls = false,
  onYoutubeVideoIdChange,
}) => {
  const [embedUrl, setEmbedUrl] = useState('');
  const [currentPlatform, setCurrentPlatform] = useState(platform);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Synchronizacja z zewnętrznym stanem
  useEffect(() => {
    setCurrentPlatform(platform);
  }, [platform]);

  // Efekt do pobierania ID streamu YouTube
  useEffect(() => {
    async function fetchYoutubeStreamId() {
      if (currentPlatform === 'youtube') {
        setIsLoading(true);
        try {
          // Jeśli podano konkretny URL streamu, wyciągnij z niego ID
          if (youtubeStreamUrl) {
            const match = youtubeStreamUrl.match(/[?&]v=([^&]+)/);
            if (match && match[1]) {
              const videoId = match[1];
              setYoutubeVideoId(videoId);
              if (onYoutubeVideoIdChange) {
                onYoutubeVideoIdChange(videoId);
              }
              return;
            }
          }
          
          // W przeciwnym razie pobierz ID aktualnego streamu
          const streamId = await getLiveStreamId(youtubeChannel);
          console.log('Pobrano ID streamu YouTube:', streamId);
          
          setYoutubeVideoId(streamId);
          
          // Przekaż ID streamu do komponentu nadrzędnego
          if (onYoutubeVideoIdChange) {
            onYoutubeVideoIdChange(streamId);
          }
        } catch (error) {
          console.error('Błąd podczas pobierania ID streamu YouTube:', error);
          setYoutubeVideoId(null);
          if (onYoutubeVideoIdChange) {
            onYoutubeVideoIdChange(null);
          }
        } finally {
          setIsLoading(false);
        }
      }
    }
    
    fetchYoutubeStreamId();
  }, [currentPlatform, youtubeChannel, youtubeStreamUrl, onYoutubeVideoIdChange]);

  // Efekt do aktualizacji URL streamu
  useEffect(() => {
    const hostname = window?.location?.hostname || 'localhost';
    const twitchUrl = `https://player.twitch.tv/?channel=${twitchChannel}&parent=${hostname}`;
    
    let youtubeUrl;
    if (youtubeVideoId) {
      // Jeśli mamy konkretne ID streamu, użyj go
      youtubeUrl = `https://www.youtube.com/embed/${youtubeVideoId}`;
    } else if (youtubeStreamUrl) {
      // Jeśli podano konkretny URL streamu, użyj go
      youtubeUrl = youtubeStreamUrl;
    } else {
      // W przeciwnym razie użyj standardowego URL z ID kanału
      youtubeUrl = `https://www.youtube.com/embed/live_stream?channel=${youtubeChannel}`;
    }
    
    setEmbedUrl(currentPlatform === 'twitch' ? twitchUrl : youtubeUrl);
  }, [twitchChannel, youtubeChannel, youtubeStreamUrl, youtubeVideoId, currentPlatform]);

  // Funkcja do zmiany platformy
  const handlePlatformChange = (newPlatform: 'twitch' | 'youtube') => {
    setCurrentPlatform(newPlatform);
    if (onPlatformChange) {
      onPlatformChange(newPlatform);
    }
  };

  return (
    <div className="relative w-full">
      {/* Przyciski przełączania platform - wyświetlane tylko jeśli hideControls jest false */}
      {!hideControls && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={() => handlePlatformChange('twitch')}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              currentPlatform === 'twitch'
                ? 'bg-purple-600 text-white'
                : 'bg-dark-300 text-light-300 hover:bg-dark-200'
            }`}
          >
            Twitch
          </button>
          <button
            onClick={() => handlePlatformChange('youtube')}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              currentPlatform === 'youtube'
                ? 'bg-red-600 text-white'
                : 'bg-dark-300 text-light-300 hover:bg-dark-200'
            }`}
          >
            YouTube
          </button>
        </div>
      )}

      {/* Kontener streama */}
      <div className="responsive-iframe-container bg-dark-400 overflow-hidden">
        {isLoading && currentPlatform === 'youtube' ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            className="responsive-iframe"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
        ) : null}
      </div>
    </div>
  );
};

export default StreamEmbed;