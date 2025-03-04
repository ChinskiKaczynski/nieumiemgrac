"use client";

import React, { useState, useEffect } from 'react';

interface ChatEmbedProps {
  twitchChannel: string;
  youtubeVideoId?: string;
  platform?: 'twitch' | 'youtube';
  onPlatformChange?: (platform: 'twitch' | 'youtube') => void;
}

const ChatEmbed: React.FC<ChatEmbedProps> = ({
  twitchChannel,
  youtubeVideoId,
  platform = 'twitch',
  onPlatformChange,
}) => {
  const [currentPlatform, setCurrentPlatform] = useState(platform);

  // Synchronizacja z zewnętrznym stanem
  useEffect(() => {
    setCurrentPlatform(platform);
  }, [platform]);

  // Funkcja do zmiany platformy
  const handlePlatformChange = (newPlatform: 'twitch' | 'youtube') => {
    setCurrentPlatform(newPlatform);
    if (onPlatformChange) {
      onPlatformChange(newPlatform);
    }
  };

  // Generowanie URL czatu
  const getChatUrl = () => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    
    if (currentPlatform === 'twitch') {
      return `https://www.twitch.tv/embed/${twitchChannel}/chat?parent=${hostname}`;
    } else {
      return `https://www.youtube.com/live_chat?v=${youtubeVideoId || 'live_stream'}&embed_domain=${hostname}`;
    }
  };

  return (
    <div className="w-full h-full bg-dark-400 rounded-lg overflow-hidden">
      {/* Przyciski przełączania platform */}
      <div className="p-4 bg-dark-300">
        <div className="flex gap-2">
          <button
            onClick={() => handlePlatformChange('twitch')}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              currentPlatform === 'twitch'
                ? 'bg-purple-600 text-white'
                : 'bg-dark-400 text-light-300 hover:bg-dark-200'
            }`}
          >
            Twitch Chat
          </button>
          <button
            onClick={() => handlePlatformChange('youtube')}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              currentPlatform === 'youtube'
                ? 'bg-red-600 text-white'
                : 'bg-dark-400 text-light-300 hover:bg-dark-200'
            }`}
          >
            YouTube Chat
          </button>
        </div>
      </div>

      {/* Kontener czatu */}
      <div className="w-full h-[calc(100%-4rem)]">
        <iframe
          src={getChatUrl()}
          className="w-full h-full"
          frameBorder="0"
        />
      </div>
    </div>
  );
};

export default ChatEmbed;