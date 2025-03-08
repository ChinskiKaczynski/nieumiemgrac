"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaTwitch, FaYoutube, FaPlay, FaClock, FaEye, FaCalendarAlt, FaFilter, FaSearch, FaGamepad } from 'react-icons/fa';
import Image from 'next/image';
import { getTwitchVideos } from '@/lib/twitch';
import { getYouTubeCompletedLiveStreams, formatYouTubeDuration, formatViewCount } from '@/lib/youtube';

// Typy danych
interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  views: number;
  duration: string;
  date: string;
  platform: 'twitch' | 'youtube';
  game?: string;
}

export default function ArchiwumPage() {
  const [platform, setPlatform] = useState<'twitch' | 'youtube'>('twitch');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [availableGames, setAvailableGames] = useState<string[]>([]);

  useEffect(() => {
    async function fetchVideos() {
      setIsLoading(true);
      setError(null);
      
      try {
        if (platform === 'twitch') {
          // Pobierz VODy z Twitch
          console.log('Pobieranie VODów z Twitch...');
          const twitchVideos = await getTwitchVideos(undefined, 20);
          console.log('Pobrano VODy z Twitch:', twitchVideos);
          
          if (twitchVideos.length === 0) {
            console.log('Brak VODów z Twitch');
          }
          
          const formattedVideos: VideoItem[] = twitchVideos.map(video => ({
            id: video.id,
            title: video.title,
            thumbnail: video.thumbnail_url.replace('{width}', '320').replace('{height}', '180'),
            url: video.url,
            views: video.view_count,
            duration: video.duration, // Twitch zwraca już sformatowany czas
            date: new Date(video.created_at).toISOString().split('T')[0],
            platform: 'twitch',
            game: video.game_name || 'Nieznana gra'
          }));
          
          setVideos(formattedVideos);
          
          // Zbierz unikalne nazwy gier
          const games = formattedVideos
            .map(video => video.game)
            .filter((game): game is string => !!game);
          
          setAvailableGames(['Wszystkie', ...new Set(games)]);
        } else {
          // Pobierz zakończone transmisje z YouTube
          console.log('Pobieranie zakończonych transmisji z YouTube...');
          const youtubeVideos = await getYouTubeCompletedLiveStreams(undefined, 20);
          console.log('Pobrano zakończone transmisje z YouTube:', youtubeVideos);
          
          if (youtubeVideos.length === 0) {
            console.log('Brak zakończonych transmisji z YouTube');
          }
          
          const formattedVideos: VideoItem[] = youtubeVideos.map(video => ({
            id: video.id,
            title: video.title,
            thumbnail: video.thumbnails.maxres?.url || 
                      video.thumbnails.standard?.url || 
                      video.thumbnails.high.url,
            url: `https://www.youtube.com/live/${video.id}`,
            views: video.viewCount || 0,
            duration: formatYouTubeDuration(video.duration || 'PT0S'),
            date: new Date(video.publishedAt).toISOString().split('T')[0],
            platform: 'youtube'
            // YouTube API nie zwraca bezpośrednio informacji o grze
          }));
          
          setVideos(formattedVideos);
          setAvailableGames(['Wszystkie']);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania filmów:', error);
        setError(`Wystąpił błąd podczas pobierania filmów: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
        setVideos([]);
        setAvailableGames(['Wszystkie']);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchVideos();
  }, [platform]);

  // Filtrowanie filmów
  const filteredVideos = videos.filter(video => {
    // Filtrowanie po grze
    if (selectedGame && selectedGame !== 'Wszystkie' && video.game !== selectedGame) {
      return false;
    }
    
    // Filtrowanie po wyszukiwanej frazie
    if (searchQuery && !video.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Funkcja do formatowania liczby wyświetleń
  const formatViews = (views: number): string => {
    return formatViewCount(views);
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-400">
      <Header />
      
      <main className="flex-grow pt-20">
        <section className="py-12 bg-dark-500">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-light-100 mb-8 text-center">
              Archiwum Streamów
            </h1>
            
            {/* Filtry */}
            <div className="bg-dark-300 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-bold text-light-100 mb-4 flex items-center">
                <FaFilter className="mr-2" /> Filtry
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Platforma */}
                <div>
                  <label className="block text-light-300 mb-2">Platforma</label>
                  <div className="flex">
                    <button 
                      className={`flex-1 py-2 px-4 ${platform === 'twitch' ? 'bg-primary text-white' : 'bg-dark-200 text-light-300'} rounded-l-md flex items-center justify-center`}
                      onClick={() => setPlatform('twitch')}
                    >
                      <FaTwitch className="mr-2" /> Twitch
                    </button>
                    <button 
                      className={`flex-1 py-2 px-4 ${platform === 'youtube' ? 'bg-secondary text-white' : 'bg-dark-200 text-light-300'} rounded-r-md flex items-center justify-center`}
                      onClick={() => setPlatform('youtube')}
                    >
                      <FaYoutube className="mr-2" /> YouTube
                    </button>
                  </div>
                </div>
                
                {/* Jaka Gra - tylko dla Twitch */}
                <div>
                  <label className="block text-light-300 mb-2 flex items-center">
                    <FaGamepad className="mr-2" /> Jaka Gra
                  </label>
                  <select 
                    className="w-full bg-dark-200 text-light-100 py-2 px-4 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                    disabled={platform === 'youtube' || availableGames.length <= 1}
                  >
                    {availableGames.map((game) => (
                      <option key={game} value={game}>
                        {game}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Wyszukiwarka */}
                <div>
                  <label className="block text-light-300 mb-2">Wyszukaj</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Wpisz tytuł streamu..."
                      className="w-full bg-dark-200 text-light-100 py-2 pl-4 pr-10 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FaSearch className="absolute right-3 top-3 text-light-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Lista VOD-ów */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-12">
                <p>{error}</p>
                <p className="mt-4 text-light-300">Spróbuj odświeżyć stronę lub skontaktuj się z administratorem.</p>
              </div>
            ) : filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVideos.map((video) => (
                  <a 
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-dark-300 rounded-lg overflow-hidden shadow-lg hover:transform hover:scale-105 transition-transform duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-primary/90 rounded-full p-3">
                          <FaPlay className="text-white" size={24} />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center">
                        <FaClock className="mr-1" size={12} />
                        {video.duration}
                      </div>
                      <div className="absolute top-2 left-2">
                        {video.platform === 'twitch' ? (
                          <div className="bg-primary text-white text-xs px-2 py-1 rounded flex items-center">
                            <FaTwitch className="mr-1" size={12} />
                            VOD
                          </div>
                        ) : (
                          <div className="bg-secondary text-white text-xs px-2 py-1 rounded flex items-center">
                            <FaYoutube className="mr-1" size={12} />
                            VOD
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Video info */}
                    <div className="p-4">
                      <h3 className="text-light-100 font-medium line-clamp-2 mb-2">{video.title}</h3>
                      <div className="flex justify-between text-light-400 text-sm mb-2">
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1" size={14} />
                          {new Date(video.date).toLocaleDateString('pl-PL')}
                        </span>
                        <span className="flex items-center">
                          <FaEye className="mr-1" size={14} />
                          {formatViews(video.views)}
                        </span>
                      </div>
                      {video.game && (
                        <div className="text-primary text-sm truncate flex items-center">
                          <FaGamepad className="mr-1" size={14} />
                          {video.game}
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center text-light-300 py-12">
                <p>Brak dostępnych VOD-ów dla wybranej platformy i filtrów.</p>
                <p className="mt-4">Spróbuj zmienić filtry lub platformę.</p>
              </div>
            )}
            
            {/* Paginacja - tylko jeśli jest więcej niż 12 filmów */}
            {filteredVideos.length > 12 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <button className="bg-dark-200 text-light-300 py-2 px-4 rounded-md hover:bg-dark-100">
                    &laquo; Poprzednia
                  </button>
                  <button className="bg-primary text-white py-2 px-4 rounded-md">
                    1
                  </button>
                  <button className="bg-dark-200 text-light-300 py-2 px-4 rounded-md hover:bg-dark-100">
                    2
                  </button>
                  <button className="bg-dark-200 text-light-300 py-2 px-4 rounded-md hover:bg-dark-100">
                    3
                  </button>
                  <button className="bg-dark-200 text-light-300 py-2 px-4 rounded-md hover:bg-dark-100">
                    &raquo; Następna
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}