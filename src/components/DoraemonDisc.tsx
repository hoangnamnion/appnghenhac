import React from 'react';
import { Heart } from 'lucide-react';
import type { Song } from '../types/music';

interface DoraemonDiscProps {
  currentSong: Song;
  isPlaying: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const DoraemonDisc: React.FC<DoraemonDiscProps> = ({
  currentSong,
  isPlaying,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center my-4">
      {/* Glow aura */}
      <div
        className={`absolute w-56 h-56 rounded-full blur-2xl transition-opacity duration-700 pointer-events-none ${
          isPlaying ? 'bg-sky-400/35 opacity-100' : 'bg-sky-300/15 opacity-50'
        }`}
      ></div>

      {/* Red Collar Stripe */}
      <div className="w-48 h-3 bg-rose-600 rounded-full shadow-inner mb-2 flex items-center justify-center relative z-10 border border-rose-700">
        {/* Golden Bell hanging in center */}
        <div
          className={`absolute -bottom-3 w-8 h-8 bg-gradient-to-b from-amber-300 to-amber-500 rounded-full border-2 border-amber-600 shadow-md flex flex-col items-center justify-center cursor-pointer transition-transform ${
            isPlaying ? 'animate-bell' : ''
          }`}
          title="Chuông vàng của Doraemon"
        >
          {/* Bell lines */}
          <div className="w-full h-0.5 bg-amber-700 my-0.5"></div>
          <div className="w-1.5 h-1.5 bg-amber-900 rounded-full"></div>
        </div>
      </div>

      {/* Main Vinyl Record */}
      <div className="relative mt-3">
        <div
          className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-slate-900 border-4 border-slate-800 shadow-2xl flex items-center justify-center relative overflow-hidden transition-all ${
            isPlaying ? 'animate-disc' : 'animate-disc disc-paused'
          }`}
        >
          {/* Vinyl grooves */}
          <div className="absolute inset-2 rounded-full border border-slate-700/50"></div>
          <div className="absolute inset-5 rounded-full border border-slate-700/40"></div>
          <div className="absolute inset-8 rounded-full border border-slate-700/30"></div>
          <div className="absolute inset-11 rounded-full border border-slate-700/20"></div>

          {/* Center Album Art */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-amber-400 shadow-inner relative flex items-center justify-center">
            <img
              src={currentSong.cover}
              alt={currentSong.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback image if cover fails
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80';
              }}
            />
            {/* Center spindle hole */}
            <div className="absolute w-5 h-5 bg-white border-2 border-slate-900 rounded-full shadow-md"></div>
          </div>
        </div>

        {/* Favorite Floating Button */}
        <button
          onClick={onToggleFavorite}
          className="absolute bottom-1 right-1 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-rose-200 flex items-center justify-center active:scale-90 transition-transform z-10"
          title="Yêu thích bài hát này"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? 'text-rose-500 fill-rose-500' : 'text-slate-400'
            }`}
          />
        </button>
      </div>

      {/* Song Info Text */}
      <div className="text-center mt-4 px-4 max-w-sm">
        <h2 className="text-lg font-bold text-sky-950 truncate tracking-tight">
          {currentSong.title}
        </h2>
        <p className="text-xs font-semibold text-sky-700/80 truncate mt-0.5">
          {currentSong.artist}
        </p>
      </div>
    </div>
  );
};
