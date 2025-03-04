"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-400">
      <Header />
      
      <main className="flex-grow pt-20">
        <section className="py-8 bg-dark-500">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-light-100 mb-8 text-center">
              <span className="gradient-text">NieUmiemGrac.pl</span>
            </h1>
            
            <div className="bg-dark-300 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-light-100 mb-4 text-center">
                Strona w trakcie aktualizacji
              </h2>
              <p className="text-light-300 text-center">
                Pracujemy nad poprawą strony. Prosimy o cierpliwość.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
