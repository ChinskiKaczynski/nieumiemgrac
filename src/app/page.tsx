"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StreamEmbed from '@/components/StreamEmbed';
import ChatEmbed from '@/components/ChatEmbed';
import ArchiveSection from '@/components/ArchiveSection';
import AboutSection from '@/components/AboutSection';
import { getLiveStreamId } from '@/lib/youtube';

export default function Home() {
  // Stan współdzielony między komponentami streamu i czatu
  const [currentPlatform, setCurrentPlatform] = useState<'twitch' | 'youtube'>('twitch');
  const [youtubeVideoId, setYoutubeVideoId] = useState<string>("live_stream");

  // Funkcja do zmiany platformy
  const handlePlatformChange = (platform: 'twitch' | 'youtube') => {
    setCurrentPlatform(platform);
  };

  // Pobierz ID aktualnego streamu YouTube, jeśli jest dostępny
  useEffect(() => {
    async function fetchYoutubeStreamId() {
      try {
        const streamId = await getLiveStreamId();
        if (streamId) {
          setYoutubeVideoId(streamId);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania ID streamu YouTube:", error);
      }
    }

    if (currentPlatform === 'youtube') {
      fetchYoutubeStreamId();
    }
  }, [currentPlatform]);

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
            
            {currentPlatform === 'twitch' ? (
              // Twitch Layout
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stream Embed */}
                <div className="lg:col-span-2">
                  <StreamEmbed 
                    twitchChannel="nie_umiem_grac_jednak" 
                    youtubeChannel="UCuhEFa4jQBOa5UOAJ52sa0g" 
                    platform={currentPlatform}
                    onPlatformChange={handlePlatformChange}
                  />
                </div>
                
                {/* Chat Embed */}
                <div className="h-[600px]">
                  <ChatEmbed 
                    twitchChannel="nie_umiem_grac_jednak" 
                    youtubeVideoId={youtubeVideoId}
                    platform={currentPlatform}
                    onPlatformChange={handlePlatformChange}
                  />
                </div>
              </div>
            ) : (
              // YouTube Layout
              <div className="flex flex-wrap justify-between gap-2">
                {/* YouTube Video */}
                <div className="ytContainer ytContainerVideo">
                  <iframe 
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    title="YouTube Live video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  />
                </div>
                
                {/* YouTube Chat */}
                <div className="ytContainer ytContainerChat">
                  <iframe 
                    src={`https://www.youtube.com/live_chat?v=${youtubeVideoId}&embed_domain=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`}
                    title="YouTube Live chat"
                  />
                </div>
                
                {/* Przyciski przełączania platform */}
                <div className="w-full flex justify-center mt-4 gap-2">
                  <button
                    onClick={() => handlePlatformChange('twitch')}
                    className="px-4 py-2 rounded-full font-medium transition-colors bg-dark-300 text-light-300 hover:bg-dark-200"
                  >
                    Przełącz na Twitch
                  </button>
                  <button
                    onClick={() => handlePlatformChange('youtube')}
                    className="px-4 py-2 rounded-full font-medium transition-colors bg-red-600 text-white"
                  >
                    YouTube
                  </button>
                </div>
              </div>
            )}
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
