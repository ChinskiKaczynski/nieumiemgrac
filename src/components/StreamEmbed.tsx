"use client";

import React, { useState, useEffect } from 'react';

interface StreamEmbedProps {
  twitchChannel: string;
  youtubeChannel: string;
  youtubeStreamUrl?: string;
  platform?: 'twitch' | 'youtube';
  onPlatformChange?: (platform: 'twitch' | 'youtube') => void;
}

const StreamEmbed: React.FC<StreamEmbedProps> = ({
  twitchChannel,
  youtubeChannel,
  youtubeStreamUrl,
  platform = 'twitch',
  onPlatformChange,
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
    <div className="w-full">
      {/* Przyciski przełączania platform - przeniesione nad stream */}
      <div className="flex justify-end mb-2 gap-2">
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

      {/* Kontener streama */}
      <div className="relative pt-[56.25%] w-full bg-dark-400 rounded-lg overflow-hidden">
        {embedUrl && (
          <iframe
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        )}
      </div>
    </div>
  );
};

export default StreamEmbed;