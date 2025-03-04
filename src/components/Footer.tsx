import React from 'react';
import Link from 'next/link';
import { FaTwitch, FaYoutube, FaDiscord, FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-500 border-t border-gray-800 py-8">
      <div className="container mx-auto px-4">
        {/* Top section with links and social media */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Navigation Links */}
          <div>
            <h3 className="text-light-100 font-bold text-lg mb-4">Nawigacja</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-light-400 hover:text-primary transition-colors">
                  Stream
                </Link>
              </li>
              <li>
                <Link href="/archiwum" className="text-light-400 hover:text-primary transition-colors">
                  Archiwum
                </Link>
              </li>
              <li>
                <Link href="/statystyki" className="text-light-400 hover:text-primary transition-colors">
                  Statystyki
                </Link>
              </li>
              <li>
                <Link href="/o-mnie" className="text-light-400 hover:text-primary transition-colors">
                  O mnie
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-light-100 font-bold text-lg mb-4">Social Media</h3>
            <div className="grid grid-cols-3 gap-4">
              <a 
                href="https://twitch.tv/nieumiemgrac" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center text-light-400 hover:text-primary transition-colors"
                aria-label="Twitch"
              >
                <FaTwitch size={24} />
                <span className="text-sm mt-1">Twitch</span>
              </a>
              <a 
                href="https://youtube.com/@nieumiemgrac" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center text-light-400 hover:text-secondary transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube size={24} />
                <span className="text-sm mt-1">YouTube</span>
              </a>
              <a 
                href="https://discord.gg/nieumiemgrac" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center text-light-400 hover:text-[#5865F2] transition-colors"
                aria-label="Discord"
              >
                <FaDiscord size={24} />
                <span className="text-sm mt-1">Discord</span>
              </a>
              <a 
                href="https://twitter.com/nieumiemgrac" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center text-light-400 hover:text-[#1DA1F2] transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={24} />
                <span className="text-sm mt-1">Twitter</span>
              </a>
              <a 
                href="https://instagram.com/nieumiemgrac" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center text-light-400 hover:text-[#E1306C] transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
                <span className="text-sm mt-1">Instagram</span>
              </a>
              <a 
                href="https://tiktok.com/@nieumiemgrac" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center text-light-400 hover:text-[#00F2EA] transition-colors"
                aria-label="TikTok"
              >
                <FaTiktok size={24} />
                <span className="text-sm mt-1">TikTok</span>
              </a>
            </div>
          </div>

          {/* Newsletter or Contact */}
          <div>
            <h3 className="text-light-100 font-bold text-lg mb-4">Kontakt</h3>
            <p className="text-light-400 mb-4">
              Masz pytania lub propozycje współpracy? Napisz do mnie!
            </p>
            <a 
              href="mailto:kontakt@nieumiemgrac.pl"
              className="inline-block bg-primary hover:bg-primary/80 text-white py-2 px-4 rounded transition-colors"
            >
              kontakt@nieumiemgrac.pl
            </a>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-light-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} NieUmiemGrac.pl. Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex space-x-4 text-sm text-light-400">
            <Link href="/polityka-prywatnosci" className="hover:text-primary transition-colors">
              Polityka Prywatności
            </Link>
            <Link href="/regulamin" className="hover:text-primary transition-colors">
              Regulamin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;