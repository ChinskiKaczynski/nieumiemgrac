"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface ChatEmbedProps {
  twitchChannel: string;
  youtubeVideoId?: string;
  platform?: 'twitch' | 'youtube';
  onPlatformChange?: (platform: 'twitch' | 'youtube') => void;
  hideControls?: boolean;
  onYoutubeChatAvailabilityChange?: (isAvailable: boolean) => void; // Callback do informowania o dostępności czatu YouTube
}

const ChatEmbed: React.FC<ChatEmbedProps> = ({
  twitchChannel,
  youtubeVideoId,
  platform = 'twitch',
  onPlatformChange,
  hideControls = false,
  onYoutubeChatAvailabilityChange,
}) => {
  const [currentPlatform, setCurrentPlatform] = useState(platform);
  const [youtubeChatUrl, setYoutubeChatUrl] = useState('');
  const [isYoutubeChatAvailable, setIsYoutubeChatAvailable] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [twitchChatError, setTwitchChatError] = useState(false);
  const twitchChatRef = useRef<HTMLIFrameElement>(null);

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

  // Efekt do aktualizacji URL czatu YouTube
  useEffect(() => {
    if (currentPlatform === 'youtube') {
      if (youtubeVideoId && youtubeVideoId !== 'live_stream') {
        // Tworzymy URL czatu YouTube z ID streamu
        const chatUrl = `https://www.youtube.com/live_chat?is_popout=1&v=${youtubeVideoId}`;
        setYoutubeChatUrl(chatUrl);
        setIsYoutubeChatAvailable(true);
        setDebugInfo(`Używam ID streamu: ${youtubeVideoId} dla czatu YouTube`);
      } else {
        setYoutubeChatUrl('');
        setIsYoutubeChatAvailable(false);
        setDebugInfo('Brak ID streamu YouTube');
      }
    }
  }, [currentPlatform, youtubeVideoId]);

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
    } else {
      // Jeśli nie mamy URL czatu, wyświetl komunikat
      alert('Czat YouTube nie jest dostępny. Upewnij się, że stream jest aktywny.');
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

  // Funkcja do obsługi błędu ładowania iframe czatu Twitch
  const handleTwitchChatError = () => {
    setTwitchChatError(true);
    setDebugInfo(`Twitch chat failed to load`);
  };

  // Funkcja do obsługi pomyślnego załadowania iframe czatu Twitch
  const handleTwitchChatLoad = () => {
    setTwitchChatError(false);
    setDebugInfo(`Twitch chat loaded successfully`);
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
      <div className="flex-grow h-full relative">
        {/* Twitch Chat - próbujemy osadzić, a jeśli się nie uda, pokazujemy alternatywę */}
        {currentPlatform === 'twitch' && (
          <>
            <iframe
              ref={twitchChatRef}
              src={`https://www.twitch.tv/embed/${twitchChannel}/chat?parent=nieumiemgrac.pl&parent=www.nieumiemgrac.pl&darkpopout=true`}
              height="100%"
              width="100%"
              style={{ border: 'none' }}
              allow="autoplay; fullscreen"
              onError={handleTwitchChatError}
              onLoad={handleTwitchChatLoad}
            />
            
            {/* Alternatywny widok, gdy osadzenie nie działa */}
            {twitchChatError && (
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 text-center bg-dark-400 z-10">
                <div className="bg-dark-300 p-6 rounded-lg max-w-md">
                  <h3 className="text-light-100 text-xl font-semibold mb-4">Chat Twitch</h3>
                  
                  <p className="text-light-300 mb-6">
                    Nie udało się załadować czatu Twitch. Możesz otworzyć go w nowym oknie, klikając poniższy przycisk.
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
          </>
        )}
        
        {/* YouTube Chat - pokazujemy tylko przycisk do otwarcia w nowym oknie */}
        {currentPlatform === 'youtube' && (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-dark-300 p-6 rounded-lg max-w-md">
              <h3 className="text-light-100 text-xl font-semibold mb-4">Chat YouTube</h3>
              
              <p className="text-light-300 mb-6">
                {isYoutubeChatAvailable 
                  ? 'Otwórz czat YouTube w osobnym oknie, aby móc wygodnie rozmawiać podczas oglądania streamu.'
                  : 'Czat YouTube nie jest dostępny. Upewnij się, że stream jest aktywny i ma włączony czat.'}
              </p>
              
              <button 
                onClick={openYoutubeChat}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-full transition-colors"
                disabled={!isYoutubeChatAvailable}
              >
                Otwórz czat w nowym oknie <FaExternalLinkAlt size={14} />
              </button>
              
              {/* Informacje debugowania - tylko w trybie deweloperskim */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-2 bg-dark-400 rounded text-xs text-light-400 text-left">
                  <p>Debug: {debugInfo}</p>
                  <p>Video ID: {youtubeVideoId || 'brak'}</p>
                  <p>Chat URL: {youtubeChatUrl || 'brak'}</p>
                  <p>Chat dostępny: {isYoutubeChatAvailable ? 'Tak' : 'Nie'}</p>
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