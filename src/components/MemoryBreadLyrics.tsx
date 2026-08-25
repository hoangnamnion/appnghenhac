import React from 'react';
import { BookOpen } from 'lucide-react';
import type { Song } from '../types/music';
import { getActiveLyric } from '../utils/audioUtils';

interface MemoryBreadLyricsProps {
  currentSong: Song;
  currentTime: number;
}

export const MemoryBreadLyrics: React.FC<MemoryBreadLyricsProps> = ({
  currentSong,
  currentTime,
}) => {
  const activeLyric = getActiveLyric(currentSong.lyrics, currentTime);

  return (
    <div className="w-full max-w-sm my-2 px-2">
      <div className="bg-amber-50/90 backdrop-blur-md rounded-2xl border-2 border-amber-200/90 shadow-sm p-3 relative overflow-hidden">
        {/* Bread crust styling */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400"></div>

        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🍞</span>
            <span className="text-xs font-bold text-amber-900">
              Bánh Mì Trí Nhớ (Lời Bài Hát)
            </span>
          </div>
          <BookOpen className="w-3.5 h-3.5 text-amber-700/60" />
        </div>

        {/* Current Lyric Line */}
        <div className="min-h-[38px] flex items-center justify-center text-center px-2 py-1 bg-white/70 rounded-xl border border-amber-200/50">
          <p className="text-xs font-semibold text-amber-950 leading-snug transition-all duration-300">
            {activeLyric || '🎵 Đang thưởng thức giai điệu tuyệt vời...'}
          </p>
        </div>
      </div>
    </div>
  );
};
