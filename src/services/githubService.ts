import type { Song } from '../types/music';

export const DEFAULT_GITHUB_PLAYLIST_URL = '/playlist.json';

/**
 * Converts a GitHub web/blob URL into a direct raw URL
 */
export function formatGitHubRawUrl(url: string): string {
  if (!url || typeof url !== 'string') return DEFAULT_GITHUB_PLAYLIST_URL;
  const trimmed = url.trim();

  // If user pasted a github blob link
  if (trimmed.includes('github.com') && trimmed.includes('/blob/')) {
    return trimmed
      .replace('https://github.com/', 'https://raw.githubusercontent.com/')
      .replace('/blob/', '/');
  }

  return trimmed;
}

/**
 * Validates and cleans raw JSON data into typed Song[]
 */
export function validatePlaylist(data: unknown): Song[] {
  if (!Array.isArray(data)) return [];

  const validSongs: Song[] = [];

  for (const item of data) {
    if (
      item &&
      typeof item === 'object' &&
      'id' in item &&
      'title' in item &&
      'src' in item &&
      typeof (item as Song).title === 'string' &&
      typeof (item as Song).src === 'string' &&
      (item as Song).src.trim() !== ''
    ) {
      const typed = item as Partial<Song>;
      validSongs.push({
        id: String(typed.id || `song-${Date.now()}-${Math.random()}`),
        title: String(typed.title),
        artist: String(typed.artist || 'Doraemon Music'),
        category: (typed.category as Song['category']) || 'all',
        duration: Number(typed.duration) || 180,
        src: String(typed.src),
        cover:
          String(typed.cover) ||
          'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
        lyrics: Array.isArray(typed.lyrics) ? typed.lyrics : [],
        isLocal: false,
      });
    }
  }

  return validSongs;
}

/**
 * Merges newly fetched remote songs while preserving user's locally uploaded songs
 */
export function mergeRemoteWithLocal(currentList: Song[], remoteList: Song[]): Song[] {
  const localSongs = currentList.filter((s) => s.isLocal);
  return [...localSongs, ...remoteList];
}

/**
 * Fetches playlist.json from GitHub URL with timeout
 */
export async function fetchPlaylistFromGitHub(customUrl?: string): Promise<Song[]> {
  const targetUrl = formatGitHubRawUrl(customUrl || DEFAULT_GITHUB_PLAYLIST_URL);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const res = await fetch(targetUrl, {
      signal: controller.signal,
      cache: 'no-cache',
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const data = await res.json();
    return validatePlaylist(data);
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`[GitHubSync] Could not fetch playlist from ${targetUrl}:`, error);
    throw error;
  }
}
