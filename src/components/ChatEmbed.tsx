"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FaExternalLinkAlt, FaSync } from 'react-icons/fa';
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

// Interwał odświeżania ID streamu YouTube (w milisekundach)
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minut

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
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Funkcja do pobierania ID streamu YouTube
  const fetchYoutubeStreamId = useCallback(async () => {
    if (currentPlatform !== 'youtube') return;
    
    setIsLoadingYoutubeId(true);
    setIsRefreshing(true);
    
    try {
      // Jeśli podano konkretne ID filmu, użyj go
      if (youtubeVideoId && youtubeVideoId !== 'live_stream') {
        setActualYoutubeVideoId(youtubeVideoId);
      } else if (youtubeChannelId) {
        // W przeciwnym razie pobierz ID aktualnego streamu
        const streamId = await getLiveStreamId(youtubeChannelId);
        
        // Ustaw ID streamu (może być null, jeśli nie ma aktualnego streamu)
        setActualYoutubeVideoId(streamId);
      } else {
        // Jeśli nie podano ID kanału, ustaw null
        setActualYoutubeVideoId(null);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania ID streamu YouTube:', error);
      // W przypadku błędu, ustaw null
      setActualYoutubeVideoId(null);
    } finally {
      setIsLoadingYoutubeId(false);
      setIsRefreshing(false);
      setLastRefreshTime(new Date());
    }
  }, [currentPlatform, youtubeVideoId, youtubeChannelId]);

  // Efekt do pobierania ID streamu YouTube przy montowaniu komponentu i zmianie platformy
  useEffect(() => {
    fetchYoutubeStreamId();
  }, [currentPlatform, youtubeVideoId, youtubeChannelId, fetchYoutubeStreamId]);

  // Efekt do regularnego odświeżania ID streamu YouTube
  useEffect(() => {
    // Ustaw interwał odświeżania
    const intervalId = setInterval(() => {
      if (currentPlatform === 'youtube' && document.visibilityState === 'visible') {
        fetchYoutubeStreamId();
      }
    }, REFRESH_INTERVAL);

    // Funkcja do obsługi zdarzenia visibilitychange
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && currentPlatform === 'youtube') {
        // Sprawdź, czy minęło wystarczająco dużo czasu od ostatniego odświeżenia
        const now = new Date();
        const timeSinceLastRefresh = now.getTime() - lastRefreshTime.getTime();
        
        if (timeSinceLastRefresh > 60 * 1000) { // 1 minuta
          fetchYoutubeStreamId();
        }
      }
    };

    // Dodaj nasłuchiwanie zdarzenia visibilitychange
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Wyczyść interwał i nasłuchiwanie przy odmontowaniu komponentu
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentPlatform, fetchYoutubeStreamId, lastRefreshTime]);

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

  // Funkcja do ręcznego odświeżania ID streamu YouTube
  const handleRefresh = () => {
    fetchYoutubeStreamId();
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

  // Formatowanie czasu ostatniego odświeżenia
  const formatLastRefreshTime = () => {
    return lastRefreshTime.toLocaleTimeString();
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
          <div className="w-full h-full flex flex-col items-center justify-center bg-dark-400 relative">
            {/* Przycisk odświeżania */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`p-2 rounded-full transition-colors ${
                  isRefreshing
                    ? 'bg-dark-300 text-light-500 cursor-not-allowed'
                    : 'bg-dark-300 text-light-300 hover:bg-dark-200'
                }`}
                title={`Ostatnie odświeżenie: ${formatLastRefreshTime()}`}
              >
                <FaSync className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            </div>
            
            {isLoadingYoutubeId ? (
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
            ) : (
              <>
                {actualYoutubeVideoId ? (
                  <>
                    <button 
                      onClick={openYoutubeChat}
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-full transition-colors text-lg font-medium shadow-lg hover:shadow-xl"
                    >
                      Otwórz czat YouTube w nowym oknie <FaExternalLinkAlt size={16} />
                    </button>
                    
                    <p className="mt-4 text-sm text-light-400">
                      ID streamu: {actualYoutubeVideoId}
                    </p>
                    
                    <p className="mt-2 text-sm text-light-500 max-w-md text-center px-4">
                      Ze względu na ograniczenia YouTube, czat jest dostępny tylko w osobnym oknie
                    </p>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-xl text-light-300 mb-4">Brak aktywnego streamu</p>
                    <p className="text-sm text-light-500 max-w-md px-4">
                      Czat YouTube będzie dostępny, gdy rozpocznie się transmisja na żywo
                    </p>
                    <p className="text-sm text-light-400 mt-4">
                      Ostatnie odświeżenie: {formatLastRefreshTime()}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatEmbed;