"use client";

import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { getLiveStreamId } from '@/lib/youtube';

interface ChatEmbedProps {
  twitchChannel: string;
  youtubeVideoId?: string;
  youtubeChannelId?: string;
  platform?: 'twitch' | 'youtube';
  onPlatformChange?: (platform: 'twitch' | 'youtube') => void;
  hideControls?: boolean;
  onYoutubeChatAvailabilityChange?: (isAvailable: boolean) => void; // Callback do informowania o dostępności czatu YouTube
}

const ChatEmbed: React.FC<ChatEmbedProps> = ({
  twitchChannel,
  youtubeVideoId,
  youtubeChannelId,
  platform = 'twitch',
  onPlatformChange,
  hideControls = false,
  onYoutubeChatAvailabilityChange,
}) => {
  const [currentPlatform, setCurrentPlatform] = useState(platform);
  const [youtubeChatUrl, setYoutubeChatUrl] = useState('');
  const [isYoutubeChatAvailable, setIsYoutubeChatAvailable] = useState(false);
  const [actualYoutubeVideoId, setActualYoutubeVideoId] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Synchronizacja z zewnętrznym stanem
  useEffect(() => {
    setCurrentPlatform(platform);
  }, [platform]);

  // Efekt do aktualizacji stanu dostępności czatu YouTube
  useEffect(() => {
    if (onYoutubeChatAvailabilityChange) {
      onYoutubeChatAvailabilityChange(isYoutubeChatAvailable);
    }
  }, [isYoutubeChatAvailable, onYoutubeChatAvailabilityChange]);

  // Efekt do pobierania aktualnego ID streamu YouTube
  useEffect(() => {
    async function fetchYoutubeStreamId() {
      if (currentPlatform === 'youtube') {
        setIsYoutubeChatAvailable(false);
        try {
          // Jeśli podano konkretne ID filmu, użyj go
          if (youtubeVideoId && youtubeVideoId !== 'live_stream') {
            setActualYoutubeVideoId(youtubeVideoId);
            setDebugInfo(`Używam podanego ID: ${youtubeVideoId}`);
          } else if (youtubeChannelId) {
            // W przeciwnym razie pobierz ID aktualnego streamu
            const streamId = await getLiveStreamId(youtubeChannelId);
            if (streamId) {
              setActualYoutubeVideoId(streamId);
              setDebugInfo(`Pobrano ID streamu: ${streamId}`);
            } else {
              // Jeśli nie ma aktualnego streamu, użyj przykładowego ID
              setActualYoutubeVideoId('oMp5K3NOuwM'); // Przykładowe ID
              setDebugInfo('Brak aktualnego streamu, używam przykładowego ID');
            }
          } else {
            // Jeśli nie podano ID kanału, użyj przykładowego ID
            setActualYoutubeVideoId('oMp5K3NOuwM'); // Przykładowe ID
            setDebugInfo('Brak ID kanału, używam przykładowego ID');
          }
        } catch (error) {
          console.error('Błąd podczas pobierania ID streamu YouTube:', error);
          // W przypadku błędu, użyj przykładowego ID
          setActualYoutubeVideoId('oMp5K3NOuwM'); // Przykładowe ID
          setDebugInfo(`Błąd: ${error}`);
        }
      }
    }

    fetchYoutubeStreamId();
  }, [currentPlatform, youtubeVideoId, youtubeChannelId]);

  // Funkcja do tworzenia URL czatu YouTube
  useEffect(() => {
    if (actualYoutubeVideoId) {
      const fullYoutubeChatUrl = `https://www.youtube.com/live_chat?is_popout=1&v=${actualYoutubeVideoId}`;
      setYoutubeChatUrl(fullYoutubeChatUrl);
    } else {
      setYoutubeChatUrl('');
    }
  }, [actualYoutubeVideoId]);

  // Funkcja do zmiany platformy
  const handlePlatformChange = (newPlatform: 'twitch' | 'youtube') => {
    setCurrentPlatform(newPlatform);
    if (onPlatformChange) {
      onPlatformChange(newPlatform);
    }
  };

  // Funkcja do ręcznego otwierania czatu YouTube w mniejszym oknie
  const openYoutubeChat = () => {
    if (youtubeChatUrl) {
      // Otwieramy czat w nowym oknie o określonych wymiarach
      window.open(
        youtubeChatUrl,
        'YouTubeChatPopup',
        'width=400,height=600,resizable=yes,scrollbars=yes,status=no,location=no,toolbar=no'
      );
    }
  };

  // Funkcja do ręcznego otwierania czatu Twitch w nowym oknie
  const openTwitchChat = () => {
    if (twitchChannel) {
      // Otwieramy czat w nowym oknie o określonych wymiarach
      window.open(
        `https://www.twitch.tv/popout/${twitchChannel}/chat?popout=`,
        'TwitchChatPopup',
        'width=400,height=600,resizable=yes,scrollbars=yes,status=no,location=no,toolbar=no'
      );
    }
  };

  return (
    <div className="w-full h-full bg-dark-400 overflow-hidden flex flex-col">
      {/* Przyciski przełączania platform - wyświetlane tylko jeśli hideControls jest false */}
      {!hideControls && (
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
      )}

      {/* Kontener czatu */}
      <div className="flex-grow h-full">
        {/* Twitch Chat - pokazujemy tylko przycisk do otwarcia w nowym oknie */}
        {currentPlatform === 'twitch' && (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-dark-300 p-6 rounded-lg max-w-md">
              <h3 className="text-light-100 text-xl font-semibold mb-4">Chat Twitch</h3>
              
              <p className="text-light-300 mb-6">
                Otwórz czat Twitch w osobnym oknie, aby móc wygodnie rozmawiać podczas oglądania streamu.
              </p>
              
              <button 
                onClick={openTwitchChat}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-full transition-colors"
              >
                Otwórz czat w nowym oknie <FaExternalLinkAlt size={14} />
              </button>
            </div>
          </div>
        )}
        
        {/* YouTube Chat - pokazujemy tylko przycisk do otwarcia w nowym oknie */}
        {currentPlatform === 'youtube' && (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-dark-300 p-6 rounded-lg max-w-md">
              <h3 className="text-light-100 text-xl font-semibold mb-4">Chat YouTube</h3>
              
              <p className="text-light-300 mb-6">
                Otwórz czat YouTube w osobnym oknie, aby móc wygodnie rozmawiać podczas oglądania streamu.
              </p>
              
              <button 
                onClick={openYoutubeChat}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-full transition-colors"
              >
                Otwórz czat w nowym oknie <FaExternalLinkAlt size={14} />
              </button>
              
              {/* Informacje debugowania - tylko w trybie deweloperskim */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-2 bg-dark-400 rounded text-xs text-light-400 text-left">
                  <p>Debug: {debugInfo}</p>
                  <p>Video ID: {actualYoutubeVideoId || 'brak'}</p>
                  <p>Chat URL: {youtubeChatUrl || 'brak'}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatEmbed;