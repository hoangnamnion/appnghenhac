import React from 'react';
import { Sparkles } from 'lucide-react';

interface AnywhereDoorFilterProps {
  currentCategory: 'all' | 'nostalgia' | 'lofi' | 'relax';
  onSelectCategory: (cat: 'all' | 'nostalgia' | 'lofi' | 'relax') => void;
}

export const AnywhereDoorFilter: React.FC<AnywhereDoorFilterProps> = ({
  currentCategory,
  onSelectCategory,
}) => {
  const categories: Array<{
    id: 'all' | 'nostalgia' | 'lofi' | 'relax';
    label: string;
    icon: string;
    desc: string;
    doorColor: string;
  }> = [
    {
      id: 'all',
      label: 'Tất Cả',
      icon: '✨',
      desc: 'Toàn bộ bảo bối',
      doorColor: 'from-sky-400 to-sky-600',
    },
    {
      id: 'nostalgia',
      label: 'Tuổi Thơ',
      icon: '📺',
      desc: 'Nhạc phim hoạt hình',
      doorColor: 'from-pink-400 to-rose-500',
    },
    {
      id: 'lofi',
      label: 'Lofi Chill',
      icon: '☕',
      desc: 'Học tập & thư giãn',
      doorColor: 'from-amber-400 to-orange-500',
    },
    {
      id: 'relax',
      label: 'Ngủ Ngon',
      icon: '🌙',
      desc: 'Giấc mơ êm đềm',
      doorColor: 'from-indigo-400 to-purple-600',
    },
  ];

  return (
    <div className="w-full max-w-sm my-3 px-2">
      {/* Title */}
      <div className="flex items-center gap-1.5 mb-2 px-1">
        <div className="w-4 h-5 bg-rose-500 rounded-sm border border-rose-700 shadow-sm flex items-center justify-center">
          <div className="w-1 h-1 bg-amber-300 rounded-full"></div>
        </div>
        <span className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1">
          Cửa Thần Kỳ (Anywhere Door) <Sparkles className="w-3 h-3 text-amber-500" />
        </span>
      </div>

      {/* Door Grid */}
      <div className="grid grid-cols-4 gap-1.5">
        {categories.map((cat) => {
          const isActive = currentCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-300 border relative ${
                isActive
                  ? 'bg-white shadow-md border-sky-400 scale-105 ring-2 ring-sky-300'
                  : 'bg-white/60 hover:bg-white/90 border-white/60 opacity-80'
              }`}
            >
              {/* Mini Door Representation */}
              <div
                className={`w-7 h-9 rounded-md bg-gradient-to-b ${cat.doorColor} shadow-inner flex items-center justify-center relative border border-white/60 mb-1.5 transition-transform ${
                  isActive ? 'rotate-1' : ''
                }`}
              >
                <span className="text-xs">{cat.icon}</span>
                {/* Door knob */}
                <div className="absolute right-1 w-1 h-1 bg-amber-300 rounded-full border border-amber-600"></div>
              </div>

              <span className={`text-[11px] font-bold ${isActive ? 'text-sky-900' : 'text-slate-600'}`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
