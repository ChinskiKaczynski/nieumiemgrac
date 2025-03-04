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
  const [embedUrl, setEmbedUrl] = useState('');
  const [currentPlatform, setCurrentPlatform] = useState(platform);

  // Synchronizacja z zewnętrznym stanem
  useEffect(() => {
    setCurrentPlatform(platform);
  }, [platform]);

  useEffect(() => {
    const hostname = window?.location?.hostname || 'localhost';
    const twitchChatUrl = `https://www.twitch.tv/embed/${twitchChannel}/chat?parent=${hostname}`;
    const youtubeChatUrl = youtubeVideoId 
      ? `https://www.youtube.com/live_chat?v=${youtubeVideoId}&embed_domain=${hostname}`
      : '';
    
    setEmbedUrl(currentPlatform === 'twitch' ? twitchChatUrl : youtubeChatUrl);
  }, [twitchChannel, youtubeVideoId, currentPlatform]);

  // Funkcja do zmiany platformy
  const handlePlatformChange = (newPlatform: 'twitch' | 'youtube') => {
    setCurrentPlatform(newPlatform);
    if (onPlatformChange) {
      onPlatformChange(newPlatform);
    }
  };

  return (
    <div className="w-full h-full bg-dark-400 rounded-lg overflow-hidden flex flex-col">
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
            disabled={!youtubeVideoId}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              currentPlatform === 'youtube'
                ? 'bg-red-600 text-white'
                : youtubeVideoId
                ? 'bg-dark-400 text-light-300 hover:bg-dark-200'
                : 'bg-dark-400 text-light-500 cursor-not-allowed'
            }`}
          >
            YouTube Chat
          </button>
        </div>
      </div>

      {/* Kontener czatu */}
      <div className="flex-grow" style={{ height: 'calc(100% - 4rem)' }}>
        {embedUrl && (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            frameBorder="0"
          />
        )}
        {currentPlatform === 'youtube' && !youtubeVideoId && (
          <div className="w-full h-full flex items-center justify-center text-light-400">
            Chat YouTube będzie dostępny podczas aktywnego streamu
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatEmbed;