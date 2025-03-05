"use client";

import React, { useState, useEffect } from 'react';

interface StreamEmbedProps {
  twitchChannel: string;
  youtubeChannel: string;
  youtubeStreamUrl?: string;
  platform?: 'twitch' | 'youtube';
  onPlatformChange?: (platform: 'twitch' | 'youtube') => void;
  hideControls?: boolean;
}

const StreamEmbed: React.FC<StreamEmbedProps> = ({
  twitchChannel,
  youtubeChannel,
  youtubeStreamUrl,
  platform = 'twitch',
  onPlatformChange,
  hideControls = false,
}) => {
  const [embedUrl, setEmbedUrl] = useState('');
  const [currentPlatform, setCurrentPlatform] = useState(platform);

  // Synchronizacja z zewnętrznym stanem
  useEffect(() => {
    setCurrentPlatform(platform);
  }, [platform]);

  useEffect(() => {
    const hostname = window?.location?.hostname || 'localhost';
    const twitchUrl = `https://player.twitch.tv/?channel=${twitchChannel}&parent=${hostname}`;
    
    // Używamy standardowego URL dla YouTube z ID kanału
    const youtubeUrl = youtubeStreamUrl || `https://www.youtube.com/embed/live_stream?channel=${youtubeChannel}`;
    
    setEmbedUrl(currentPlatform === 'twitch' ? twitchUrl : youtubeUrl);
  }, [twitchChannel, youtubeChannel, youtubeStreamUrl, currentPlatform]);

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
        {embedUrl && (
          <iframe
            src={embedUrl}
            className="responsive-iframe"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
        )}
      </div>
    </div>
  );
};

export default StreamEmbed;