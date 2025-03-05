"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { getLiveStreamId } from '@/lib/youtube';
import { FaSync } from 'react-icons/fa';

interface StreamEmbedProps {
  twitchChannel: string;
  youtubeChannel: string;
  youtubeStreamUrl?: string;
  platform?: 'twitch' | 'youtube';
  onPlatformChange?: (platform: 'twitch' | 'youtube') => void;
  onYoutubeVideoIdChange?: (videoId: string | null) => void; // Callback do przekazywania ID streamu YouTube
  hideControls?: boolean;
}

// Interwał odświeżania ID streamu YouTube (w milisekundach)
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minut

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
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Synchronizacja z zewnętrznym stanem
  useEffect(() => {
    setCurrentPlatform(platform);
  }, [platform]);

  // Funkcja do pobierania ID streamu YouTube
  const fetchYoutubeStreamId = useCallback(async () => {
    if (currentPlatform !== 'youtube') return;
    
    setIsLoadingYoutubeId(true);
    setIsRefreshing(true);
    
    try {
      // Pobierz ID aktualnego streamu
      const streamId = await getLiveStreamId(youtubeChannel);
      
      // Jeśli mamy ID streamu, użyj go
      if (streamId) {
        setYoutubeVideoId(streamId);
        
        // Przekaż ID streamu do komponentu nadrzędnego
        if (onYoutubeVideoIdChange) {
          onYoutubeVideoIdChange(streamId);
        }
      } else {
        // Jeśli nie ma aktualnego streamu, użyj null
        setYoutubeVideoId(null);
        
        // Przekaż null do komponentu nadrzędnego
        if (onYoutubeVideoIdChange) {
          onYoutubeVideoIdChange(null);
        }
      }
    } catch (error) {
      console.error('Błąd podczas pobierania ID streamu YouTube:', error);
      
      // W przypadku błędu, użyj null
      setYoutubeVideoId(null);
      
      // Przekaż null do komponentu nadrzędnego
      if (onYoutubeVideoIdChange) {
        onYoutubeVideoIdChange(null);
      }
    } finally {
      setIsLoadingYoutubeId(false);
      setIsRefreshing(false);
      setLastRefreshTime(new Date());
    }
  }, [currentPlatform, youtubeChannel, onYoutubeVideoIdChange]);

  // Efekt do pobierania ID streamu YouTube przy montowaniu komponentu i zmianie platformy
  useEffect(() => {
    fetchYoutubeStreamId();
  }, [currentPlatform, youtubeChannel, fetchYoutubeStreamId]);

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
      // Jeśli nie ma ID streamu, użyj URL z ID kanału
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

  // Funkcja do ręcznego odświeżania ID streamu YouTube
  const handleRefresh = () => {
    fetchYoutubeStreamId();
  };

  // Formatowanie czasu ostatniego odświeżenia
  const formatLastRefreshTime = () => {
    return lastRefreshTime.toLocaleTimeString();
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

      {/* Przycisk odświeżania - wyświetlany tylko dla YouTube */}
      {currentPlatform === 'youtube' && (
        <div className="absolute top-4 left-4 z-10">
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
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-light-300">
            Nie znaleziono aktywnego streamu
          </div>
        )}
      </div>

      {/* Informacja o ID streamu - wyświetlana tylko dla YouTube w trybie deweloperskim */}
      {currentPlatform === 'youtube' && process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-4 left-4 z-10 bg-dark-300 p-2 rounded text-xs text-light-400">
          ID streamu: {youtubeVideoId || 'brak'}
        </div>
      )}
    </div>
  );
};

export default StreamEmbed;