import { describe, it, expect } from 'vitest';
import {
  formatGitHubRawUrl,
  validatePlaylist,
  mergeRemoteWithLocal,
} from './githubService';
import type { Song } from '../types/music';

describe('GitHub Playlist Service (TDD)', () => {
  it('formatGitHubRawUrl converts github web url to raw / cdn url correctly', () => {
    // Standard github blob url
    const blobUrl = 'https://github.com/user123/repo456/blob/main/playlist.json';
    expect(formatGitHubRawUrl(blobUrl)).toBe(
      'https://raw.githubusercontent.com/user123/repo456/main/playlist.json'
    );

    // Direct raw url should remain unchanged
    const rawUrl = 'https://raw.githubusercontent.com/user/repo/main/playlist.json';
    expect(formatGitHubRawUrl(rawUrl)).toBe(rawUrl);

    // Local / relative path should remain unchanged
    expect(formatGitHubRawUrl('/playlist.json')).toBe('/playlist.json');
  });

  it('validatePlaylist filters out corrupted items and ensures valid song structure', () => {
    const rawData = [
      {
        id: 's1',
        title: 'Song 1',
        artist: 'Artist 1',
        category: 'nostalgia',
        duration: 100,
        src: 'https://example.com/audio.mp3',
        cover: 'https://example.com/cover.jpg',
      },
      // Invalid item missing src
      {
        id: 's2',
        title: 'Broken Song',
      },
      // Non-object
      null,
      'just a string',
    ];

    const validSongs = validatePlaylist(rawData);
    expect(validSongs).toHaveLength(1);
    expect(validSongs[0].title).toBe('Song 1');
  });

  it('mergeRemoteWithLocal preserves local uploaded tracks while updating remote songs', () => {
    const currentList: Song[] = [
      {
        id: 'local-123',
        title: 'My Custom Song',
        artist: 'Me',
        category: 'all',
        duration: 180,
        src: 'blob:http://localhost/123',
        cover: '',
        isLocal: true,
      },
      {
        id: 'remote-1',
        title: 'Old Remote Song',
        artist: 'Artist',
        category: 'nostalgia',
        duration: 150,
        src: 'https://audio.mp3',
        cover: '',
      },
    ];

    const newRemoteList: Song[] = [
      {
        id: 'remote-1',
        title: 'Updated Remote Song Title',
        artist: 'Artist',
        category: 'nostalgia',
        duration: 160,
        src: 'https://audio.mp3',
        cover: '',
      },
      {
        id: 'remote-2',
        title: 'Brand New Song from GitHub',
        artist: 'Artist 2',
        category: 'lofi',
        duration: 200,
        src: 'https://audio2.mp3',
        cover: '',
      },
    ];

    const merged = mergeRemoteWithLocal(currentList, newRemoteList);

    // Should contain local track + 2 remote tracks = 3 tracks
    expect(merged).toHaveLength(3);
    expect(merged.some((s) => s.id === 'local-123')).toBe(true);
    expect(merged.find((s) => s.id === 'remote-1')?.title).toBe('Updated Remote Song Title');
    expect(merged.some((s) => s.id === 'remote-2')).toBe(true);
  });
});
