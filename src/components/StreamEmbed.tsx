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

// Tablica przykładowych ID streamów YouTube do testowania
const TEST_VIDEO_IDS = [
  'zf2XF-259BA',
  'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up
  'jNQXAC9IVRw', // Me at the zoo
  'hHW1oY26kxQ', // Gangnam Style
  'JGwWNGJdvx8', // Shape of You
];

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
  const [testIdIndex, setTestIdIndex] = useState(0); // Indeks dla testowych ID

  // Synchronizacja z zewnętrznym stanem
  useEffect(() => {
    setCurrentPlatform(platform);
  }, [platform]);

  // Funkcja do pobierania ID streamu YouTube
  const fetchYoutubeStreamId = async (forceTestId: boolean = false) => {
    if (currentPlatform !== 'youtube') return;
    
    setIsLoadingYoutubeId(true);
    try {
      // Jeśli wymuszamy użycie testowego ID lub jesteśmy w trybie testowym
      if (forceTestId || process.env.NODE_ENV === 'development') {
        // Użyj kolejnego testowego ID
        const nextId = TEST_VIDEO_IDS[testIdIndex];
        
        // Zwiększ indeks dla następnego wywołania
        setTestIdIndex((prevIndex) => (prevIndex + 1) % TEST_VIDEO_IDS.length);
        
        console.log('Używam testowego ID streamu YouTube:', nextId);
        setYoutubeVideoId(nextId);
        
        // Przekaż ID streamu do komponentu nadrzędnego
        if (onYoutubeVideoIdChange) {
          onYoutubeVideoIdChange(nextId);
        }
      } else {
        // Standardowe pobieranie ID streamu
        const streamId = await getLiveStreamId(youtubeChannel);
        
        // Jeśli mamy ID streamu, użyj go
        if (streamId) {
          console.log('Pobrano nowe ID streamu YouTube:', streamId);
          setYoutubeVideoId(streamId);
          
          // Przekaż ID streamu do komponentu nadrzędnego
          if (onYoutubeVideoIdChange) {
            onYoutubeVideoIdChange(streamId);
          }
        } else {
          // Jeśli nie ma aktualnego streamu, użyj przykładowego ID
          const fallbackId = TEST_VIDEO_IDS[0];
          console.log('Brak aktualnego streamu, używam przykładowego ID:', fallbackId);
          setYoutubeVideoId(fallbackId);
          
          // Przekaż ID streamu do komponentu nadrzędnego
          if (onYoutubeVideoIdChange) {
            onYoutubeVideoIdChange(fallbackId);
          }
        }
      }
    } catch (error) {
      console.error('Błąd podczas pobierania ID streamu YouTube:', error);
      
      // W przypadku błędu, użyj przykładowego ID
      const fallbackId = TEST_VIDEO_IDS[0];
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
      fetchYoutubeStreamId(true); // Wymuszamy użycie testowego ID
    }
  }, [currentPlatform, youtubeChannel]);

  // Efekt do wykrywania, kiedy karta staje się aktywna
  useEffect(() => {
    // Funkcja obsługująca zdarzenie visibilitychange
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && currentPlatform === 'youtube') {
        console.log('Karta stała się aktywna, odświeżam ID streamu YouTube...');
        fetchYoutubeStreamId(true); // Wymuszamy użycie testowego ID
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
      fetchYoutubeStreamId(true); // Wymuszamy użycie testowego ID
    }
  };

  // Przycisk do ręcznego odświeżania ID streamu YouTube
  const handleRefreshYoutubeId = () => {
    fetchYoutubeStreamId(true); // Wymuszamy użycie testowego ID
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