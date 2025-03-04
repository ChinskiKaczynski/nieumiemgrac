"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaTwitch, FaYoutube, FaPlay, FaClock, FaEye } from 'react-icons/fa';

type ArchivePlatform = 'twitch' | 'youtube';

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  views: number;
  duration: string;
  date: string;
  platform: ArchivePlatform;
}

// Przykładowe dane - w rzeczywistości będą pobierane z API
const MOCK_VIDEOS: VideoItem[] = [
  {
    id: '1',
    title: 'Gramy w Minecraft - budujemy bazę!',
    thumbnail: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_nie_umiem_grac_jednak-320x180.jpg',
    url: 'https://twitch.tv/videos/123456789',
    views: 1250,
    duration: '3:45:20',
    date: '2025-02-28',
    platform: 'twitch'
  },
  {
    id: '2',
    title: 'CS:GO - droga do Global Elite',
    thumbnail: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_nie_umiem_grac_jednak-320x180.jpg',
    url: 'https://twitch.tv/videos/123456790',
    views: 980,
    duration: '2:30:15',
    date: '2025-02-26',
    platform: 'twitch'
  },
  {
    id: '3',
    title: 'Valorant z widzami - przyjdź pograć!',
    thumbnail: 'https://i.ytimg.com/vi/abcdefgh/maxresdefault.jpg',
    url: 'https://youtube.com/watch?v=abcdefgh',
    views: 2300,
    duration: '4:10:30',
    date: '2025-02-25',
    platform: 'youtube'
  },
  {
    id: '4',
    title: 'Fortnite - nowy sezon, nowe porażki',
    thumbnail: 'https://i.ytimg.com/vi/ijklmnop/maxresdefault.jpg',
    url: 'https://youtube.com/watch?v=ijklmnop',
    views: 1800,
    duration: '3:20:45',
    date: '2025-02-23',
    platform: 'youtube'
  },
];

const ArchiveSection: React.FC = () => {
  const [platform, setPlatform] = useState<ArchivePlatform>('twitch');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Symulacja ładowania danych z API
    setIsLoading(true);
    
    // Używamy tylko przykładowych danych
    setTimeout(() => {
      const filteredVideos = MOCK_VIDEOS.filter(video => video.platform === platform);
      setVideos(filteredVideos);
      setIsLoading(false);
    }, 1000);
  }, [platform]);

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <section className="py-12 bg-dark-300">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-light-100 mb-8 text-center">Archiwum Streamów</h2>
        
        {/* Platform selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-dark-400 rounded-full p-1">
            <button
              className={`py-2 px-6 rounded-full flex items-center gap-2 transition-colors ${
                platform === 'twitch'
                  ? 'bg-primary text-white'
                  : 'bg-transparent text-light-300 hover:bg-dark-300'
              }`}
              onClick={() => setPlatform('twitch')}
            >
              <FaTwitch size={18} />
              <span className="font-medium">Twitch VOD</span>
            </button>
            <button
              className={`py-2 px-6 rounded-full flex items-center gap-2 transition-colors ${
                platform === 'youtube'
                  ? 'bg-secondary text-white'
                  : 'bg-transparent text-light-300 hover:bg-dark-300'
              }`}
              onClick={() => setPlatform('youtube')}
            >
              <FaYoutube size={18} />
              <span className="font-medium">YouTube VOD</span>
            </button>
          </div>
        </div>
        
        {/* Videos grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <a 
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-dark-400 rounded-lg overflow-hidden shadow-lg hover:transform hover:scale-105 transition-transform duration-300"
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
                  <div className="flex justify-between text-light-400 text-sm">
                    <span>{new Date(video.date).toLocaleDateString('pl-PL')}</span>
                    <span className="flex items-center">
                      <FaEye className="mr-1" size={14} />
                      {formatViews(video.views)}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center text-light-300 py-12">
            <p>Brak dostępnych VOD-ów dla wybranej platformy.</p>
          </div>
        )}
        
        {/* View more button */}
        <div className="text-center mt-10">
          <a
            href={platform === 'twitch' ? '/archiwum?platform=twitch' : '/archiwum?platform=youtube'}
            className="inline-block bg-dark-200 hover:bg-dark-100 text-light-100 py-3 px-8 rounded-full transition-colors"
          >
            Zobacz więcej VOD-ów
          </a>
        </div>
      </div>
    </section>
  );
};

export default ArchiveSection;