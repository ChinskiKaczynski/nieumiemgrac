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

  // Efekt do aktualizacji ID streamu YouTube
  useEffect(() => {
    if (youtubeVideoId && youtubeVideoId !== 'live_stream') {
      setActualYoutubeVideoId(youtubeVideoId);
      setDebugInfo(`Używam podanego ID: ${youtubeVideoId}`);
      setIsLoadingYoutubeId(false);
    } else if (currentPlatform === 'youtube' && youtubeChannelId) {
      // Jeśli nie podano konkretnego ID, pobierz ID aktualnego streamu
      setIsLoadingYoutubeId(true);
      getLiveStreamId(youtubeChannelId)
        .then(streamId => {
          if (streamId) {
            setActualYoutubeVideoId(streamId);
            setDebugInfo(`Pobrano ID streamu: ${streamId}`);
          } else {
            // Jeśli nie ma aktualnego streamu, użyj przykładowego ID
            setActualYoutubeVideoId('zf2XF-259BA'); // Przykładowe ID - użyj tego, które podał użytkownik
            setDebugInfo('Brak aktualnego streamu, używam przykładowego ID');
          }
        })
        .catch(error => {
          console.error('Błąd podczas pobierania ID streamu YouTube:', error);
          // W przypadku błędu, użyj przykładowego ID
          setActualYoutubeVideoId('zf2XF-259BA');
          setDebugInfo(`Błąd: ${error}`);
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
    
    // Tworzymy URL do czatu YouTube z aktualnym ID streamu
    let youtubeChatEmbedUrl = '';
    if (actualYoutubeVideoId) {
      youtubeChatEmbedUrl = `https://www.youtube.com/live_chat?v=${actualYoutubeVideoId}&embed_domain=${hostname}`;
    }
    
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
      setDebugInfo(`Twitch URL: ${twitchChatUrl}`);
      setIsYoutubeChatAvailable(false);
    } else if (currentPlatform === 'youtube' && youtubeChatEmbedUrl) {
      setEmbedUrl(youtubeChatEmbedUrl);
      setDebugInfo(`YouTube URL: ${youtubeChatEmbedUrl}`);
      // Próbujemy osadzić czat YouTube - stan dostępności zostanie zaktualizowany po załadowaniu lub błędzie
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

  // Funkcja do obsługi błędu ładowania iframe
  const handleIframeError = () => {
    if (currentPlatform === 'youtube') {
      setIsYoutubeChatAvailable(false);
      setDebugInfo(`Błąd ładowania iframe YouTube`);
    }
  };

  // Funkcja do obsługi pomyślnego załadowania iframe
  const handleIframeLoad = () => {
    if (currentPlatform === 'youtube') {
      // Ustawiamy dostępność na true, ale może to być fałszywie pozytywne
      // Rzeczywista dostępność zostanie zweryfikowana przez użytkownika
      setIsYoutubeChatAvailable(true);
      setDebugInfo(`Iframe YouTube załadowany pomyślnie`);
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
        
        {/* YouTube Chat */}
        {currentPlatform === 'youtube' && (
          <div className="w-full h-full flex flex-col">
            {/* Zawsze wyświetlamy przycisk do otwarcia czatu w nowym oknie */}
            <div className="bg-dark-300 p-3 border-b border-dark-200">
              <button 
                onClick={openYoutubeChat}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full transition-colors text-sm"
              >
                Otwórz czat YouTube w nowym oknie <FaExternalLinkAlt size={12} />
              </button>
              {actualYoutubeVideoId && (
                <span className="ml-2 text-xs text-light-400">
                  ID streamu: {actualYoutubeVideoId}
                </span>
              )}
            </div>
            
            {/* Próbujemy osadzić czat YouTube */}
            <div className="flex-grow">
              {isLoadingYoutubeId ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                </div>
              ) : embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals"
                  onError={handleIframeError}
                  onLoad={handleIframeLoad}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-light-400">
                  Nie można załadować czatu YouTube
                </div>
              )}
            </div>
            
            {/* Informacje debugowania - tylko w trybie deweloperskim */}
            {process.env.NODE_ENV === 'development' && (
              <div className="p-2 bg-dark-400 text-xs text-light-400 text-left border-t border-dark-200">
                <p>Debug: {debugInfo}</p>
                <p>Video ID: {actualYoutubeVideoId || 'brak'}</p>
                <p>Embed URL: {embedUrl || 'brak'}</p>
                <p>Chat URL: {youtubeChatUrl || 'brak'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatEmbed;