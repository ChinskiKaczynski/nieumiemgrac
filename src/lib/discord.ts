import axios from 'axios';
import { TwitchStream } from './twitch';
import { YouTubeLiveStream } from './youtube';

// Typy danych
export interface DiscordWebhookMessage {
  content?: string;
  username?: string;
  avatar_url?: string;
  tts?: boolean;
  embeds?: DiscordEmbed[];
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: {
    text: string;
    icon_url?: string;
  };
  image?: {
    url: string;
  };
  thumbnail?: {
    url: string;
  };
  author?: {
    name: string;
    url?: string;
    icon_url?: string;
  };
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
}

// Konfiguracja
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/example/placeholder';
const STREAMER_NAME = process.env.STREAMER_NAME || 'NieUmiemGrac';
const STREAMER_AVATAR = process.env.STREAMER_AVATAR || 'https://nieumiemgrac.pl/logo.png';
const WEBSITE_URL = process.env.WEBSITE_URL || 'https://nieumiemgrac.pl';
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCuhEFa4jQBOa5UOAJ52sa0g';

// Kolory dla różnych platform
const TWITCH_COLOR = 0x6441a5; // Fioletowy kolor Twitch
const YOUTUBE_COLOR = 0xff0000; // Czerwony kolor YouTube

// Funkcja do wysyłania powiadomienia o streamie na Twitch
export async function sendTwitchStreamNotification(stream: TwitchStream): Promise<boolean> {
  try {
    if (!DISCORD_WEBHOOK_URL) {
      console.error('Brak skonfigurowanego URL Webhooka Discord');
      return false;
    }

    const thumbnailUrl = stream.thumbnail_url
      .replace('{width}', '1280')
      .replace('{height}', '720');

    const message: DiscordWebhookMessage = {
      username: `${STREAMER_NAME} Bot`,
      avatar_url: STREAMER_AVATAR,
      content: `@everyone **${STREAMER_NAME} jest teraz na żywo na Twitch!**`,
      embeds: [
        {
          title: stream.title,
          url: `https://twitch.tv/${stream.user_name}`,
          color: TWITCH_COLOR,
          description: `**${STREAMER_NAME}** streamuje **${stream.game_name}** na Twitch!\n\nDołącz do streamu i baw się razem z nami!`,
          timestamp: new Date().toISOString(),
          image: {
            url: thumbnailUrl,
          },
          thumbnail: {
            url: STREAMER_AVATAR,
          },
          author: {
            name: `${STREAMER_NAME} na Twitch`,
            url: `https://twitch.tv/${stream.user_name}`,
            icon_url: 'https://static.twitchcdn.net/assets/favicon-32-d6025c14e900565d6177.png',
          },
          fields: [
            {
              name: '🎮 Gra',
              value: stream.game_name,
              inline: true,
            },
            {
              name: '👁️ Widzowie',
              value: stream.viewer_count.toString(),
              inline: true,
            },
            {
              name: '🌐 Oglądaj na stronie',
              value: `[${WEBSITE_URL.replace('https://', '')}](${WEBSITE_URL})`,
              inline: true,
            },
          ],
          footer: {
            text: `${STREAMER_NAME} - Oficjalna strona`,
            icon_url: STREAMER_AVATAR,
          },
        },
      ],
    };

    await axios.post(DISCORD_WEBHOOK_URL, message);
    return true;
  } catch (error) {
    console.error('Błąd podczas wysyłania powiadomienia Discord o streamie Twitch:', error);
    return false;
  }
}

// Funkcja do wysyłania powiadomienia o streamie na YouTube
export async function sendYouTubeStreamNotification(stream: YouTubeLiveStream): Promise<boolean> {
  try {
    if (!DISCORD_WEBHOOK_URL) {
      console.error('Brak skonfigurowanego URL Webhooka Discord');
      return false;
    }

    const thumbnailUrl = stream.thumbnails.maxres?.url || 
                         stream.thumbnails.standard?.url || 
                         stream.thumbnails.high.url;

    const message: DiscordWebhookMessage = {
      username: `${STREAMER_NAME} Bot`,
      avatar_url: STREAMER_AVATAR,
      content: `@everyone **${STREAMER_NAME} jest teraz na żywo na YouTube!**`,
      embeds: [
        {
          title: stream.title,
          url: `https://youtube.com/watch?v=${stream.id}`,
          color: YOUTUBE_COLOR,
          description: `**${STREAMER_NAME}** streamuje na YouTube!\n\nDołącz do streamu i baw się razem z nami!`,
          timestamp: new Date().toISOString(),
          image: {
            url: thumbnailUrl,
          },
          thumbnail: {
            url: STREAMER_AVATAR,
          },
          author: {
            name: `${STREAMER_NAME} na YouTube`,
            url: `https://youtube.com/channel/${stream.channelId}`,
            icon_url: 'https://www.youtube.com/s/desktop/3a84d4c0/img/favicon_32.png',
          },
          fields: [
            {
              name: '📺 Platforma',
              value: 'YouTube',
              inline: true,
            },
            {
              name: '🌐 Oglądaj na stronie',
              value: `[${WEBSITE_URL.replace('https://', '')}](${WEBSITE_URL})`,
              inline: true,
            },
          ],
          footer: {
            text: `${STREAMER_NAME} - Oficjalna strona`,
            icon_url: STREAMER_AVATAR,
          },
        },
      ],
    };

    await axios.post(DISCORD_WEBHOOK_URL, message);
    return true;
  } catch (error) {
    console.error('Błąd podczas wysyłania powiadomienia Discord o streamie YouTube:', error);
    return false;
  }
}

// Funkcja do wysyłania powiadomienia o nowym filmie na YouTube
export async function sendYouTubeVideoNotification(
  videoTitle: string,
  videoId: string,
  thumbnailUrl: string,
  description: string
): Promise<boolean> {
  try {
    if (!DISCORD_WEBHOOK_URL) {
      console.error('Brak skonfigurowanego URL Webhooka Discord');
      return false;
    }

    const message: DiscordWebhookMessage = {
      username: `${STREAMER_NAME} Bot`,
      avatar_url: STREAMER_AVATAR,
      content: `**Nowy film na kanale ${STREAMER_NAME}!**`,
      embeds: [
        {
          title: videoTitle,
          url: `https://youtube.com/watch?v=${videoId}`,
          color: YOUTUBE_COLOR,
          description: description.length > 200 ? description.substring(0, 200) + '...' : description,
          timestamp: new Date().toISOString(),
          image: {
            url: thumbnailUrl,
          },
          thumbnail: {
            url: STREAMER_AVATAR,
          },
          author: {
            name: `${STREAMER_NAME} na YouTube`,
            url: `https://youtube.com/channel/${YOUTUBE_CHANNEL_ID}`,
            icon_url: 'https://www.youtube.com/s/desktop/3a84d4c0/img/favicon_32.png',
          },
          footer: {
            text: `${STREAMER_NAME} - Oficjalna strona`,
            icon_url: STREAMER_AVATAR,
          },
        },
      ],
    };

    await axios.post(DISCORD_WEBHOOK_URL, message);
    return true;
  } catch (error) {
    console.error('Błąd podczas wysyłania powiadomienia Discord o nowym filmie YouTube:', error);
    return false;
  }
}

// Funkcja do wysyłania powiadomienia o zaplanowanym streamie
export async function sendStreamScheduleNotification(
  platform: 'twitch' | 'youtube',
  title: string,
  scheduledTime: Date,
  gameTitle?: string
): Promise<boolean> {
  try {
    if (!DISCORD_WEBHOOK_URL) {
      console.error('Brak skonfigurowanego URL Webhooka Discord');
      return false;
    }

    const platformColor = platform === 'twitch' ? TWITCH_COLOR : YOUTUBE_COLOR;
    const platformName = platform === 'twitch' ? 'Twitch' : 'YouTube';
    const platformUrl = platform === 'twitch' 
      ? `https://twitch.tv/${STREAMER_NAME.toLowerCase()}`
      : `https://youtube.com/channel/${YOUTUBE_CHANNEL_ID}`;
    const platformIcon = platform === 'twitch'
      ? 'https://static.twitchcdn.net/assets/favicon-32-d6025c14e900565d6177.png'
      : 'https://www.youtube.com/s/desktop/3a84d4c0/img/favicon_32.png';

    // Formatowanie daty i czasu
    const formattedDate = scheduledTime.toLocaleDateString('pl-PL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    const formattedTime = scheduledTime.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const message: DiscordWebhookMessage = {
      username: `${STREAMER_NAME} Bot`,
      avatar_url: STREAMER_AVATAR,
      content: `**${STREAMER_NAME} zaplanował stream na ${platformName}!**`,
      embeds: [
        {
          title: title,
          url: platformUrl,
          color: platformColor,
          description: `**${STREAMER_NAME}** będzie streamować ${gameTitle ? `**${gameTitle}**` : ''} na ${platformName}!\n\nZaplanowany czas: **${formattedDate}** o **${formattedTime}**\n\nDodaj do kalendarza i nie przegap!`,
          timestamp: new Date().toISOString(),
          thumbnail: {
            url: STREAMER_AVATAR,
          },
          author: {
            name: `${STREAMER_NAME} na ${platformName}`,
            url: platformUrl,
            icon_url: platformIcon,
          },
          fields: [
            {
              name: '📅 Data',
              value: formattedDate,
              inline: true,
            },
            {
              name: '⏰ Godzina',
              value: formattedTime,
              inline: true,
            },
            {
              name: '📺 Platforma',
              value: platformName,
              inline: true,
            },
            ...(gameTitle ? [{
              name: '🎮 Gra',
              value: gameTitle,
              inline: true,
            }] : []),
            {
              name: '🌐 Oglądaj na stronie',
              value: `[${WEBSITE_URL.replace('https://', '')}](${WEBSITE_URL})`,
              inline: true,
            },
          ],
          footer: {
            text: `${STREAMER_NAME} - Oficjalna strona`,
            icon_url: STREAMER_AVATAR,
          },
        },
      ],
    };

    await axios.post(DISCORD_WEBHOOK_URL, message);
    return true;
  } catch (error) {
    console.error('Błąd podczas wysyłania powiadomienia Discord o zaplanowanym streamie:', error);
    return false;
  }
}