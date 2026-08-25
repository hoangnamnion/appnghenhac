import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { Song, PlaybackMode } from './types/music';
import { INITIAL_TRACKS } from './data/mockTracks';
import { DoraemonHeader } from './components/DoraemonHeader';
import { DoraemonDisc } from './components/DoraemonDisc';
import { AudioVisualizer } from './components/AudioVisualizer';
import { MusicControls } from './components/MusicControls';
import { AnywhereDoorFilter } from './components/AnywhereDoorFilter';
import { MemoryBreadLyrics } from './components/MemoryBreadLyrics';
import { MagicPocketModal } from './components/MagicPocketModal';
import {
  getNextSongIndex,
  getPrevSongIndex,
  filterSongsByCategory,
} from './utils/audioUtils';
import {
  fetchPlaylistFromGitHub,
  mergeRemoteWithLocal,
  DEFAULT_GITHUB_PLAYLIST_URL,
} from './services/githubService';

export function App() {
  const [songs, setSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem('doraemon_songs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TRACKS;
  });

  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('repeat-all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'nostalgia' | 'lofi' | 'relax'>('all');
  const [isPocketOpen, setIsPocketOpen] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('doraemon_favs');
    return saved ? JSON.parse(saved) : ['doraemon-theme'];
  });

  // GitHub Sync State
  const [gitHubUrl, setGitHubUrl] = useState<string>(() => {
    return localStorage.getItem('doraemon_github_url') || DEFAULT_GITHUB_PLAYLIST_URL;
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Audio References
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Active filtered songs
  const filteredSongs = filterSongsByCategory(songs, selectedCategory);
  const currentSong: Song = songs[currentSongIndex] || INITIAL_TRACKS[0];

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('doraemon_favs', JSON.stringify(favorites));
  }, [favorites]);

  // Sync with GitHub function
  const handleSyncGitHub = useCallback(async (targetUrl?: string) => {
    const urlToUse = targetUrl || gitHubUrl;
    setIsSyncing(true);
    setSyncStatus(null);

    try {
      const remoteTracks = await fetchPlaylistFromGitHub(urlToUse);
      if (remoteTracks.length > 0) {
        setSongs((prev) => {
          const merged = mergeRemoteWithLocal(prev, remoteTracks);
          const serializable = merged.filter((s) => !s.isLocal);
          localStorage.setItem('doraemon_songs', JSON.stringify(serializable));
          return merged;
        });

        setSyncStatus({
          success: true,
          message: `Đã đồng bộ ${remoteTracks.length} bài hát từ GitHub!`,
        });

        // Trigger confetti on successful sync
        try {
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.6 },
            colors: ['#0284c7', '#38bdf8', '#fbbf24'],
          });
        } catch {
          // ignore
        }
      } else {
        setSyncStatus({
          success: false,
          message: 'Không tìm thấy bài hát hợp lệ trong file playlist.json',
        });
      }
    } catch (err) {
      setSyncStatus({
        success: false,
        message: 'Lỗi kết nối GitHub hoặc định dạng playlist.json không đúng.',
      });
      console.warn('Sync failed:', err);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 5000);
    }
  }, [gitHubUrl]);

  // Save custom GitHub URL
  const handleUpdateGitHubUrl = (url: string) => {
    setGitHubUrl(url);
    localStorage.setItem('doraemon_github_url', url);
  };

  // Initial silent background sync on mount
  useEffect(() => {
    fetchPlaylistFromGitHub(gitHubUrl)
      .then((remoteTracks) => {
        if (remoteTracks.length > 0) {
          setSongs((prev) => {
            const merged = mergeRemoteWithLocal(prev, remoteTracks);
            const serializable = merged.filter((s) => !s.isLocal);
            localStorage.setItem('doraemon_songs', JSON.stringify(serializable));
            return merged;
          });
        }
      })
      .catch(() => {
        // Silent fallback to local storage / mock tracks
      });
  }, [gitHubUrl]);

  // Setup Web Audio API Analyser
  const setupWebAudio = () => {
    if (!audioRef.current || audioContextRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      sourceNodeRef.current = source;
    } catch (e) {
      console.warn('Web Audio API initialized in fallback mode:', e);
    }
  };

  // Play / Pause Toggle
  const handlePlayPause = async () => {
    if (!audioRef.current) return;

    setupWebAudio();
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Autoplay error:', err);
          setIsPlaying(false);
        });
    }
  };

  // Next Track
  const handleNext = () => {
    const nextIdx = getNextSongIndex(currentSongIndex, songs.length, playbackMode);
    if (nextIdx !== -1) {
      setCurrentSongIndex(nextIdx);
      setIsPlaying(true);
    }
  };

  // Previous Track
  const handlePrev = () => {
    const prevIdx = getPrevSongIndex(currentSongIndex, songs.length);
    if (prevIdx !== -1) {
      setCurrentSongIndex(prevIdx);
      setIsPlaying(true);
    }
  };

  // Seek
  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Volume Change
  const handleVolumeChange = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolume(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  };

  // Playback Mode Toggle
  const handleTogglePlaybackMode = () => {
    const modes: PlaybackMode[] = ['repeat-all', 'repeat-one', 'shuffle'];
    const nextMode = modes[(modes.indexOf(playbackMode) + 1) % modes.length];
    setPlaybackMode(nextMode);
  };

  // Toggle Favorite
  const handleToggleFavorite = (songId?: string) => {
    const targetId = songId || currentSong.id;
    const exists = favorites.includes(targetId);

    if (exists) {
      setFavorites(favorites.filter((id) => id !== targetId));
    } else {
      setFavorites([...favorites, targetId]);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#0284c7', '#e11d48', '#fbbf24', '#ffffff'],
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  // Handle Song Selection
  const handleSelectSong = (selected: Song) => {
    const idx = songs.findIndex((s) => s.id === selected.id);
    if (idx !== -1) {
      setCurrentSongIndex(idx);
      setIsPlaying(true);
    }
    setIsPocketOpen(false);
  };

  // Add Custom Uploaded Song
  const handleAddCustomSong = (newSong: Song) => {
    const updated = [newSong, ...songs];
    setSongs(updated);
  };

  // Delete Custom Song
  const handleDeleteCustomSong = (id: string) => {
    const updated = songs.filter((s) => s.id !== id);
    setSongs(updated);
    if (currentSong.id === id) {
      setCurrentSongIndex(0);
    }
  };

  // Track change effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.src;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.warn('Playback change error:', e));
      }
    }
  }, [currentSongIndex, currentSong.src]);

  // Audio element listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || currentSong.duration);
    const onEnded = () => {
      if (playbackMode === 'repeat-one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [playbackMode, currentSongIndex, songs.length]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-between p-3 sm:p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Hidden Native Audio Element */}
      <audio ref={audioRef} crossOrigin="anonymous" preload="metadata" />

      {/* Doraemon App Header */}
      <DoraemonHeader
        isPlaying={isPlaying}
        onOpenPocket={() => setIsPocketOpen(true)}
        pocketCount={songs.length}
      />

      {/* Center Vinyl & Song Art */}
      <DoraemonDisc
        currentSong={currentSong}
        isPlaying={isPlaying}
        isFavorite={favorites.includes(currentSong.id)}
        onToggleFavorite={() => handleToggleFavorite()}
      />

      {/* Real-time Audio Equalizer Visualizer */}
      <AudioVisualizer
        isPlaying={isPlaying}
        analyserNode={analyserRef.current}
      />

      {/* Memory Bread Lyrics Display */}
      <MemoryBreadLyrics
        currentSong={currentSong}
        currentTime={currentTime}
      />

      {/* Anywhere Door Filter Tabs */}
      <AnywhereDoorFilter
        currentCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const matched = filterSongsByCategory(songs, cat);
          if (matched.length > 0 && !matched.some((s) => s.id === currentSong.id)) {
            const newIdx = songs.findIndex((s) => s.id === matched[0].id);
            if (newIdx !== -1) setCurrentSongIndex(newIdx);
          }
        }}
      />

      {/* Music Controls Bar */}
      <MusicControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        playbackMode={playbackMode}
        onPlayPause={handlePlayPause}
        onPrev={handlePrev}
        onNext={handleNext}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onTogglePlaybackMode={handleTogglePlaybackMode}
      />

      {/* Magic Pocket Drawer Modal with GitHub Sync */}
      <MagicPocketModal
        isOpen={isPocketOpen}
        onClose={() => setIsPocketOpen(false)}
        songs={filteredSongs}
        currentSongId={currentSong.id}
        isPlaying={isPlaying}
        onSelectSong={handleSelectSong}
        onAddCustomSong={handleAddCustomSong}
        onDeleteCustomSong={handleDeleteCustomSong}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onSyncGitHub={handleSyncGitHub}
        isSyncing={isSyncing}
        syncStatus={syncStatus}
        gitHubUrl={gitHubUrl}
        onUpdateGitHubUrl={handleUpdateGitHubUrl}
      />
    </div>
  );
}

export default App;
