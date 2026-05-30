import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Youtube,
  Loader2,
} from "lucide-react";

const DEMO_USER_ID = "fr2p-founder";

interface Track {
  id: string;
  memberId: string;
  name: string;
  url: string;
  sortOrder: number;
  createdAt: string;
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export function MusicPlayer() {
  const qc = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [ytAutoplay, setYtAutoplay] = useState(0);

  const { data: playlist = [], isLoading } = useQuery<Track[]>({
    queryKey: ["/api/playlist", DEMO_USER_ID],
    queryFn: () =>
      fetch(`/api/playlist/${DEMO_USER_ID}`).then((r) => r.json()),
  });

  const addTrack = useMutation({
    mutationFn: (data: { name: string; url: string }) =>
      apiRequest("POST", `/api/playlist/${DEMO_USER_ID}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/playlist", DEMO_USER_ID] });
      setNewName("");
      setNewUrl("");
      setShowAdd(false);
    },
  });

  const removeTrack = useMutation({
    mutationFn: (trackId: string) =>
      apiRequest("DELETE", `/api/playlist/${DEMO_USER_ID}/${trackId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/playlist", DEMO_USER_ID] });
    },
  });

  const safeIndex = playlist.length > 0 ? Math.min(currentIndex, playlist.length - 1) : 0;
  const currentTrack = playlist[safeIndex];
  const isYT = currentTrack ? isYouTubeUrl(currentTrack.url) : false;
  const ytId = currentTrack ? getYouTubeId(currentTrack.url) : null;

  const handleNext = useCallback(() => {
    if (playlist.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
    setYtAutoplay((n) => n + 1);
  }, [playlist.length]);

  const handlePrev = useCallback(() => {
    if (playlist.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setYtAutoplay((n) => n + 1);
  }, [playlist.length]);

  // Audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnded = () => handleNext();
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnded);
    };
  }, [handleNext]);

  // Load new non-YT track
  useEffect(() => {
    if (!audioRef.current || !currentTrack || isYT) return;
    audioRef.current.src = currentTrack.url;
    audioRef.current.load();
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [safeIndex, isYT]);

  const togglePlay = async () => {
    if (isYT) {
      // For YouTube, just toggle the UI state; YouTube iframe handles playback
      setIsPlaying((p) => !p);
      setYtAutoplay((n) => n + 1);
      return;
    }
    if (!audioRef.current || playlist.length === 0) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) audioRef.current.volume = isMuted ? volume : 0;
    setIsMuted((m) => !m);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    setIsMuted(v === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const t = parseFloat(e.target.value);
    audioRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const formatTime = (t: number) => {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleAddTrack = () => {
    if (!newName.trim() || !newUrl.trim()) return;
    addTrack.mutate({ name: newName.trim(), url: newUrl.trim() });
  };

  const handleRemove = (e: React.MouseEvent, trackId: string, idx: number) => {
    e.stopPropagation();
    removeTrack.mutate(trackId);
    if (idx === safeIndex && playlist.length > 1) {
      setCurrentIndex(Math.max(0, idx - 1));
    }
  };

  // ── MINIMIZED VIEW ─────────────────────────────────────────
  if (isMinimized) {
    return (
      <div className="bg-gradient-to-r from-[#001f3f] to-[#002855] border border-[#FFD700]/40 rounded-xl p-3 flex items-center gap-3 shadow-lg">
        <Music className="h-4 w-4 text-[#FFD700] shrink-0" />
        <span className="text-sm text-white/80 flex-1 truncate">
          {currentTrack?.name || "No track selected"}
        </span>
        <button
          onClick={togglePlay}
          className="w-7 h-7 bg-[#FFD700] rounded-full flex items-center justify-center text-[#001f3f] shrink-0"
        >
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 ml-0.5" />}
        </button>
        <button
          onClick={() => setIsMinimized(false)}
          className="text-white/50 hover:text-white"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // ── FULL VIEW ──────────────────────────────────────────────
  return (
    <Card className="bg-gradient-to-br from-[#001f3f] to-[#002855] border-2 border-[#FFD700]/40 text-white shadow-2xl shadow-[#FFD700]/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-[#FFD700]" />
            <CardTitle className="text-[#FFD700] text-base">Inspiration Music Player</CardTitle>
          </div>
          <button onClick={() => setIsMinimized(true)} className="text-white/40 hover:text-white">
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <p className="text-white/50 text-xs">Your personal playlist — saved to your account forever</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <audio ref={audioRef} />

        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 text-[#FFD700] animate-spin" />
          </div>
        ) : playlist.length === 0 ? (
          <div className="text-center py-4 text-white/50 text-sm">
            <Music className="h-8 w-8 mx-auto mb-2 text-white/20" />
            No tracks yet. Add your first song below!
          </div>
        ) : (
          <>
            {/* Current Track Info */}
            <div className="text-center py-1">
              <p className="font-bold text-[#FFD700] text-base truncate">{currentTrack?.name}</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                {isYT && (
                  <Badge className="bg-red-600 text-white text-xs gap-1">
                    <Youtube className="h-3 w-3" />
                    YouTube
                  </Badge>
                )}
                <span className="text-white/40 text-xs">
                  {safeIndex + 1} of {playlist.length}
                </span>
              </div>
            </div>

            {/* YouTube Embed */}
            {isYT && ytId ? (
              <div className="rounded-lg overflow-hidden aspect-video">
                <iframe
                  key={`${ytId}-${ytAutoplay}`}
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=${isPlaying ? 1 : 0}&rel=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  title={currentTrack?.name}
                />
              </div>
            ) : (
              <>
                {/* Seek Bar */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full accent-[#FFD700]"
                  />
                  <div className="flex justify-between text-xs text-white/40">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handlePrev}
                className="text-white/60 hover:text-[#FFD700] transition-colors"
              >
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                onClick={togglePlay}
                className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center text-[#001f3f] hover:bg-yellow-300 transition-colors shadow-lg shadow-[#FFD700]/30"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </button>
              <button
                onClick={handleNext}
                className="text-white/60 hover:text-[#FFD700] transition-colors"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            {/* Volume — only for non-YT */}
            {!isYT && (
              <div className="flex items-center gap-3">
                <button onClick={toggleMute} className="text-white/50 hover:text-white">
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="flex-1 accent-[#FFD700]"
                />
              </div>
            )}
          </>
        )}

        {/* Playlist */}
        <div className="border-t border-white/10 pt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#FFD700]">Your Playlist</span>
            <button
              onClick={() => setShowAdd((s) => !s)}
              className="flex items-center gap-1 text-xs text-white/60 hover:text-[#FFD700] border border-white/20 hover:border-[#FFD700]/50 rounded px-2 py-1 transition-colors"
            >
              <Plus className="h-3 w-3" />
              Add Track
            </button>
          </div>

          {showAdd && (
            <div className="space-y-2 bg-white/5 rounded-lg p-3 border border-white/10">
              <Input
                placeholder="Track name (e.g. 'I Want to Be Rich')"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
              />
              <Input
                placeholder="URL — YouTube link or direct MP3 URL"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddTrack}
                  disabled={!newName.trim() || !newUrl.trim() || addTrack.isPending}
                  className="flex-1 bg-[#FFD700] hover:bg-yellow-300 text-[#001f3f] font-bold text-xs"
                >
                  {addTrack.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    "Save to My Playlist"
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAdd(false)}
                  className="text-white/50 text-xs"
                >
                  Cancel
                </Button>
              </div>
              <p className="text-xs text-white/40 text-center">
                💡 Paste a YouTube link (youtube.com/watch?v=...) or a direct MP3 URL
              </p>
            </div>
          )}

          <div className="max-h-40 overflow-y-auto space-y-1">
            {playlist.map((track, idx) => (
              <div
                key={track.id}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors group ${
                  idx === safeIndex
                    ? "bg-[#FFD700]/20 border border-[#FFD700]/40"
                    : "bg-white/5 hover:bg-white/10 border border-transparent"
                }`}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsPlaying(true);
                  setYtAutoplay((n) => n + 1);
                }}
              >
                {isYouTubeUrl(track.url) ? (
                  <Youtube className="h-3 w-3 text-red-400 shrink-0" />
                ) : (
                  <Music className="h-3 w-3 text-[#FFD700]/60 shrink-0" />
                )}
                <span className="text-xs text-white/80 flex-1 truncate">{track.name}</span>
                {idx === safeIndex && isPlaying && (
                  <span className="text-[#FFD700] text-xs animate-pulse">♪</span>
                )}
                <button
                  onClick={(e) => handleRemove(e, track.id, idx)}
                  className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/30 text-center">
          ✅ Playlist saved to your account — always here when you log back in
        </p>
      </CardContent>
    </Card>
  );
}
