import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaTwitch, FaYoutube, FaPlay, FaClock, FaEye, FaCalendarAlt, FaFilter, FaSearch } from 'react-icons/fa';
import Image from 'next/image';

// Przykładowe dane - w rzeczywistości będą pobierane z API
const MOCK_VIDEOS = [
  {
    id: '1',
    title: 'Gramy w Minecraft - budujemy bazę!',
    thumbnail: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_nieumiemgrac-320x180.jpg',
    url: 'https://twitch.tv/videos/123456789',
    views: 1250,
    duration: '3:45:20',
    date: '2025-02-28',
    platform: 'twitch',
    game: 'Minecraft',
  },
  {
    id: '2',
    title: 'CS:GO - droga do Global Elite',
    thumbnail: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_nieumiemgrac-320x180.jpg',
    url: 'https://twitch.tv/videos/123456790',
    views: 980,
    duration: '2:30:15',
    date: '2025-02-26',
    platform: 'twitch',
    game: 'Counter-Strike: Global Offensive',
  },
  {
    id: '3',
    title: 'Valorant z widzami - przyjdź pograć!',
    thumbnail: 'https://i.ytimg.com/vi/abcdefgh/maxresdefault.jpg',
    url: 'https://youtube.com/watch?v=abcdefgh',
    views: 2300,
    duration: '4:10:30',
    date: '2025-02-25',
    platform: 'youtube',
    game: 'Valorant',
  },
  {
    id: '4',
    title: 'Fortnite - nowy sezon, nowe porażki',
    thumbnail: 'https://i.ytimg.com/vi/ijklmnop/maxresdefault.jpg',
    url: 'https://youtube.com/watch?v=ijklmnop',
    views: 1800,
    duration: '3:20:45',
    date: '2025-02-23',
    platform: 'youtube',
    game: 'Fortnite',
  },
  {
    id: '5',
    title: 'Wiedźmin 3 - Krew i Wino #1',
    thumbnail: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_nieumiemgrac-320x180.jpg',
    url: 'https://twitch.tv/videos/123456791',
    views: 3200,
    duration: '5:15:30',
    date: '2025-02-20',
    platform: 'twitch',
    game: 'The Witcher 3: Wild Hunt',
  },
  {
    id: '6',
    title: 'Wiedźmin 3 - Krew i Wino #2',
    thumbnail: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_nieumiemgrac-320x180.jpg',
    url: 'https://twitch.tv/videos/123456792',
    views: 2800,
    duration: '4:45:10',
    date: '2025-02-21',
    platform: 'twitch',
    game: 'The Witcher 3: Wild Hunt',
  },
  {
    id: '7',
    title: 'Cyberpunk 2077 - Night City czeka!',
    thumbnail: 'https://i.ytimg.com/vi/qrstuvw/maxresdefault.jpg',
    url: 'https://youtube.com/watch?v=qrstuvw',
    views: 4100,
    duration: '6:30:20',
    date: '2025-02-18',
    platform: 'youtube',
    game: 'Cyberpunk 2077',
  },
  {
    id: '8',
    title: 'Hogwarts Legacy - Szkoła Magii i Czarodziejstwa',
    thumbnail: 'https://i.ytimg.com/vi/xyzabcd/maxresdefault.jpg',
    url: 'https://youtube.com/watch?v=xyzabcd',
    views: 3500,
    duration: '5:20:15',
    date: '2025-02-15',
    platform: 'youtube',
    game: 'Hogwarts Legacy',
  },
];

// Przykładowe kategorie gier
const GAME_CATEGORIES = [
  'Wszystkie',
  'Minecraft',
  'Counter-Strike: Global Offensive',
  'Valorant',
  'Fortnite',
  'The Witcher 3: Wild Hunt',
  'Cyberpunk 2077',
  'Hogwarts Legacy',
];

export default function ArchiwumPage() {
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
                    <button className="flex-1 py-2 px-4 bg-primary text-white rounded-l-md flex items-center justify-center">
                      <FaTwitch className="mr-2" /> Twitch
                    </button>
                    <button className="flex-1 py-2 px-4 bg-dark-200 text-light-300 rounded-r-md flex items-center justify-center">
                      <FaYoutube className="mr-2" /> YouTube
                    </button>
                  </div>
                </div>
                
                {/* Kategoria gry */}
                <div>
                  <label className="block text-light-300 mb-2">Kategoria gry</label>
                  <select className="w-full bg-dark-200 text-light-100 py-2 px-4 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary">
                    {GAME_CATEGORIES.map((game) => (
                      <option key={game} value={game === 'Wszystkie' ? '' : game}>
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
                    />
                    <FaSearch className="absolute right-3 top-3 text-light-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Lista VOD-ów */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {MOCK_VIDEOS.map((video) => (
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
                        {video.views >= 1000 ? `${(video.views / 1000).toFixed(1)}K` : video.views}
                      </span>
                    </div>
                    <div className="text-primary text-sm truncate">
                      {video.game}
                    </div>
                  </div>
                </a>
              ))}
            </div>
            
            {/* Paginacja */}
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
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}