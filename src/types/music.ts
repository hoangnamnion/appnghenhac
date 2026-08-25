export interface Song {
  id: string;
  title: string;
  artist: string;
  category: 'nostalgia' | 'lofi' | 'relax' | 'all';
  duration: number; // in seconds
  src: string;
  cover: string;
  lyrics?: Array<{ time: number; text: string }>;
  isLocal?: boolean;
}

export type PlaybackMode = 'repeat-all' | 'repeat-one' | 'shuffle';
