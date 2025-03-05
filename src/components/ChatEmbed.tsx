"use client";

import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface ChatEmbedProps {
  twitchChannel: string;
  youtubeVideoId?: string;
  platform?: 'twitch' | 'youtube';
  onPlatformChange?: (platform: 'twitch' | 'youtube') => void;
  hideControls?: boolean;
  embedDomain?: string; // Opcjonalny parametr dla domeny
  onYoutubeChatAvailabilityChange?: (isAvailable: boolean) => void; // Callback do informowania o dostępności czatu YouTube
}

const ChatEmbed: React.FC<ChatEmbedProps> = ({
  twitchChannel,
  youtubeVideoId,
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

  useEffect(() => {
    // Pobieramy hostname z window.location lub używamy podanej domeny
    let hostname = embedDomain || window?.location?.hostname || 'localhost';
    
    // Jeśli domena nie zaczyna się od "www." i nie jest localhost, dodajemy "www."
    if (hostname !== 'localhost' && !hostname.startsWith('www.')) {
      hostname = `www.${hostname}`;
    }
    
    const twitchChatUrl = `https://www.twitch.tv/embed/${twitchChannel}/chat?parent=${hostname}`;
    
    // Tworzymy URL do czatu YouTube
    const youtubeChatEmbedUrl = youtubeVideoId 
      ? `https://www.youtube.com/live_chat?v=${youtubeVideoId}&embed_domain=${hostname}`
      : '';
    
    // Zapisujemy pełny URL do czatu YouTube, aby móc go użyć w linku zewnętrznym
    const fullYoutubeChatUrl = youtubeVideoId 
      ? `https://www.youtube.com/live_chat?v=${youtubeVideoId}`
      : '';
    
    setYoutubeChatUrl(fullYoutubeChatUrl);
    
    // Ustawiamy URL do osadzenia w zależności od wybranej platformy
    if (currentPlatform === 'twitch') {
      setEmbedUrl(twitchChatUrl);
      setIsYoutubeChatAvailable(false);
    } else if (currentPlatform === 'youtube' && youtubeChatEmbedUrl) {
      setEmbedUrl(youtubeChatEmbedUrl);
      // Próbujemy osadzić czat YouTube - stan dostępności zostanie zaktualizowany po załadowaniu lub błędzie
    } else {
      setEmbedUrl('');
      setIsYoutubeChatAvailable(false);
    }
  }, [twitchChannel, youtubeVideoId, currentPlatform, embedDomain]);

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
    }
  };

  // Funkcja do obsługi pomyślnego załadowania iframe
  const handleIframeLoad = () => {
    if (currentPlatform === 'youtube') {
      // Ustawiamy dostępność na true, ale może to być fałszywie pozytywne
      // Rzeczywista dostępność zostanie zweryfikowana przez użytkownika
      setIsYoutubeChatAvailable(true);
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
      )}

      {/* Kontener czatu */}
      <div className="flex-grow h-full">
        {/* Twitch Chat */}
        {currentPlatform === 'twitch' && embedUrl && (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            frameBorder="0"
          />
        )}
        
        {/* YouTube Chat - próbujemy osadzić, a jeśli się nie uda, pokazujemy alternatywę */}
        {currentPlatform === 'youtube' && (
          <>
            {embedUrl && (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                frameBorder="0"
                onError={handleIframeError}
                onLoad={handleIframeLoad}
                style={{ display: isYoutubeChatAvailable ? 'block' : 'none' }}
              />
            )}
            
            {/* Alternatywny widok, gdy osadzenie nie działa */}
            {(!isYoutubeChatAvailable || !embedUrl) && (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-dark-300 p-6 rounded-lg max-w-md">
                  <h3 className="text-light-100 text-xl font-semibold mb-4">Chat YouTube</h3>
                  
                  {youtubeVideoId ? (
                    <>
                      <p className="text-light-300 mb-6">
                        Ze względu na ograniczenia YouTube, czat nie może być osadzony bezpośrednio na stronie. 
                        Możesz otworzyć czat YouTube w nowym oknie, klikając poniższy przycisk.
                      </p>
                      
                      <a 
                        href={youtubeChatUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-full transition-colors"
                      >
                        Otwórz czat YouTube <FaExternalLinkAlt size={14} />
                      </a>
                    </>
                  ) : (
                    <p className="text-light-400">
                      Chat YouTube będzie dostępny podczas aktywnego streamu
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatEmbed;