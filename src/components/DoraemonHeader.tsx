import React from 'react';
import { Sparkles } from 'lucide-react';

interface DoraemonHeaderProps {
  isPlaying: boolean;
  onOpenPocket: () => void;
  pocketCount: number;
}

export const DoraemonHeader: React.FC<DoraemonHeaderProps> = ({
  isPlaying,
  onOpenPocket,
  pocketCount,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-white/70 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm relative z-20">
      {/* Doraemon Face / Logo */}
      <div className="flex items-center gap-3">
        <div className="relative">
          {/* Bamboo Copter (Takekoputa) on top */}
          <div
            className={`absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center origin-bottom z-10 ${
              isPlaying ? 'animate-spin-fast' : 'animate-spin-slow'
            }`}
            title="Chong chóng tre thần kỳ"
          >
            <div className="w-8 h-1.5 bg-amber-400 rounded-full shadow-sm"></div>
            <div className="w-1 h-2.5 bg-amber-600"></div>
          </div>

          {/* Doraemon Avatar Head */}
          <div className="w-11 h-11 bg-sky-500 rounded-full border-2 border-white shadow-md relative flex items-center justify-center overflow-hidden">
            {/* White face inner */}
            <div className="w-9 h-8 bg-white rounded-full absolute bottom-0 flex flex-col items-center">
              {/* Eyes */}
              <div className="flex gap-1 -mt-1.5">
                <div className="w-2.5 h-3 bg-white border border-slate-700 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1.5 bg-slate-900 rounded-full"></div>
                </div>
                <div className="w-2.5 h-3 bg-white border border-slate-700 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1.5 bg-slate-900 rounded-full"></div>
                </div>
              </div>
              {/* Red Nose */}
              <div className="w-2 h-2 bg-rose-500 rounded-full -mt-0.5 border border-rose-600"></div>
              {/* Mouth smile */}
              <div className="w-4 h-1.5 border-b-2 border-slate-800 rounded-full mt-0.5"></div>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-base font-bold text-sky-800 flex items-center gap-1 leading-tight">
            Doraemon Player <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          </h1>
          <p className="text-xs text-sky-600 font-medium">Bảo bối âm nhạc diệu kỳ</p>
        </div>
      </div>

      {/* Magic Pocket Quick Button */}
      <button
        onClick={onOpenPocket}
        className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-md transition-all border border-sky-300 relative group"
      >
        <span className="text-sm">🎒</span>
        <span>Túi Thần Kỳ</span>
        <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
          {pocketCount}
        </span>
      </button>
    </header>
  );
};
