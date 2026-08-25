import type { Song, PlaybackMode } from '../types/music';

/**
 * Formats seconds into MM:SS display format
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Computes the next song index based on playback mode
 */
export function getNextSongIndex(
  currentIndex: number,
  totalSongs: number,
  mode: PlaybackMode
): number {
  if (totalSongs <= 0) return -1;
  if (totalSongs === 1) return 0;

  if (mode === 'repeat-one') {
    return currentIndex;
  }

  if (mode === 'shuffle') {
    let nextIndex = Math.floor(Math.random() * totalSongs);
    if (nextIndex === currentIndex) {
      nextIndex = (currentIndex + 1) % totalSongs;
    }
    return nextIndex;
  }

  // default 'repeat-all' or sequential
  return (currentIndex + 1) % totalSongs;
}

/**
 * Computes the previous song index
 */
export function getPrevSongIndex(
  currentIndex: number,
  totalSongs: number
): number {
  if (totalSongs <= 0) return -1;
  return (currentIndex - 1 + totalSongs) % totalSongs;
}

/**
 * Filters songs by category
 */
export function filterSongsByCategory(
  songs: Song[],
  category: 'all' | 'nostalgia' | 'lofi' | 'relax'
): Song[] {
  if (category === 'all') return songs;
  return songs.filter(song => song.category === category);
}

/**
 * Finds the active lyric item based on current audio time
 */
export function getActiveLyric(
  lyrics: Array<{ time: number; text: string }> | undefined,
  currentTime: number
): string {
  if (!lyrics || lyrics.length === 0) return '';
  let active = '';
  for (const item of lyrics) {
    if (currentTime >= item.time) {
      active = item.text;
    } else {
      break;
    }
  }
  return active;
}
