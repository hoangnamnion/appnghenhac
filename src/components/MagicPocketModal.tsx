import React, { useRef, useState } from 'react';
import { X, Upload, Heart, Trash2, RefreshCw, Globe, Check, AlertCircle } from 'lucide-react';
import type { Song } from '../types/music';

interface MagicPocketModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  currentSongId: string;
  isPlaying: boolean;
  onSelectSong: (song: Song) => void;
  onAddCustomSong: (song: Song) => void;
  onDeleteCustomSong: (id: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSyncGitHub: (url?: string) => Promise<void>;
  isSyncing: boolean;
  syncStatus: { success?: boolean; message?: string } | null;
  gitHubUrl: string;
  onUpdateGitHubUrl: (url: string) => void;
}

export const MagicPocketModal: React.FC<MagicPocketModalProps> = ({
  isOpen,
  onClose,
  songs,
  currentSongId,
  isPlaying,
  onSelectSong,
  onAddCustomSong,
  onDeleteCustomSong,
  favorites,
  onToggleFavorite,
  onSyncGitHub,
  isSyncing,
  syncStatus,
  gitHubUrl,
  onUpdateGitHubUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>(gitHubUrl);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const newSong: Song = {
      id: `local-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Bảo Bối Từ Máy Của Bạn',
      category: 'all',
      duration: 180,
      src: objectUrl,
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      isLocal: true,
      lyrics: [{ time: 0, text: `🎵 Đang phát file: ${file.name}` }],
    };

    onAddCustomSong(newSong);
    onSelectSong(newSong);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveConfigAndSync = () => {
    onUpdateGitHubUrl(inputUrl);
    onSyncGitHub(inputUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-0 sm:p-4 transition-opacity">
      {/* Modal / Drawer Content */}
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border-t-4 sm:border-4 border-sky-400 max-h-[88vh] flex flex-col overflow-hidden">
        {/* Magic Pocket Header with Semi-Circle Pocket Shape */}
        <div className="bg-sky-500 px-5 pt-4 pb-3 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎒</span>
              <div>
                <h3 className="font-bold text-base">Túi Thần Kỳ (Magic Pocket)</h3>
                <p className="text-xs text-sky-100">Kho báu các bài hát & bảo bối</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Semicircle White Pocket Lip */}
          <div className="mt-2 w-full h-3 bg-white rounded-t-full shadow-sm"></div>
        </div>

        {/* Action Bar (Upload MP3 & Sync GitHub) */}
        <div className="p-3 bg-sky-50 border-b border-sky-100 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-slate-900 font-bold text-xs py-2 px-2.5 rounded-xl shadow-sm border border-amber-300 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>+ Nạp MP3</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Sync GitHub Button */}
            <button
              onClick={() => onSyncGitHub()}
              disabled={isSyncing}
              className="flex-1 flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-700 active:scale-95 disabled:opacity-75 text-white font-bold text-xs py-2 px-2.5 rounded-xl shadow-sm border border-sky-400 transition-all"
              title="Cập nhật danh sách bài hát mới nhất từ GitHub"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng Bộ GitHub'}</span>
            </button>

            {/* Config Link Toggle Button */}
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`p-2 rounded-xl border transition-all ${
                showConfig
                  ? 'bg-sky-200 text-sky-900 border-sky-400'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
              title="Cài đặt link GitHub Playlist"
            >
              <Globe className="w-4 h-4" />
            </button>
          </div>

          {/* Sync Status Banner */}
          {syncStatus && (
            <div
              className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
                syncStatus.success
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {syncStatus.success ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              )}
              <span>{syncStatus.message}</span>
            </div>
          )}

          {/* Expandable GitHub Config Box */}
          {showConfig && (
            <div className="bg-white p-2.5 rounded-xl border border-sky-200 shadow-sm flex flex-col gap-1.5 animate-fadeIn">
              <label className="text-[11px] font-bold text-sky-900 flex items-center gap-1">
                <span>🔗 Đường dẫn file playlist.json trên GitHub:</span>
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="/playlist.json hoặc https://raw.githubusercontent.com/.../playlist.json"
                  className="flex-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sky-500 font-mono text-slate-700"
                />
                <button
                  onClick={handleSaveConfigAndSync}
                  className="bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Lưu & Tải
                </button>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Mặc định: Sử dụng file <code>playlist.json</code> trong dự án. Bạn có thể thay bằng link GitHub repo riêng của bạn.
              </p>
            </div>
          )}
        </div>

        {/* Playlist List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {songs.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Túi thần kỳ chưa có bài hát nào trong mục này.
            </div>
          ) : (
            songs.map((song, idx) => {
              const isCurrent = song.id === currentSongId;
              const isFav = favorites.includes(song.id);

              return (
                <div
                  key={song.id}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-sky-100/90 border-sky-400 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-100'
                  }`}
                >
                  <div
                    onClick={() => onSelectSong(song)}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  >
                    {/* Index or Playing Indicator */}
                    <div className="w-7 h-7 rounded-full bg-sky-200 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {isCurrent && isPlaying ? (
                        <span className="text-[10px] animate-pulse">▶</span>
                      ) : (
                        idx + 1
                      )}
                    </div>

                    {/* Cover Art Mini */}
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                    />

                    {/* Title & Artist */}
                    <div className="min-w-0 flex-1">
                      <h4
                        className={`text-xs font-bold truncate ${
                          isCurrent ? 'text-sky-900' : 'text-slate-800'
                        }`}
                      >
                        {song.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions (Fav & Delete local) */}
                  <div className="flex items-center gap-1.5 ml-2">
                    <button
                      onClick={() => onToggleFavorite(song.id)}
                      className="p-1.5 rounded-full hover:bg-rose-50 text-slate-400 transition-colors"
                      title="Yêu thích"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav ? 'text-rose-500 fill-rose-500' : ''
                        }`}
                      />
                    </button>

                    {song.isLocal && (
                      <button
                        onClick={() => onDeleteCustomSong(song.id)}
                        className="p-1.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        title="Xóa bài nhạc này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center flex items-center justify-between px-4">
          <p className="text-[11px] text-slate-500 font-medium">
            🎒 Tổng cộng: <span className="font-bold text-sky-800">{songs.length}</span> bài hát
          </p>
          <span className="text-[10px] text-sky-600 bg-sky-100 font-bold px-2 py-0.5 rounded-full">
            GitHub Sync Ready
          </span>
        </div>
      </div>
    </div>
  );
};
