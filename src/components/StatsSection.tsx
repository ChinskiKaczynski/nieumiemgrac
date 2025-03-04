"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaPlay, FaEye, FaHeart, FaChartLine, FaUsers, FaCalendarAlt, FaClock, FaTrophy } from 'react-icons/fa';

interface ClipItem {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  views: number;
  date: string;
  duration: string;
}

interface StatsData {
  totalViews: number;
  followers: number;
  subscribers: number;
  streamCount: number;
  totalHours: number;
  averageViewers: number;
  peakViewers: number;
  lastStreamDate: string;
}

// Przykładowe dane - w rzeczywistości będą pobierane z API
const MOCK_CLIPS: ClipItem[] = [
  {
    id: '1',
    title: 'Niesamowity headshot przez ścianę!',
    thumbnail: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_nieumiemgrac-320x180.jpg',
    url: 'https://clips.twitch.tv/clip1',
    views: 5420,
    date: '2025-02-28',
    duration: '0:30'
  },
  {
    id: '2',
    title: 'Epicka wygrana w ostatniej sekundzie',
    thumbnail: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_nieumiemgrac-320x180.jpg',
    url: 'https://clips.twitch.tv/clip2',
    views: 4230,
    date: '2025-02-26',
    duration: '0:45'
  },
  {
    id: '3',
    title: 'Najśmieszniejsza reakcja na jumpscare',
    thumbnail: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_nieumiemgrac-320x180.jpg',
    url: 'https://clips.twitch.tv/clip3',
    views: 3870,
    date: '2025-02-25',
    duration: '0:20'
  },
  {
    id: '4',
    title: 'Kiedy myślisz, że jesteś pro, ale...',
    thumbnail: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_nieumiemgrac-320x180.jpg',
    url: 'https://clips.twitch.tv/clip4',
    views: 3540,
    date: '2025-02-23',
    duration: '0:35'
  },
];

const MOCK_STATS: StatsData = {
  totalViews: 1250000,
  followers: 45000,
  subscribers: 1200,
  streamCount: 320,
  totalHours: 1450,
  averageViewers: 850,
  peakViewers: 3200,
  lastStreamDate: '2025-03-01',
};

const StatsSection: React.FC = () => {
  const [clips, setClips] = useState<ClipItem[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Symulacja ładowania danych z API
    setIsLoading(true);
    
    // W rzeczywistej implementacji, tutaj byłoby wywołanie API
    setTimeout(() => {
      setClips(MOCK_CLIPS);
      setStats(MOCK_STATS);
      setIsLoading(false);
    }, 1000);
    
    // Rzeczywista implementacja z API Twitch będzie wyglądać tak:
    // async function fetchData() {
    //   try {
    //     const [clipsResponse, statsResponse] = await Promise.all([
    //       fetch('/api/top-clips'),
    //       fetch('/api/channel-stats')
    //     ]);
    //     
    //     const clipsData = await clipsResponse.json();
    //     const statsData = await statsResponse.json();
    //     
    //     setClips(clipsData);
    //     setStats(statsData);
    //   } catch (error) {
    //     console.error('Błąd podczas pobierania danych:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }
    // 
    // fetchData();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <section className="py-12 bg-gradient-to-b from-dark-400 to-dark-300">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-light-100 mb-8 text-center">Statystyki i Popularne Klipy</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Stats cards */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="bg-dark-200 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center mb-2">
                    <FaEye className="text-primary mr-2" size={20} />
                    <h3 className="text-light-100 font-medium">Wyświetlenia</h3>
                  </div>
                  <p className="text-2xl font-bold text-light-100">{formatNumber(stats.totalViews)}</p>
                </div>
                
                <div className="bg-dark-200 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center mb-2">
                    <FaUsers className="text-primary mr-2" size={20} />
                    <h3 className="text-light-100 font-medium">Obserwujący</h3>
                  </div>
                  <p className="text-2xl font-bold text-light-100">{formatNumber(stats.followers)}</p>
                </div>
                
                <div className="bg-dark-200 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center mb-2">
                    <FaHeart className="text-primary mr-2" size={20} />
                    <h3 className="text-light-100 font-medium">Subskrybenci</h3>
                  </div>
                  <p className="text-2xl font-bold text-light-100">{formatNumber(stats.subscribers)}</p>
                </div>
                
                <div className="bg-dark-200 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center mb-2">
                    <FaChartLine className="text-primary mr-2" size={20} />
                    <h3 className="text-light-100 font-medium">Szczyt widzów</h3>
                  </div>
                  <p className="text-2xl font-bold text-light-100">{formatNumber(stats.peakViewers)}</p>
                </div>
                
                <div className="bg-dark-200 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center mb-2">
                    <FaCalendarAlt className="text-primary mr-2" size={20} />
                    <h3 className="text-light-100 font-medium">Liczba streamów</h3>
                  </div>
                  <p className="text-2xl font-bold text-light-100">{stats.streamCount}</p>
                </div>
                
                <div className="bg-dark-200 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center mb-2">
                    <FaClock className="text-primary mr-2" size={20} />
                    <h3 className="text-light-100 font-medium">Godziny streamów</h3>
                  </div>
                  <p className="text-2xl font-bold text-light-100">{stats.totalHours}</p>
                </div>
                
                <div className="bg-dark-200 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center mb-2">
                    <FaUsers className="text-primary mr-2" size={20} />
                    <h3 className="text-light-100 font-medium">Średnio widzów</h3>
                  </div>
                  <p className="text-2xl font-bold text-light-100">{stats.averageViewers}</p>
                </div>
                
                <div className="bg-dark-200 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center mb-2">
                    <FaCalendarAlt className="text-primary mr-2" size={20} />
                    <h3 className="text-light-100 font-medium">Ostatni stream</h3>
                  </div>
                  <p className="text-2xl font-bold text-light-100">
                    {new Date(stats.lastStreamDate).toLocaleDateString('pl-PL')}
                  </p>
                </div>
              </div>
            )}

            {/* Top clips section */}
            <h3 className="text-2xl font-bold text-light-100 mb-6 flex items-center">
              <FaTrophy className="text-primary mr-2" size={24} />
              Najpopularniejsze klipy
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {clips.map((clip) => (
                <a 
                  key={clip.id}
                  href={clip.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-dark-200 rounded-lg overflow-hidden shadow-lg hover:transform hover:scale-105 transition-transform duration-300"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video">
                    <Image
                      src={clip.thumbnail}
                      alt={clip.title}
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
                      {clip.duration}
                    </div>
                  </div>
                  
                  {/* Clip info */}
                  <div className="p-4">
                    <h4 className="text-light-100 font-medium line-clamp-2 mb-2">{clip.title}</h4>
                    <div className="flex justify-between text-light-400 text-sm">
                      <span>{new Date(clip.date).toLocaleDateString('pl-PL')}</span>
                      <span className="flex items-center">
                        <FaEye className="mr-1" size={14} />
                        {formatNumber(clip.views)}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            
            {/* View more button */}
            <div className="text-center mt-10">
              <a
                href="/statystyki"
                className="inline-block bg-dark-100 hover:bg-dark-200 text-light-100 py-3 px-8 rounded-full transition-colors"
              >
                Zobacz więcej statystyk i klipów
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default StatsSection;