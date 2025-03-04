"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StreamEmbed from '@/components/StreamEmbed';
import ChatEmbed from '@/components/ChatEmbed';
import ArchiveSection from '@/components/ArchiveSection';
import AboutSection from '@/components/AboutSection';

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
                  youtubeVideoId="live_stream"
                  platform={currentPlatform}
                  onPlatformChange={handlePlatformChange}
                />
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
