import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { PlaybackMode } from '../types/music';
import { formatTime } from '../utils/audioUtils';

interface MusicControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackMode: PlaybackMode;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onTogglePlaybackMode: () => void;
}

export const MusicControls: React.FC<MusicControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  playbackMode,
  onPlayPause,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onTogglePlaybackMode,
}) => {
  const isMuted = volume === 0;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(Number(e.target.value));
  };

  const getModeIcon = () => {
    switch (playbackMode) {
      case 'repeat-one':
        return <Repeat1 className="w-4 h-4 text-rose-500" />;
      case 'shuffle':
        return <Shuffle className="w-4 h-4 text-amber-500" />;
      default:
        return <Repeat className="w-4 h-4 text-sky-600" />;
    }
  };

  const getModeTitle = () => {
    switch (playbackMode) {
      case 'repeat-one':
        return 'Lặp lại 1 bài';
      case 'shuffle':
        return 'Phát ngẫu nhiên';
      default:
        return 'Lặp toàn bộ';
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center px-4 py-2 bg-white/80 backdrop-blur-md rounded-3xl border border-white/80 shadow-lg mt-2">
      {/* Progress Bar & Timestamps */}
      <div className="w-full flex flex-col gap-1">
        <div className="relative w-full flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime || 0}
            onChange={handleSliderChange}
            className="w-full h-2 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-500 hover:accent-sky-600 transition-all"
          />
        </div>

        <div className="w-full flex justify-between text-[11px] font-bold text-sky-800/80 px-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Buttons (Shuffle, Prev, Play/Pause, Next, Repeat) */}
      <div className="w-full flex items-center justify-between px-2 py-2 mt-1">
        {/* Playback Mode Button */}
        <button
          onClick={onTogglePlaybackMode}
          className="p-2.5 rounded-full hover:bg-sky-50 active:scale-95 transition-all text-slate-700 relative"
          title={getModeTitle()}
        >
          {getModeIcon()}
        </button>

        {/* Previous Button */}
        <button
          onClick={onPrev}
          className="p-3 rounded-full hover:bg-sky-100/70 active:scale-90 transition-all text-sky-800"
          title="Bài trước"
        >
          <SkipBack className="w-5 h-5 fill-sky-800/20" />
        </button>

        {/* Big Play/Pause Button */}
        <button
          onClick={onPlayPause}
          className="w-14 h-14 bg-gradient-to-tr from-sky-500 via-sky-400 to-sky-300 text-white rounded-full shadow-lg shadow-sky-400/40 border-2 border-white flex items-center justify-center active:scale-90 hover:scale-105 transition-all"
          title={isPlaying ? 'Tạm dừng' : 'Phát nhạc'}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-white" />
          ) : (
            <Play className="w-6 h-6 fill-white ml-0.5" />
          )}
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="p-3 rounded-full hover:bg-sky-100/70 active:scale-90 transition-all text-sky-800"
          title="Bài kế tiếp"
        >
          <SkipForward className="w-5 h-5 fill-sky-800/20" />
        </button>

        {/* Volume Popover / Button */}
        <div className="flex items-center gap-1.5 group relative">
          <button
            onClick={() => onVolumeChange(isMuted ? 0.8 : 0)}
            className="p-2.5 rounded-full hover:bg-sky-50 active:scale-95 transition-all text-sky-700"
            title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          
          {/* Volume slider mini */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-12 h-1.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-500"
            title={`Âm lượng: ${Math.round(volume * 100)}%`}
          />
        </div>
      </div>
    </div>
  );
};
