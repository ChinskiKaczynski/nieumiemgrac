"use client";

import React from 'react';
import { FaTwitch, FaYoutube, FaDiscord, FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa';

interface SocialLinksProps {
  className?: string;
  iconSize?: number;
  showLabels?: boolean;
  layout?: 'horizontal' | 'vertical' | 'grid';
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  className = '',
  iconSize = 20,
  showLabels = false,
  layout = 'horizontal',
}) => {
  const socialLinks = [
    {
      name: 'Twitch',
      url: 'https://twitch.tv/nieumiemgrac',
      icon: FaTwitch,
      color: '#6441a5',
      hoverColor: '#9146ff',
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@nieumiemgrac',
      icon: FaYoutube,
      color: '#ff0000',
      hoverColor: '#ff3333',
    },
    {
      name: 'Discord',
      url: 'https://discord.gg/nieumiemgrac',
      icon: FaDiscord,
      color: '#5865F2',
      hoverColor: '#7289da',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/nieumiemgrac',
      icon: FaTwitter,
      color: '#1DA1F2',
      hoverColor: '#4db5f5',
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/nieumiemgrac',
      icon: FaInstagram,
      color: '#E1306C',
      hoverColor: '#e95c8f',
    },
    {
      name: 'TikTok',
      url: 'https://tiktok.com/@nieumiemgrac',
      icon: FaTiktok,
      color: '#00F2EA',
      hoverColor: '#69f7f2',
    },
  ];

  const getLayoutClasses = () => {
    switch (layout) {
      case 'vertical':
        return 'flex flex-col space-y-4';
      case 'grid':
        return 'grid grid-cols-3 gap-4';
      case 'horizontal':
      default:
        return 'flex flex-wrap space-x-4';
    }
  };

  return (
    <div className={`${getLayoutClasses()} ${className}`}>
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`transition-colors flex items-center ${
            showLabels ? 'gap-2' : ''
          }`}
          style={{
            color: social.color,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = social.hoverColor;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = social.color;
          }}
          aria-label={social.name}
        >
          <social.icon size={iconSize} />
          {showLabels && <span>{social.name}</span>}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;