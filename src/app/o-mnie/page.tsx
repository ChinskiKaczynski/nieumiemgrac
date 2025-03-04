"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { FaGamepad, FaTwitch, FaYoutube, FaDiscord, FaTwitter, FaInstagram, FaTiktok, FaEnvelope, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function OMniePage() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-400">
      <Header />
      
      <main className="flex-grow pt-20">
        <section className="py-12 bg-dark-500">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-light-100 mb-12 text-center flex items-center justify-center">
              <FaGamepad className="text-primary mr-3" size={32} />
              O mnie
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Informacje o streamerze */}
              <div>
                <motion.h2 
                  className="text-3xl font-bold text-light-100 mb-6 gradient-text"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  Cześć, jestem NieUmiemGrac!
                </motion.h2>
                
                <motion.p 
                  className="text-light-300 mb-6 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  Witaj w moim świecie, gdzie brak umiejętności to mój znak rozpoznawczy! Jestem streamerem, który udowadnia, 
                  że do dobrej zabawy nie potrzebujesz być profesjonalistą. Moją misją jest pokazanie, że w grach chodzi przede 
                  wszystkim o dobrą zabawę, niezależnie od poziomu umiejętności.
                </motion.p>
                
                <motion.p 
                  className="text-light-300 mb-6 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Na moich streamach zobaczysz epickie porażki, niesamowite wpadki i momenty, które rozbawią Cię do łez. 
                  Gram w różne tytuły - od strzelanek, przez gry strategiczne, aż po horrory, gdzie moje reakcje na jumpscare&apos;y 
                  stały się już legendarne.
                </motion.p>
                
                <motion.p 
                  className="text-light-300 mb-6 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Streamowanie to moja pasja, którą rozwijam od 2020 roku. Zaczynałem od małych transmisji dla znajomych, 
                  a dziś mam przyjemność dzielić się swoją pasją z tysiącami widzów. Mimo rosnącej popularności, 
                  wciąż pozostaję sobą - zwykłym graczem, który po prostu kocha gry i społeczność, która wokół nich powstała.
                </motion.p>
                
                <motion.p 
                  className="text-light-300 mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  Dołącz do mojej społeczności, gdzie celebrujemy porażki równie mocno jak zwycięstwa. Pamiętaj - 
                  nie musisz być najlepszy, żeby świetnie się bawić!
                </motion.p>
              </div>
              
              {/* Zdjęcie/Avatar */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-2xl shadow-xl border-4 border-primary">
                  <Image
                    src="/meme.jpg"
                    alt="NieUmiemGrac - Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Dekoracyjne elementy */}
                <div className="absolute -top-4 -left-4 w-16 h-16 border-t-4 border-l-4 border-primary"></div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-4 border-r-4 border-primary"></div>
              </motion.div>
            </div>
            
            {/* Historia i misja */}
            <div className="bg-dark-300 rounded-lg p-8 shadow-lg mb-16">
              <h2 className="text-2xl font-bold text-light-100 mb-6 text-center">Moja historia i misja</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-4">Jak to się zaczęło?</h3>
                  <p className="text-light-300 mb-4 leading-relaxed">
                    Moja przygoda ze streamowaniem zaczęła się przypadkowo. Podczas pandemii w 2020 roku, kiedy wszyscy siedzieliśmy w domach, 
                    postanowiłem podzielić się swoją rozgrywką z przyjaciółmi. To, co miało być jednorazowym wydarzeniem, 
                    przerodziło się w regularną aktywność.
                  </p>
                  <p className="text-light-300 leading-relaxed">
                    Szybko zauważyłem, że widzowie bardziej reagują na moje porażki i wpadki niż na momenty, kiedy wszystko idzie dobrze. 
                    Tak narodził się koncept &ldquo;NieUmiemGrac&rdquo; - streamera, który nie boi się pokazać, że nie jest profesjonalistą, 
                    a mimo to świetnie się bawi.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-primary mb-4">Moja misja</h3>
                  <p className="text-light-300 mb-4 leading-relaxed">
                    Moją misją jest stworzenie przyjaznej i inkluzywnej społeczności, gdzie każdy może się dobrze bawić, 
                    niezależnie od poziomu umiejętności. Chcę pokazać, że gry to przede wszystkim rozrywka, a nie zawody.
                  </p>
                  <p className="text-light-300 leading-relaxed">
                    Staram się promować pozytywne podejście do porażek, uczyć się na błędach i cieszyć się procesem, 
                    a nie tylko wynikiem. W świecie, gdzie często liczy się tylko bycie najlepszym, 
                    chcę przypomnieć wszystkim o radości płynącej z samego grania.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Sprzęt i setup */}
            <div className="bg-dark-300 rounded-lg p-8 shadow-lg mb-16">
              <h2 className="text-2xl font-bold text-light-100 mb-6 text-center">Mój sprzęt i setup</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-dark-200 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-primary mb-4">Komputer</h3>
                  <ul className="space-y-2 text-light-300">
                    <li><span className="font-medium text-light-100">Procesor:</span> AMD Ryzen 9 5900X</li>
                    <li><span className="font-medium text-light-100">Karta graficzna:</span> NVIDIA GeForce RTX 3080</li>
                    <li><span className="font-medium text-light-100">RAM:</span> 32GB DDR4 3600MHz</li>
                    <li><span className="font-medium text-light-100">Dysk:</span> 2TB NVMe SSD</li>
                    <li><span className="font-medium text-light-100">Chłodzenie:</span> NZXT Kraken X63</li>
                    <li><span className="font-medium text-light-100">Obudowa:</span> Lian Li PC-O11 Dynamic</li>
                  </ul>
                </div>
                
                <div className="bg-dark-200 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-primary mb-4">Peryferia</h3>
                  <ul className="space-y-2 text-light-300">
                    <li><span className="font-medium text-light-100">Monitor:</span> 27&quot; 1440p 165Hz</li>
                    <li><span className="font-medium text-light-100">Klawiatura:</span> Logitech G915</li>
                    <li><span className="font-medium text-light-100">Mysz:</span> Logitech G Pro X Superlight</li>
                    <li><span className="font-medium text-light-100">Słuchawki:</span> Beyerdynamic DT 990 Pro</li>
                    <li><span className="font-medium text-light-100">Mikrofon:</span> Shure SM7B</li>
                    <li><span className="font-medium text-light-100">Interfejs audio:</span> GoXLR Mini</li>
                  </ul>
                </div>
                
                <div className="bg-dark-200 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-primary mb-4">Streaming</h3>
                  <ul className="space-y-2 text-light-300">
                    <li><span className="font-medium text-light-100">Kamera:</span> Sony A6400</li>
                    <li><span className="font-medium text-light-100">Obiektyw:</span> Sigma 16mm f/1.4</li>
                    <li><span className="font-medium text-light-100">Capture Card:</span> Elgato 4K60 Pro</li>
                    <li><span className="font-medium text-light-100">Oświetlenie:</span> Elgato Key Light Air x2</li>
                    <li><span className="font-medium text-light-100">Stream Deck:</span> Elgato Stream Deck XL</li>
                    <li><span className="font-medium text-light-100">Software:</span> OBS Studio</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Harmonogram streamów */}
            <div className="bg-dark-300 p-8 rounded-lg shadow-lg mb-16">
              <h2 className="text-2xl font-bold text-light-100 mb-6 text-center flex items-center justify-center">
                <FaCalendarAlt className="text-primary mr-2" size={24} />
                Harmonogram Streamów
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
                {['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'].map((day, index) => (
                  <div key={day} className="bg-dark-200 p-4 rounded-lg text-center">
                    <h4 className="font-bold text-light-100 mb-2">{day}</h4>
                    {index < 5 ? (
                      <div>
                        <p className="text-primary font-medium flex items-center justify-center">
                          <FaClock className="mr-1" /> 19:00 - 22:00
                        </p>
                        <p className="text-light-400 text-sm mt-1">
                          {index === 0 ? 'Minecraft' : 
                           index === 1 ? 'CS:GO / Valorant' : 
                           index === 2 ? 'Gry z widzami' : 
                           index === 3 ? 'Nowości' : 'Różne gry'}
                        </p>
                      </div>
                    ) : index === 5 ? (
                      <div>
                        <p className="text-primary font-medium flex items-center justify-center">
                          <FaClock className="mr-1" /> 16:00 - 22:00
                        </p>
                        <p className="text-light-400 text-sm mt-1">Maraton</p>
                      </div>
                    ) : (
                      <p className="text-light-400">Dzień wolny</p>
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-light-400 text-center mt-4 text-sm">
                * Harmonogram może ulec zmianie. Śledź moje social media, aby być na bieżąco!
              </p>
            </div>
            
            {/* Kontakt i social media */}
            <div className="bg-dark-300 p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-light-100 mb-6 text-center">Kontakt i Social Media</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Formularz kontaktowy */}
                <div>
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
                    <FaEnvelope className="mr-2" /> Napisz do mnie
                  </h3>
                  
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-light-300 mb-1">Imię</label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full bg-dark-200 text-light-100 p-3 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Twoje imię"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-light-300 mb-1">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full bg-dark-200 text-light-100 p-3 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Twój adres email"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-light-300 mb-1">Wiadomość</label>
                      <textarea 
                        id="message" 
                        rows={5}
                        className="w-full bg-dark-200 text-light-100 p-3 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Twoja wiadomość..."
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="bg-primary hover:bg-primary/80 text-white py-3 px-6 rounded-md transition-colors w-full"
                    >
                      Wyślij wiadomość
                    </button>
                  </form>
                </div>
                
                {/* Social media */}
                <div>
                  <h3 className="text-xl font-bold text-primary mb-4">Znajdź mnie tutaj</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <a 
                      href="https://twitch.tv/nieumiemgrac" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-dark-200 p-4 rounded-lg hover:bg-dark-100 transition-colors"
                    >
                      <FaTwitch size={24} className="text-[#6441a5]" />
                      <div>
                        <p className="font-medium text-light-100">Twitch</p>
                        <p className="text-light-400 text-sm">@nieumiemgrac</p>
                      </div>
                    </a>
                    
                    <a 
                      href="https://youtube.com/@nieumiemgrac" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-dark-200 p-4 rounded-lg hover:bg-dark-100 transition-colors"
                    >
                      <FaYoutube size={24} className="text-[#ff0000]" />
                      <div>
                        <p className="font-medium text-light-100">YouTube</p>
                        <p className="text-light-400 text-sm">@nieumiemgrac</p>
                      </div>
                    </a>
                    
                    <a 
                      href="https://discord.gg/nieumiemgrac" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-dark-200 p-4 rounded-lg hover:bg-dark-100 transition-colors"
                    >
                      <FaDiscord size={24} className="text-[#5865F2]" />
                      <div>
                        <p className="font-medium text-light-100">Discord</p>
                        <p className="text-light-400 text-sm">discord.gg/nieumiemgrac</p>
                      </div>
                    </a>
                    
                    <a 
                      href="https://twitter.com/nieumiemgrac" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-dark-200 p-4 rounded-lg hover:bg-dark-100 transition-colors"
                    >
                      <FaTwitter size={24} className="text-[#1DA1F2]" />
                      <div>
                        <p className="font-medium text-light-100">Twitter</p>
                        <p className="text-light-400 text-sm">@nieumiemgrac</p>
                      </div>
                    </a>
                    
                    <a 
                      href="https://instagram.com/nieumiemgrac" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-dark-200 p-4 rounded-lg hover:bg-dark-100 transition-colors"
                    >
                      <FaInstagram size={24} className="text-[#E1306C]" />
                      <div>
                        <p className="font-medium text-light-100">Instagram</p>
                        <p className="text-light-400 text-sm">@nieumiemgrac</p>
                      </div>
                    </a>
                    
                    <a 
                      href="https://tiktok.com/@nieumiemgrac" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-dark-200 p-4 rounded-lg hover:bg-dark-100 transition-colors"
                    >
                      <FaTiktok size={24} className="text-[#00F2EA]" />
                      <div>
                        <p className="font-medium text-light-100">TikTok</p>
                        <p className="text-light-400 text-sm">@nieumiemgrac</p>
                      </div>
                    </a>
                  </div>
                  
                  <div className="mt-6 bg-dark-200 p-4 rounded-lg">
                    <h4 className="font-medium text-light-100 mb-2">Email biznesowy</h4>
                    <a 
                      href="mailto:kontakt@nieumiemgrac.pl" 
                      className="text-primary hover:underline"
                    >
                      kontakt@nieumiemgrac.pl
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}