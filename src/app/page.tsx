"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StreamEmbed from '@/components/StreamEmbed';
import ChatEmbed from '@/components/ChatEmbed';
import ArchiveSection from '@/components/ArchiveSection';
import AboutSection from '@/components/AboutSection';
import { FaInfoCircle } from 'react-icons/fa';

export default function Home() {
  // Stan współdzielony między komponentami streamu i czatu
  const [currentPlatform, setCurrentPlatform] = useState<'twitch' | 'youtube'>('twitch');

  // Funkcja do zmiany platformy
  const handlePlatformChange = (platform: 'twitch' | 'youtube') => {
    setCurrentPlatform(platform);
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-400">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Hero Section - Stream i Chat */}
        <section className="py-8 bg-dark-500">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-light-100 mb-8 text-center">
              <span className="gradient-text">NieUmiemGrac.pl</span>
            </h1>
            
            {/* Zintegrowany kontener dla streamu i chatu */}
            <div className="unified-stream-chat">
              {/* Nagłówek z przyciskami przełączania platform */}
              <div className="unified-stream-chat-header">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-light-100">Stream na żywo</h2>
                  
                  {/* Informacja o ograniczeniach czatu YouTube */}
                  {currentPlatform === 'youtube' && (
                    <div className="ml-4 flex items-center text-light-300 text-sm">
                      <FaInfoCircle className="mr-2 text-yellow-500" />
                      <span>Czat YouTube dostępny w osobnym oknie</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePlatformChange('twitch')}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                      currentPlatform === 'twitch'
                        ? 'bg-purple-600 text-white'
                        : 'bg-dark-400 text-light-300 hover:bg-dark-200'
                    }`}
                  >
                    Twitch
                  </button>
                  <button
                    onClick={() => handlePlatformChange('youtube')}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                      currentPlatform === 'youtube'
                        ? 'bg-red-600 text-white'
                        : 'bg-dark-400 text-light-300 hover:bg-dark-200'
                    }`}
                  >
                    YouTube
                  </button>
                </div>
              </div>
              
              {/* Kontener z podziałem na stream i chat */}
              <div className="unified-stream-chat-content">
                {/* Stream */}
                <div className="unified-stream-container">
                  <StreamEmbed 
                    twitchChannel="nie_umiem_grac_jednak" 
                    youtubeChannel="UCuhEFa4jQBOa5UOAJ52sa0g" 
                    platform={currentPlatform}
                    onPlatformChange={handlePlatformChange}
                    hideControls={true}
                  />
                </div>
                
                {/* Chat */}
                <div className="unified-chat-container">
                  <ChatEmbed 
                    twitchChannel="nie_umiem_grac_jednak" 
                    youtubeVideoId="live_stream"
                    platform={currentPlatform}
                    onPlatformChange={handlePlatformChange}
                    hideControls={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Archiwum Streamów */}
        <ArchiveSection />
        
        {/* O mnie */}
        <AboutSection />
      </main>
      
      <Footer />
    </div>
  );
}
