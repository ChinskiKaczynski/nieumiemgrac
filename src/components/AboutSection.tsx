"use client";

import React from 'react';
import Image from 'next/image';
import { FaGamepad, FaTwitch, FaYoutube, FaDiscord, FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AboutSection: React.FC = () => {
  return (
    <section className="py-16 bg-dark-400">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-light-100 mb-12 text-center flex items-center justify-center">
          <FaGamepad className="text-primary mr-3" size={28} />
          O mnie
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Informacje o streamerze */}
          <div>
            <motion.h3 
              className="text-2xl font-bold text-light-100 mb-4 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Cześć, jestem NieUmiemGrac!
            </motion.h3>
            
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
              className="text-light-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Dołącz do mojej społeczności, gdzie celebrujemy porażki równie mocno jak zwycięstwa. Pamiętaj - 
              nie musisz być najlepszy, żeby świetnie się bawić!
            </motion.p>
            
            {/* Social media */}
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <a 
                href="https://twitch.tv/nie_umiem_grac_jednak" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white py-2 px-4 rounded-full transition-colors"
              >
                <FaTwitch size={18} />
                <span>Twitch</span>
              </a>
              <a 
                href="https://youtube.com/@nie_umiem_grac_jednak" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-white py-2 px-4 rounded-full transition-colors"
              >
                <FaYoutube size={18} />
                <span>YouTube</span>
              </a>
              <a 
                href="https://discord.gg/nie_umiem_grac_jednak" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#5865F2]/80 text-white py-2 px-4 rounded-full transition-colors"
              >
                <FaDiscord size={18} />
                <span>Discord</span>
              </a>
              <a 
                href="https://twitter.com/nie_umiem_grac_jednak" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#1DA1F2]/80 text-white py-2 px-4 rounded-full transition-colors"
              >
                <FaTwitter size={18} />
                <span>Twitter</span>
              </a>
              <a 
                href="https://instagram.com/nie_umiem_grac_jednak" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#E1306C] hover:bg-[#E1306C]/80 text-white py-2 px-4 rounded-full transition-colors"
              >
                <FaInstagram size={18} />
                <span>Instagram</span>
              </a>
              <a 
                href="https://tiktok.com/@nie_umiem_grac_jednak" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#00F2EA] hover:bg-[#00F2EA]/80 text-black py-2 px-4 rounded-full transition-colors"
              >
                <FaTiktok size={18} />
                <span>TikTok</span>
              </a>
            </motion.div>
          </div>
          
          {/* Mem związany z graniem */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-lg shadow-xl border-4 border-primary">
              <Image
                src="/meme.jpg"
                alt="Mem związany z graniem"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Dekoracyjne elementy */}
            <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-primary"></div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-primary"></div>
            
            {/* Podpis pod memem */}
            <div className="text-center mt-6">
              <p className="text-light-300 italic">
                &ldquo;Kiedy myślisz, że jesteś dobry w grze, ale rzeczywistość szybko weryfikuje...&rdquo;
              </p>
              <p className="text-primary font-bold mt-2">
                #NieUmiemGrac
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Harmonogram streamów */}
        <motion.div 
          className="mt-16 bg-dark-300 p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-light-100 mb-6 text-center">Harmonogram Streamów</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
            {['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'].map((day, index) => (
              <div key={day} className="bg-dark-200 p-4 rounded-lg text-center">
                <h4 className="font-bold text-light-100 mb-2">{day}</h4>
                {index < 5 ? (
                  <p className="text-primary font-medium">19:00 - 22:00</p>
                ) : index === 5 ? (
                  <p className="text-primary font-medium">16:00 - 22:00</p>
                ) : (
                  <p className="text-light-400">Dzień wolny</p>
                )}
              </div>
            ))}
          </div>
          
          <p className="text-light-400 text-center mt-4 text-sm">
            * Harmonogram może ulec zmianie. Śledź moje social media, aby być na bieżąco!
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;