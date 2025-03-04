import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function StatystykiPage() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-400">
      <Header />
      
      <main className="flex-grow pt-20">
        <section className="py-12 bg-dark-500">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-light-100 mb-8">
              Statystyki i Klipy
            </h1>
            
            <div className="bg-dark-300 rounded-lg p-8 shadow-lg max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-primary mb-4">
                Strona w przygotowaniu
              </h2>
              <p className="text-light-300 mb-6">
                Statystyki i klipy będą dostępne wkrótce. Pracujemy nad zebraniem danych i przygotowaniem tej sekcji.
              </p>
              <p className="text-light-300">
                Zapraszamy do odwiedzenia strony głównej i śledzenia naszych streamów na żywo!
              </p>
              
              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-block bg-primary hover:bg-primary/80 text-white py-3 px-8 rounded-full transition-colors"
                >
                  Wróć do strony głównej
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}