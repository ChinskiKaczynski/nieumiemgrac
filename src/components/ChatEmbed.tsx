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
  embedDomain?: string; // Opcjonalny parametr dla domeny
  onYoutubeChatAvailabilityChange?: (isAvailable: boolean) => void; // Callback do informowania o dostępności czatu YouTube
}

const ChatEmbed: React.FC<ChatEmbedProps> = ({
  twitchChannel,
  youtubeVideoId,
  youtubeChannelId,
  platform = 'twitch',
  onPlatformChange,
  hideControls = false,
  embedDomain,
  onYoutubeChatAvailabilityChange,
}) => {
  const [embedUrl, setEmbedUrl] = useState('');
  const [currentPlatform, setCurrentPlatform] = useState(platform);
  const [youtubeChatUrl, setYoutubeChatUrl] = useState('');
  const [isYoutubeChatAvailable, setIsYoutubeChatAvailable] = useState(false);
  const [actualYoutubeVideoId, setActualYoutubeVideoId] = useState<string | null>(null);
  const [isLoadingYoutubeId, setIsLoadingYoutubeId] = useState(false);

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

  // Efekt do aktualizacji ID streamu YouTube
  useEffect(() => {
    if (youtubeVideoId && youtubeVideoId !== 'live_stream') {
      setActualYoutubeVideoId(youtubeVideoId);
      setIsLoadingYoutubeId(false);
    } else if (currentPlatform === 'youtube' && youtubeChannelId) {
      // Jeśli nie podano konkretnego ID, pobierz ID aktualnego streamu
      setIsLoadingYoutubeId(true);
      getLiveStreamId(youtubeChannelId)
        .then(streamId => {
          if (streamId) {
            setActualYoutubeVideoId(streamId);
          } else {
            // Jeśli nie ma aktualnego streamu, użyj przykładowego ID
            setActualYoutubeVideoId('zf2XF-259BA'); // Przykładowe ID - użyj tego, które podał użytkownik
          }
        })
        .catch(error => {
          console.error('Błąd podczas pobierania ID streamu YouTube:', error);
          // W przypadku błędu, użyj przykładowego ID
          setActualYoutubeVideoId('zf2XF-259BA');
        })
        .finally(() => {
          setIsLoadingYoutubeId(false);
        });
    }
  }, [youtubeVideoId, youtubeChannelId, currentPlatform]);

  useEffect(() => {
    // Pobieramy hostname z window.location lub używamy podanej domeny
    const hostname = embedDomain || window?.location?.hostname || 'localhost';
    
    // Dla Twitch, używamy tylko nazwy domeny bez protokołu
    const twitchParent = hostname.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Tworzymy URL do czatu Twitch
    const twitchChatUrl = `https://www.twitch.tv/embed/${twitchChannel}/chat?parent=${twitchParent}`;
    
    // Zapisujemy pełny URL do czatu YouTube, aby móc go użyć w linku zewnętrznym
    let fullYoutubeChatUrl = '';
    if (actualYoutubeVideoId) {
      // Używamy formatu z is_popout=1, jak sugerował użytkownik
      fullYoutubeChatUrl = `https://www.youtube.com/live_chat?is_popout=1&v=${actualYoutubeVideoId}`;
    }
    
    setYoutubeChatUrl(fullYoutubeChatUrl);
    
    // Ustawiamy URL do osadzenia w zależności od wybranej platformy
    if (currentPlatform === 'twitch') {
      setEmbedUrl(twitchChatUrl);
      setIsYoutubeChatAvailable(false);
    } else {
      setEmbedUrl('');
      setIsYoutubeChatAvailable(false);
    }
  }, [twitchChannel, actualYoutubeVideoId, currentPlatform, embedDomain]);

  // Funkcja do zmiany platformy
  const handlePlatformChange = (newPlatform: 'twitch' | 'youtube') => {
    setCurrentPlatform(newPlatform);
    if (onPlatformChange) {
      onPlatformChange(newPlatform);
    }
  };

  // Funkcja do ręcznego otwierania czatu YouTube w nowym oknie o określonych wymiarach
  const openYoutubeChat = () => {
    if (youtubeChatUrl) {
      // Otwórz czat YouTube w nowym oknie o określonych wymiarach
      window.open(
        youtubeChatUrl,
        'YouTubeChatPopup',
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
        {/* Twitch Chat */}
        {currentPlatform === 'twitch' && embedUrl && (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            frameBorder="0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals"
          />
        )}
        
        {/* YouTube Chat - tylko przycisk do otwarcia w nowym oknie */}
        {currentPlatform === 'youtube' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-dark-400">
            {isLoadingYoutubeId ? (
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
            ) : (
              <>
                <button 
                  onClick={openYoutubeChat}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-full transition-colors text-lg font-medium shadow-lg hover:shadow-xl"
                >
                  Otwórz czat YouTube w nowym oknie <FaExternalLinkAlt size={16} />
                </button>
                
                {actualYoutubeVideoId && (
                  <p className="mt-4 text-sm text-light-400">
                    ID streamu: {actualYoutubeVideoId}
                  </p>
                )}
                
                <p className="mt-2 text-sm text-light-500 max-w-md text-center px-4">
                  Ze względu na ograniczenia YouTube, czat jest dostępny tylko w osobnym oknie
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatEmbed;