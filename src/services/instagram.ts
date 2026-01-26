import axios from 'axios';

export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

export interface InstagramFeedResponse {
  data: InstagramPost[];
  paging?: {
    cursors?: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

/**
 * Fetches Instagram posts using the Basic Display API
 * This requires a valid access token from Instagram
 */
export const fetchInstagramPosts = async (
  accessToken: string,
  limit: number = 6
): Promise<InstagramPost[]> => {
  try {
    const response = await axios.get<InstagramFeedResponse>(
      'https://graph.instagram.com/me/media',
      {
        params: {
          fields: 'id,caption,media_type,media_url,permalink,timestamp',
          access_token: accessToken,
          limit,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    throw new Error('Failed to fetch Instagram posts');
  }
};

/**
 * Refreshes Instagram access token (tokens expire after 60 days)
 * You should call this periodically to keep the token fresh
 */
export const refreshInstagramToken = async (
  accessToken: string
): Promise<{ access_token: string; expires_in: number }> => {
  try {
    const response = await axios.get(
      'https://graph.instagram.com/refresh_access_token',
      {
        params: {
          grant_type: 'ig_refresh_token',
          access_token: accessToken,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error refreshing Instagram token:', error);
    throw new Error('Failed to refresh Instagram token');
  }
};
