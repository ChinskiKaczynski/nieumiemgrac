import axios from 'axios';

// Typy danych
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
    standard?: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
  };
  channelTitle: string;
  channelId: string;
  liveBroadcastContent: string;
  duration?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
}

export interface YouTubeLiveStream {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
    standard?: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
  };
  channelTitle: string;
  channelId: string;
  liveBroadcastContent: string;
  actualStartTime?: string;
  scheduledStartTime?: string;
  concurrentViewers?: number;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
}

// Interfejsy dla odpowiedzi API
interface YouTubeSearchItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
      standard?: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
    channelTitle: string;
    channelId: string;
    liveBroadcastContent: string;
  };
}

interface YouTubeVideoItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
      standard?: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
    channelTitle: string;
    channelId: string;
    liveBroadcastContent: string;
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

// Konfiguracja
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID; // Przykładowe ID kanału Google Developers - zmień na swoje

// Funkcja do sprawdzenia, czy kanał jest aktualnie na żywo
export async function checkYouTubeLiveStatus(channelId: string = YOUTUBE_CHANNEL_ID): Promise<YouTubeLiveStream | null> {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=live&key=${YOUTUBE_API_KEY}`
    );

    const items = response.data.items as YouTubeSearchItem[];
    
    if (items.length > 0) {
      const liveStream = items[0];
      
      return {
        id: liveStream.id.videoId,
        title: liveStream.snippet.title,
        description: liveStream.snippet.description,
        thumbnails: liveStream.snippet.thumbnails,
        channelTitle: liveStream.snippet.channelTitle,
        channelId: liveStream.snippet.channelId,
        liveBroadcastContent: liveStream.snippet.liveBroadcastContent,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Błąd podczas sprawdzania statusu streamu YouTube:', error);
    return null;
  }
}

// Funkcja do pobierania informacji o kanale
export async function getYouTubeChannelInfo(channelId: string = YOUTUBE_CHANNEL_ID): Promise<YouTubeChannel | null> {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );

    const items = response.data.items;
    
    if (items.length > 0) {
      const channel = items[0];
      
      return {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        customUrl: channel.snippet.customUrl,
        publishedAt: channel.snippet.publishedAt,
        thumbnails: channel.snippet.thumbnails,
        statistics: channel.statistics,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Błąd podczas pobierania informacji o kanale YouTube:', error);
    return null;
  }
}

// Funkcja do pobierania ostatnich filmów
export async function getYouTubeVideos(
  channelId: string = YOUTUBE_CHANNEL_ID,
  limit: number = 10
): Promise<YouTubeVideo[]> {
  try {
    // Najpierw pobierz ID filmów
    const searchResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${limit}&order=date&type=video&key=${YOUTUBE_API_KEY}`
    );

    const videoIds = (searchResponse.data.items as YouTubeSearchItem[])
      .map((item) => item.id.videoId)
      .join(',');
    
    // Następnie pobierz szczegółowe informacje o filmach
    const videosResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );

    return (videosResponse.data.items as YouTubeVideoItem[]).map((item) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnails: item.snippet.thumbnails,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      liveBroadcastContent: item.snippet.liveBroadcastContent,
      duration: item.contentDetails.duration,
      viewCount: parseInt(item.statistics.viewCount, 10),
      likeCount: parseInt(item.statistics.likeCount, 10),
      commentCount: parseInt(item.statistics.commentCount, 10),
    }));
  } catch (error) {
    console.error('Błąd podczas pobierania filmów YouTube:', error);
    return [];
  }
}

// Funkcja do pobierania popularnych filmów
export async function getPopularYouTubeVideos(
  channelId: string = YOUTUBE_CHANNEL_ID,
  limit: number = 10
): Promise<YouTubeVideo[]> {
  try {
    // Pobierz filmy posortowane według liczby wyświetleń
    const searchResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${limit * 2}&order=viewCount&type=video&key=${YOUTUBE_API_KEY}`
    );

    const videoIds = (searchResponse.data.items as YouTubeSearchItem[])
      .map((item) => item.id.videoId)
      .join(',');
    
    // Następnie pobierz szczegółowe informacje o filmach
    const videosResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );

    // Sortuj według liczby wyświetleń i ogranicz do żądanej liczby
    return (videosResponse.data.items as YouTubeVideoItem[])
      .map((item) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnails: item.snippet.thumbnails,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        liveBroadcastContent: item.snippet.liveBroadcastContent,
        duration: item.contentDetails.duration,
        viewCount: parseInt(item.statistics.viewCount, 10),
        likeCount: parseInt(item.statistics.likeCount, 10),
        commentCount: parseInt(item.statistics.commentCount, 10),
      }))
      .sort((a: YouTubeVideo, b: YouTubeVideo) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, limit);
  } catch (error) {
    console.error('Błąd podczas pobierania popularnych filmów YouTube:', error);
    return [];
  }
}

// Funkcja do formatowania czasu trwania
export function formatYouTubeDuration(duration: string): string {
  // YouTube zwraca czas trwania w formacie ISO 8601, np. "PT1H2M3S"
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
  if (!match) {
    return '0:00';
  }
  
  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const seconds = match[3] ? parseInt(match[3], 10) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Funkcja do formatowania liczby wyświetleń
export function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  
  return count.toString();
}

// Funkcja do pobierania ID aktualnego streamu na żywo
export async function getLiveStreamId(channelId: string = YOUTUBE_CHANNEL_ID): Promise<string | null> {
  try {
    const liveStream = await checkYouTubeLiveStatus(channelId);
    
    if (liveStream) {
      return liveStream.id;
    }
    
    return null;
  } catch (error) {
    console.error('Błąd podczas pobierania ID streamu na żywo:', error);
    return null;
  }
}