import axios from 'axios';

// Typy danych
export interface TwitchStream {
  id: string;
  user_id: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  is_mature: boolean;
}

export interface TwitchVideo {
  id: string;
  user_id: string;
  user_name: string;
  title: string;
  description: string;
  created_at: string;
  published_at: string;
  url: string;
  thumbnail_url: string;
  viewable: string;
  view_count: number;
  language: string;
  type: string;
  duration: string;
}

export interface TwitchClip {
  id: string;
  url: string;
  embed_url: string;
  broadcaster_id: string;
  broadcaster_name: string;
  creator_id: string;
  creator_name: string;
  video_id: string;
  game_id: string;
  language: string;
  title: string;
  view_count: number;
  created_at: string;
  thumbnail_url: string;
  duration: number;
}

export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
}

// Konfiguracja
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || '5ss3llyo0kduksikksfa1re7jbt4ja';
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET || 'hn49c6ocqvpbg49ray7nsmjqokunje';
const TWITCH_CHANNEL_NAME = process.env.TWITCH_CHANNEL_NAME || 'nie_umiem_grac_jednak'; // Nazwa kanału Twitch

// Funkcja do uzyskania tokenu dostępu
let accessToken = '';
let tokenExpiry: number = 0;

async function getTwitchAccessToken(): Promise<string> {
  // Sprawdź, czy token jest ważny
  if (accessToken && tokenExpiry > Date.now()) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`
    );

    const newToken = response.data.access_token;
    if (!newToken) {
      throw new Error('Otrzymano pusty token dostępu Twitch');
    }

    accessToken = newToken;
    // Ustaw czas wygaśnięcia tokenu (zwykle 60 dni, ale dla bezpieczeństwa ustawiamy na 50 dni)
    tokenExpiry = Date.now() + 50 * 24 * 60 * 60 * 1000;
    
    return accessToken;
  } catch (error) {
    console.error('Błąd podczas uzyskiwania tokenu dostępu Twitch:', error);
    throw new Error('Nie udało się uzyskać tokenu dostępu Twitch');
  }
}

// Funkcja do sprawdzenia, czy kanał jest aktualnie na żywo
export async function checkTwitchStreamStatus(channelName: string = TWITCH_CHANNEL_NAME): Promise<TwitchStream | null> {
  try {
    const token = await getTwitchAccessToken();
    
    const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${channelName}`, {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`
      }
    });

    const streams = response.data.data;
    
    if (streams.length > 0) {
      return streams[0] as TwitchStream;
    }
    
    return null;
  } catch (error) {
    console.error('Błąd podczas sprawdzania statusu streamu Twitch:', error);
    return null;
  }
}

// Funkcja do pobierania informacji o użytkowniku
export async function getTwitchUserInfo(channelName: string = TWITCH_CHANNEL_NAME): Promise<TwitchUser | null> {
  try {
    const token = await getTwitchAccessToken();
    
    const response = await axios.get(`https://api.twitch.tv/helix/users?login=${channelName}`, {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`
      }
    });

    const users = response.data.data;
    
    if (users.length > 0) {
      return users[0] as TwitchUser;
    }
    
    return null;
  } catch (error) {
    console.error('Błąd podczas pobierania informacji o użytkowniku Twitch:', error);
    return null;
  }
}

// Funkcja do pobierania ostatnich VOD-ów
export async function getTwitchVideos(
  channelName: string = TWITCH_CHANNEL_NAME,
  limit: number = 10
): Promise<TwitchVideo[]> {
  try {
    const token = await getTwitchAccessToken();
    const user = await getTwitchUserInfo(channelName);
    
    if (!user) {
      throw new Error('Nie znaleziono użytkownika Twitch');
    }
    
    const response = await axios.get(
      `https://api.twitch.tv/helix/videos?user_id=${user.id}&first=${limit}&type=archive`,
      {
        headers: {
          'Client-ID': TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data.data as TwitchVideo[];
  } catch (error) {
    console.error('Błąd podczas pobierania VOD-ów Twitch:', error);
    return [];
  }
}

// Funkcja do pobierania popularnych klipów
export async function getTwitchClips(
  channelName: string = TWITCH_CHANNEL_NAME,
  limit: number = 10,
  period: 'day' | 'week' | 'month' | 'all' = 'week'
): Promise<TwitchClip[]> {
  try {
    const token = await getTwitchAccessToken();
    const user = await getTwitchUserInfo(channelName);
    
    if (!user) {
      throw new Error('Nie znaleziono użytkownika Twitch');
    }
    
    // Oblicz zakres dat dla wybranego okresu
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'all':
        // Dla "all" nie ustawiamy daty początkowej
        startDate.setFullYear(2018, 0, 1); // Twitch przechowuje klipy od około 2018 roku
        break;
    }
    
    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();
    
    const response = await axios.get(
      `https://api.twitch.tv/helix/clips?broadcaster_id=${user.id}&first=${limit}&started_at=${startDateStr}&ended_at=${endDateStr}`,
      {
        headers: {
          'Client-ID': TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data.data as TwitchClip[];
  } catch (error) {
    console.error('Błąd podczas pobierania klipów Twitch:', error);
    return [];
  }
}

// Funkcja do formatowania URL miniaturki
export function formatTwitchThumbnailUrl(url: string, width: number = 320, height: number = 180): string {
  return url
    .replace('{width}', width.toString())
    .replace('{height}', height.toString());
}

// Funkcja do formatowania czasu trwania
export function formatTwitchDuration(duration: string): string {
  // Twitch zwraca czas trwania w formacie "1h2m3s"
  const hours = duration.match(/(\d+)h/);
  const minutes = duration.match(/(\d+)m/);
  const seconds = duration.match(/(\d+)s/);
  
  let formattedDuration = '';
  
  if (hours) {
    formattedDuration += `${hours[1]}:`;
  } else {
    formattedDuration += '0:';
  }
  
  if (minutes) {
    formattedDuration += minutes[1].padStart(2, '0') + ':';
  } else {
    formattedDuration += '00:';
  }
  
  if (seconds) {
    formattedDuration += seconds[1].padStart(2, '0');
  } else {
    formattedDuration += '00';
  }
  
  return formattedDuration;
}