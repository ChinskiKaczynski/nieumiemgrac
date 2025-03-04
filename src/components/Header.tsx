"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTwitch, FaYoutube, FaDiscord, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-400/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative h-10 w-10 mr-2">
            <Image 
              src="/logo.png" 
              alt="NieUmiemGrac Logo" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold gradient-text">NieUmiemGrac.pl</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-light-100 hover:text-primary transition-colors">
            Stream
          </Link>
          <Link href="/archiwum" className="text-light-100 hover:text-primary transition-colors">
            Archiwum
          </Link>
          <Link href="/statystyki" className="text-light-100 hover:text-primary transition-colors">
            Statystyki
          </Link>
          <Link href="/o-mnie" className="text-light-100 hover:text-primary transition-colors">
            O mnie
          </Link>
          
          {/* Social Media Icons */}
          <div className="flex items-center space-x-3 ml-4">
            <a 
              href="https://twitch.tv/nieumiemgrac" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-light-100 hover:text-primary transition-colors"
              aria-label="Twitch"
            >
              <FaTwitch size={20} />
            </a>
            <a 
              href="https://youtube.com/@nieumiemgrac" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-light-100 hover:text-secondary transition-colors"
              aria-label="YouTube"
            >
              <FaYoutube size={20} />
            </a>
            <a 
              href="https://discord.gg/nieumiemgrac" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-light-100 hover:text-[#5865F2] transition-colors"
              aria-label="Discord"
            >
              <FaDiscord size={20} />
            </a>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-light-100 focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Zamknij menu" : "Otwórz menu"}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-300 border-t border-gray-800">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              href="/" 
              className="text-light-100 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Stream
            </Link>
            <Link 
              href="/archiwum" 
              className="text-light-100 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Archiwum
            </Link>
            <Link 
              href="/statystyki" 
              className="text-light-100 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Statystyki
            </Link>
            <Link 
              href="/o-mnie" 
              className="text-light-100 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              O mnie
            </Link>
            
            {/* Social Media Icons */}
            <div className="flex items-center space-x-6 py-2">
              <a 
                href="https://twitch.tv/nieumiemgrac" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-light-100 hover:text-primary transition-colors"
                aria-label="Twitch"
              >
                <FaTwitch size={20} />
                <span className="ml-2">Twitch</span>
              </a>
              <a 
                href="https://youtube.com/@nieumiemgrac" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-light-100 hover:text-secondary transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube size={20} />
                <span className="ml-2">YouTube</span>
              </a>
              <a 
                href="https://discord.gg/nieumiemgrac" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-light-100 hover:text-[#5865F2] transition-colors"
                aria-label="Discord"
              >
                <FaDiscord size={20} />
                <span className="ml-2">Discord</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;