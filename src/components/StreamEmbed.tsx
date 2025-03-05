"use client";

import React, { useState, useEffect } from 'react';
import { getLiveStreamId } from '@/lib/youtube';

interface StreamEmbedProps {
  twitchChannel: string;
  youtubeChannel: string;
  youtubeStreamUrl?: string;
  platform?: 'twitch' | 'youtube';
  onPlatformChange?: (platform: 'twitch' | 'youtube') => void;
  onYoutubeVideoIdChange?: (videoId: string | null) => void; // Callback do przekazywania ID streamu YouTube
  hideControls?: boolean;
}

const StreamEmbed: React.FC<StreamEmbedProps> = ({
  twitchChannel,
  youtubeChannel,
  youtubeStreamUrl,
  platform = 'twitch',
  onPlatformChange,
  onYoutubeVideoIdChange,
  hideControls = false,
}) => {
  const [embedUrl, setEmbedUrl] = useState('');
  const [currentPlatform, setCurrentPlatform] = useState(platform);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [isLoadingYoutubeId, setIsLoadingYoutubeId] = useState(false);

  // Synchronizacja z zewnętrznym stanem
  useEffect(() => {
    setCurrentPlatform(platform);
  }, [platform]);

  // Funkcja do pobierania ID streamu YouTube
  const fetchYoutubeStreamId = async () => {
    if (currentPlatform !== 'youtube') return;
    
    setIsLoadingYoutubeId(true);
    try {
      console.log('Pobieranie ID streamu YouTube...');
      // Pobierz ID aktualnego streamu lub najnowszego filmu
      const streamId = await getLiveStreamId(youtubeChannel);
      
      // Jeśli mamy ID streamu, użyj go
      if (streamId) {
        console.log('Pobrano ID streamu YouTube:', streamId);
        setYoutubeVideoId(streamId);
        
        // Przekaż ID streamu do komponentu nadrzędnego
        if (onYoutubeVideoIdChange) {
          onYoutubeVideoIdChange(streamId);
        }
      } else {
        // Jeśli nie ma aktualnego streamu ani najnowszego filmu, użyj przykładowego ID
        const fallbackId = 'dQw4w9WgXcQ'; // Rick Astley - Never Gonna Give You Up
        console.log('Nie znaleziono streamu ani filmu, używam przykładowego ID:', fallbackId);
        setYoutubeVideoId(fallbackId);
        
        // Przekaż ID streamu do komponentu nadrzędnego
        if (onYoutubeVideoIdChange) {
          onYoutubeVideoIdChange(fallbackId);
        }
      }
    } catch (error) {
      console.error('Błąd podczas pobierania ID streamu YouTube:', error);
      
      // W przypadku błędu, użyj przykładowego ID
      const fallbackId = 'dQw4w9WgXcQ'; // Rick Astley - Never Gonna Give You Up
      setYoutubeVideoId(fallbackId);
      
      // Przekaż ID streamu do komponentu nadrzędnego
      if (onYoutubeVideoIdChange) {
        onYoutubeVideoIdChange(fallbackId);
      }
    } finally {
      setIsLoadingYoutubeId(false);
    }
  };

  // Efekt do pobierania ID streamu YouTube przy montowaniu komponentu
  useEffect(() => {
    // Pobierz ID streamu od razu, jeśli platforma to YouTube
    if (currentPlatform === 'youtube') {
      fetchYoutubeStreamId();
    }
  }, [currentPlatform, youtubeChannel]);

  // Efekt do wykrywania, kiedy karta staje się aktywna
  useEffect(() => {
    // Funkcja obsługująca zdarzenie visibilitychange
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && currentPlatform === 'youtube') {
        console.log('Karta stała się aktywna, odświeżam ID streamu YouTube...');
        fetchYoutubeStreamId();
      }
    };

    // Dodaj nasłuchiwanie zdarzenia visibilitychange
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Funkcja czyszcząca
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentPlatform]);

  // Efekt do ustawiania URL streamu
  useEffect(() => {
    const hostname = window?.location?.hostname || 'localhost';
    const twitchUrl = `https://player.twitch.tv/?channel=${twitchChannel}&parent=${hostname}`;
    
    // Używamy URL z ID streamu, jeśli jest dostępne
    let youtubeUrl = '';
    if (youtubeStreamUrl) {
      youtubeUrl = youtubeStreamUrl;
    } else if (youtubeVideoId) {
      youtubeUrl = `https://www.youtube.com/embed/${youtubeVideoId}`;
    } else {
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
    
    // Jeśli zmieniamy na YouTube, pobierz ID streamu
    if (newPlatform === 'youtube') {
      fetchYoutubeStreamId();
    }
  };

  // Przycisk do ręcznego odświeżania ID streamu YouTube
  const handleRefreshYoutubeId = () => {
    fetchYoutubeStreamId();
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
      
      {/* Przycisk do odświeżania ID streamu YouTube - wyświetlany tylko dla YouTube */}
      {currentPlatform === 'youtube' && (
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={handleRefreshYoutubeId}
            className="px-3 py-2 rounded-full bg-dark-300 text-light-300 hover:bg-dark-200 transition-colors text-sm flex items-center"
            title="Odśwież ID streamu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Odśwież
          </button>
        </div>
      )}

      {/* Kontener streama */}
      <div className="responsive-iframe-container bg-dark-400 overflow-hidden">
        {isLoadingYoutubeId && currentPlatform === 'youtube' ? (
          <div className="absolute inset-0 flex items-center justify-center">
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
      
      {/* Wyświetlanie aktualnego ID streamu - tylko w trybie YouTube */}
      {currentPlatform === 'youtube' && youtubeVideoId && (
        <div className="absolute bottom-4 left-4 z-10 bg-dark-300 bg-opacity-80 px-3 py-1 rounded-md text-xs text-light-300">
          ID streamu: {youtubeVideoId}
        </div>
      )}
    </div>
  );
};

export default StreamEmbed;