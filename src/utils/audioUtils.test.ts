import { describe, it, expect } from 'vitest';
import {
  formatTime,
  getNextSongIndex,
  getPrevSongIndex,
  filterSongsByCategory,
  getActiveLyric
} from './audioUtils';
import type { Song } from '../types/music';

describe('Audio Utils (TDD)', () => {
  it('formatTime formats seconds into MM:SS correctly', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(215)).toBe('03:35');
    expect(formatTime(-10)).toBe('00:00');
    expect(formatTime(NaN)).toBe('00:00');
  });

  it('getNextSongIndex handles repeat-all, repeat-one, and shuffle', () => {
    // Normal sequential
    expect(getNextSongIndex(0, 5, 'repeat-all')).toBe(1);
    expect(getNextSongIndex(4, 5, 'repeat-all')).toBe(0);

    // Repeat one
    expect(getNextSongIndex(2, 5, 'repeat-one')).toBe(2);

    // Shuffle
    const shuffled = getNextSongIndex(1, 5, 'shuffle');
    expect(shuffled).toBeGreaterThanOrEqual(0);
    expect(shuffled).toBeLessThan(5);
  });

  it('getPrevSongIndex handles backward cycle correctly', () => {
    expect(getPrevSongIndex(0, 5)).toBe(4);
    expect(getPrevSongIndex(3, 5)).toBe(2);
  });

  it('filterSongsByCategory filters songs appropriately', () => {
    const mockSongs: Song[] = [
      { id: '1', title: 'Song 1', artist: 'Artist 1', category: 'nostalgia', duration: 100, src: '', cover: '' },
      { id: '2', title: 'Song 2', artist: 'Artist 2', category: 'lofi', duration: 120, src: '', cover: '' },
      { id: '3', title: 'Song 3', artist: 'Artist 3', category: 'relax', duration: 150, src: '', cover: '' },
    ];

    expect(filterSongsByCategory(mockSongs, 'all')).toHaveLength(3);
    expect(filterSongsByCategory(mockSongs, 'nostalgia')).toHaveLength(1);
    expect(filterSongsByCategory(mockSongs, 'lofi')[0].title).toBe('Song 2');
  });

  it('getActiveLyric finds the matching current lyric line', () => {
    const lyrics = [
      { time: 0, text: 'Konna koto ii na' },
      { time: 10, text: 'Dikitara ii na' },
      { time: 20, text: 'Anna yume konna yume' },
    ];

    expect(getActiveLyric(lyrics, 0)).toBe('Konna koto ii na');
    expect(getActiveLyric(lyrics, 5)).toBe('Konna koto ii na');
    expect(getActiveLyric(lyrics, 12)).toBe('Dikitara ii na');
    expect(getActiveLyric(lyrics, 25)).toBe('Anna yume konna yume');
  });
});
