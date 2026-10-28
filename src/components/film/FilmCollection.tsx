import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: any;
  }
}

interface FilmItem {
  id: string;
  chapter: string;
  title: string[];
  mobileTitle?: string[];
  caption: string;
  couple: string;
  category: string;
  poster: string;
  youtubeId: string;
  videoUrl: string;
}

const FILMS: FilmItem[] = [
  {
    id: "film-01",
    chapter: "01",
    title: ["LOVE & VIBES", "STILL IN MOTION."],
    mobileTitle: ["LOVE & VIBES", "STILL IN MOTION."],
    caption: "Some moments always find their way back.",
    couple: "AKSHAY & SHRUTHI",
    category: "DESTINATION WEDDING",
    poster: "https://img.youtube.com/vi/4qDQ-gkU1Js/maxresdefault.jpg",
    youtubeId: "4qDQ-gkU1Js",
    videoUrl: "https://www.youtube.com/watch?v=4qDQ-gkU1Js",
  },
  {
    id: "film-02",
    chapter: "02",
    title: ["BACK TO THE WAY", "IT FELT."],
    caption:
      "The day may pass, but every time you press play, you’ll feel it all over again.",
    couple: "JASEEL & DUBY",
    category: "WAYANAD / 2024",
    poster: "https://img.youtube.com/vi/eo1xffzOptI/maxresdefault.jpg",
    youtubeId: "eo1xffzOptI",
    videoUrl: "https://www.youtube.com/watch?v=eo1xffzOptI",
  },
  {
    id: "film-03",
    chapter: "03",
    title: ["SOME DAY, THEY'LL BE", "THE MEMORIES."],
    caption:
      "“Years from now, when the day feels impossibly far away, let this bring you home.”",
    couple: "ASHLEY & SIMON",
    category: "LONDON · CINEMATIC LOVE FILM & PROPOSAL",
    poster: "https://img.youtube.com/vi/XuPpb_gvq58/maxresdefault.jpg",
    youtubeId: "XuPpb_gvq58",
    videoUrl: "https://www.youtube.com/watch?v=XuPpb_gvq58",
  },
];

interface TelevisionProps {
  film: FilmItem;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

function Television({
  film,
  isPlaying,
  onTogglePlay,
}: TelevisionProps) {
  const playerRef = useRef<any>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimer = useRef<any>(null);

  // Initialize YouTube IFrame Player API when isPlaying is triggered
  useEffect(() => {
    if (!isPlaying) {
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
        playerRef.current = null;
      }
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    let isMounted = true;
    let pollTimer: any = null;

    const initPlayer = () => {
      if (typeof window !== "undefined" && window.YT && window.YT.Player) {
        try {
          const playerId = `yt-player-${film.id}`;
          const existingElement = document.getElementById(playerId);
          if (!existingElement) {
            pollTimer = setTimeout(initPlayer, 100);
            return;
          }

          const player = new window.YT.Player(playerId, {
            events: {
              onReady: (event: any) => {
                if (!isMounted) return;
                playerRef.current = event.target;
                try {
                  event.target.playVideo();
                } catch {
                  // ignore
                }
                setIsVideoPlaying(true);
                setShowControls(true);
                startHideTimer(3000);
                const dur = event.target.getDuration();
                if (dur && dur > 0) setDuration(dur);
              },
              onStateChange: (event: any) => {
                if (!isMounted) return;
                // YT.PlayerState: 1 = PLAYING, 2 = PAUSED, 0 = ENDED
                if (event.data === 1) {
                  setIsVideoPlaying(true);
                  setShowControls(true);
                  startHideTimer(3000);
                  const dur = event.target.getDuration();
                  if (dur && dur > 0) setDuration(dur);
                } else if (event.data === 2) {
                  setIsVideoPlaying(false);
                  setShowControls(true);
                  if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
                } else if (event.data === 0) {
                  setIsVideoPlaying(false);
                  setShowControls(true);
                  setCurrentTime(0);
                  if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
                }
              },
            },
          });
        } catch {
          // ignore error
        }
      } else {
        pollTimer = setTimeout(initPlayer, 100);
      }
    };

    initPlayer();

    return () => {
      isMounted = false;
      if (pollTimer) clearTimeout(pollTimer);
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
        playerRef.current = null;
      }
    };
  }, [isPlaying, film.id]);

  // Periodic interval to track current playback time
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
        const cur = playerRef.current.getCurrentTime() || 0;
        const dur = playerRef.current.getDuration() || 0;
        setCurrentTime(cur);
        if (dur > 0) setDuration(dur);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Helper to start hide timer for controls (3 seconds fade after user stops touching/interacting)
  const startHideTimer = (delayMs: number = 3000) => {
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      setShowControls(false);
    }, delayMs);
  };

  // Touch handlers: keep controls open while touching, fade 3 seconds after leaving touch
  const handleTouchStart = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
  };

  const handleTouchEnd = () => {
    if (isVideoPlaying) {
      startHideTimer(3000);
    }
  };

  // Mouse handlers for desktop
  const handleMouseMove = () => {
    setShowControls(true);
    if (isVideoPlaying) {
      startHideTimer(3000);
    }
  };

  const handleMouseLeave = () => {
    if (isVideoPlaying) {
      startHideTimer(3000);
    }
  };

  // Handle play / pause toggle
  const handleTogglePlayback = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    if (!playerRef.current) return;
    try {
      if (isVideoPlaying) {
        playerRef.current.pauseVideo();
        setIsVideoPlaying(false);
        setShowControls(true);
        if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
      } else {
        playerRef.current.playVideo();
        setIsVideoPlaying(true);
        setShowControls(true);
        startHideTimer(3000);
      }
    } catch {
      // fallback
    }
  };

  // Handle seeking along duration controller
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    setShowControls(true);
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      try {
        playerRef.current.seekTo(newTime, true);
      } catch {
        // ignore
      }
    }
    startHideTimer(3000);
  };

  // Handle audio mute / unmute
  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowControls(true);
    if (isVideoPlaying) startHideTimer(3000);
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch {
      // ignore
    }
  };

  // Replay from start
  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowControls(true);
    if (!playerRef.current) return;
    try {
      playerRef.current.seekTo(0, true);
      playerRef.current.playVideo();
      setIsVideoPlaying(true);
      startHideTimer(3000);
    } catch {
      // ignore
    }
  };

  // Format time as M:SS
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="relative w-full max-w-[560px] sm:max-w-[640px] md:max-w-[700px] lg:max-w-none mx-auto select-none group">
      {/* Ambient Floor Shadow under vintage TV chassis */}
      <div className="absolute -bottom-4 inset-x-10 h-10 bg-[#080808]/15 blur-2xl rounded-full pointer-events-none transform translate-y-2 scale-95" />
      <div className="absolute -bottom-1 inset-x-16 h-6 bg-[#080808]/25 blur-md rounded-full pointer-events-none" />

      {/* Outer TV Chassis Wrapper: wide silver frame on mobile, classic vintage on desktop */}
      <div className="relative w-full aspect-[1580/995] lg:aspect-[1728/1088] drop-shadow-[0_20px_25px_rgba(0,0,0,0.08)]">
        {/* Mobile TV Frame: Retro Silver CRT Television with significantly larger screen cutout (Mobile Only) */}
        <img
          src="/assets/aistudio/Retro_Silver_CRT_Television_Cutout_5d8a6c65.png"
          alt="Retro Silver Television"
          className="block lg:hidden absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
        />

        {/* Desktop TV Frame: Classic Vintage Television (Desktop Only) */}
        <img
          src="/assets/aistudio/tv-frame_c6a84fc7.png"
          alt="Vintage Television"
          className="hidden lg:block absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
        />

        {/* Vintage Screen Cutout Area with responsive positioning and touch support */}
        <div
          className="crt-screen-cutout absolute z-20 overflow-hidden bg-[#0A0A0A]"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {isPlaying ? (
            <div className="relative w-full h-full group/player">
              {/* YouTube Video Embed with Native Controls & Branding completely hidden */}
              <iframe
                id={`yt-player-${film.id}`}
                src={`https://www.youtube-nocookie.com/embed/${film.youtubeId}?enablejsapi=1&autoplay=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&fs=0&disablekb=1&showinfo=0`}
                title={`${film.couple} Wedding Film`}
                className="w-full h-full object-cover border-0 pointer-events-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />

              {/* Clickable Overlay to reveal controls or toggle play/pause */}
              <div
                className="absolute inset-0 z-20 cursor-pointer"
                onClick={(e) => {
                  if (!showControls && isVideoPlaying) {
                    setShowControls(true);
                    startHideTimer(3000);
                  } else {
                    handleTogglePlayback(e);
                  }
                }}
              />

              {/* CRT Curved Glass Inner Bezel Shadow & Vintage Scanline Glow */}
              <div className="absolute inset-0 pointer-events-none z-20 rounded-[inherit] shadow-[inset_0_0_22px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.14)]" />

              {/* Big Center Glassmorphic Play/Pause Button on Pause */}
              {!isVideoPlaying && (
                <div
                  className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
                >
                  <button
                    type="button"
                    onClick={handleTogglePlayback}
                    aria-label="Resume video"
                    className="pointer-events-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white/20 hover:bg-white/35 active:scale-95 backdrop-blur-md border border-white/50 text-white flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-all cursor-pointer hover:border-white"
                  >
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 fill-white text-white translate-x-0.5" />
                  </button>
                </div>
              )}

              {/* Custom Glassmorphism Video Control Bar on Bottom with 3-second auto-fade after touch */}
              <div
                className={`absolute bottom-2 sm:bottom-3 inset-x-2 sm:inset-x-3.5 z-30 transition-all duration-500 ease-out pointer-events-auto ${
                  showControls || !isVideoPlaying
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 pointer-events-none"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isVideoPlaying) startHideTimer(3000);
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
              >
                <div className="bg-black/45 backdrop-blur-md border border-white/25 hover:border-white/40 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-3 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                  {/* Glassmorphic Play/Pause Button */}
                  <button
                    type="button"
                    onClick={handleTogglePlayback}
                    aria-label={isVideoPlaying ? "Pause video" : "Play video"}
                    className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/35 active:scale-95 backdrop-blur-md border border-white/45 hover:border-white text-white flex items-center justify-center transition-all shadow-[0_2px_8px_rgba(0,0,0,0.3)] cursor-pointer"
                  >
                    {isVideoPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-white text-white" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-white text-white translate-x-0.5" />
                    )}
                  </button>

                  {/* Custom Duration Controller / Scrub Bar */}
                  <div className="relative flex-1 flex items-center group/scrubber h-5">
                    {/* Track Background */}
                    <div className="w-full h-1 sm:h-1.5 bg-white/25 rounded-full overflow-hidden">
                      {/* Active Progress Fill */}
                      <div
                        className="h-full bg-white rounded-full transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                        style={{
                          width: `${
                            duration > 0
                              ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    {/* Invisible Range Input for Interactive Scrubbing */}
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      step={0.25}
                      value={currentTime}
                      onChange={handleSeek}
                      aria-label="Video scrubber"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                  </div>

                  {/* Duration Monospace Timestamp */}
                  <div className="font-mono text-[9px] sm:text-[10px] tracking-wider text-white/90 whitespace-nowrap select-none">
                    <span>{formatTime(currentTime)}</span>
                    <span className="opacity-50 mx-1">/</span>
                    <span className="opacity-75">{formatTime(duration)}</span>
                  </div>

                  {/* Glassmorphic Mute/Unmute Button */}
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                    className="flex-shrink-0 p-1 sm:p-1.5 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 hover:border-white/50 text-white/90 hover:text-white transition-all cursor-pointer"
                  >
                    {isMuted ? (
                      <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    ) : (
                      <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    )}
                  </button>

                  {/* Glassmorphic Restart Button */}
                  <button
                    type="button"
                    onClick={handleRestart}
                    aria-label="Restart video"
                    title="Restart"
                    className="flex-shrink-0 p-1 sm:p-1.5 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 hover:border-white/50 text-white/90 hover:text-white transition-all cursor-pointer hidden xs:flex"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="relative w-full h-full cursor-pointer"
              onClick={onTogglePlay}
            >
              {/* HD Poster Thumbnail */}
              <img
                src={film.poster}
                alt={`${film.couple} Wedding Film`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${film.youtubeId}/hqdefault.jpg`;
                }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />

              {/* CRT Curved Glass Inner Bezel Shadow & Atmospheric Lighting */}
              <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0_0_24px_rgba(0,0,0,0.85),inset_0_2px_4px_rgba(255,255,255,0.18)]" />

              {/* Subtle Vintage CRT Scanline & Glass Sheen Overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-gradient-to-tr from-transparent via-white/10 to-white/30"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.2) 0%, transparent 60%)",
                }}
              />

              {/* Glassmorphic Play Button in Center */}
              <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 pointer-events-none">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white/20 hover:bg-white/35 active:scale-95 backdrop-blur-md border border-white/50 text-white flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-110">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 fill-white text-white translate-x-0.5 sm:translate-x-1" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function FilmCollection() {
  const [playingFilmId, setPlayingFilmId] = useState<string | null>(null);

  const togglePlay = (filmId: string) => {
    setPlayingFilmId((prev) => (prev === filmId ? null : filmId));
  };

  return (
    <section
      id="films"
      className="relative w-full bg-[#FAF7F0] text-[#080808] pt-16 sm:pt-20 md:pt-24 pb-20 sm:pb-28 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 selection:bg-[#080808] selection:text-[#FAF7F0]"
    >
      <div className="max-w-[1360px] mx-auto">
        {/* Top Sub-Header Bar */}
        <div className="flex items-center justify-between pb-8 sm:pb-12 border-b border-[#080808]/15">
          <span className="font-sans text-[10px] sm:text-[11px] tracking-[0.28em] font-normal uppercase text-[#080808]">
            90S FILM
          </span>
          <div className="flex items-center gap-4 sm:gap-8 font-sans text-[10px] sm:text-[11px] tracking-[0.26em] uppercase text-[#080808]/85">
            <span className="hover:text-[#080808] cursor-pointer transition-colors">PEOPLE</span>
            <span className="hover:text-[#080808] cursor-pointer transition-colors">PLACES</span>
            <span className="hover:text-[#080808] cursor-pointer transition-colors">FILMS</span>
            <span className="opacity-40 select-none">——</span>
          </div>
        </div>

        {/* Opening Editorial Masthead */}
        <div className="pt-10 sm:pt-14 md:pt-16 pb-8 sm:pb-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Big Headline & Editorial Stance */}
          <div className="lg:col-span-8 flex flex-col">
            <p className="font-sans text-[9.5px] sm:text-[11px] tracking-[0.28em] uppercase text-[#080808]/70 mb-4 sm:mb-6">
              EVERY FRAME, A MEMORY
            </p>
            <h2 className="font-vogue text-[7.5vw] sm:text-[5.5vw] md:text-[4.2vw] lg:text-[48px] xl:text-[56px] leading-[1.04] tracking-[0.025em] font-normal text-[#080808] uppercase">
              WE CAPTURE IT AS IT HAPPENS.
              <br />
              SO YOU CAN FEEL IT FOREVER.
            </h2>
            <p className="mt-5 sm:mt-7 font-editorial italic text-xl sm:text-2xl md:text-[28px] text-[#080808]/85 tracking-wide">
              Wedding stories, preserved in motion.
            </p>
          </div>

          {/* Right Column: Editorial Note & Categories in one line */}
          <div className="lg:col-span-4 flex flex-col justify-start pt-1 sm:pt-2 lg:pt-4">
            <p className="font-sans font-light text-xs sm:text-sm md:text-[14px] leading-[1.8] text-[#080808]/75 max-w-[320px]">
              A collection of real people, real celebrations and the moments that still feel
              alive.
            </p>

            {/* One-line category list placed directly under the subheading with generous spacing */}
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-6 sm:gap-7 font-sans text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-[#080808]/70">
              <span className="hover:text-[#080808] cursor-pointer transition-colors">LOVE</span>
              <span className="hover:text-[#080808] cursor-pointer transition-colors">PEOPLE</span>
              <span className="hover:text-[#080808] cursor-pointer transition-colors">PLACES</span>
              <span className="hover:text-[#080808] cursor-pointer transition-colors">FILMS</span>
            </div>
          </div>
        </div>

        {/* Hairline Divider with balanced margin */}
        <div className="w-full h-[1px] bg-[#080808]/15 mb-8 sm:mb-12 lg:mb-16" />

        {/* 3 Alternating Television Presentations */}
        <div className="space-y-24 sm:space-y-32 md:space-y-40">
          {FILMS.map((film, index) => {
            const isEven = index % 2 === 1; // Film 02 is reversed (TV on left, Text on right)
            const isRightAlignedOnMobile = film.id === "film-01" || film.id === "film-03";

            return (
              <div
                key={film.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-center"
              >
                {/* Text Content Column */}
                <div
                  className={`flex flex-col ${
                    isEven
                      ? "lg:col-span-5 lg:order-2 lg:pl-6"
                      : "lg:col-span-5 lg:order-1 lg:pr-6"
                  } ${
                    isRightAlignedOnMobile
                      ? "items-end text-right self-end ml-auto lg:items-start lg:text-left lg:self-auto lg:ml-0"
                      : ""
                  }`}
                >
                  {/* Chapter number and fine horizontal rule */}
                  <div
                    className={`flex items-center gap-4 mb-6 sm:mb-8 ${
                      isRightAlignedOnMobile
                        ? "justify-end lg:justify-start"
                        : ""
                    }`}
                  >
                    <span className="font-mono text-xs sm:text-sm text-[#080808]/70 tracking-wider">
                      {film.chapter}
                    </span>
                    <div className="hidden lg:block h-[1px] w-24 sm:w-32 bg-[#080808]/25" />
                  </div>

                  {/* Headline */}
                  <h3 className="font-vogue text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] leading-[1.05] tracking-[0.035em] font-normal text-[#080808] uppercase mb-4 sm:mb-6">
                    {film.mobileTitle ? (
                      <>
                        <div className="hidden lg:block">
                          {film.title.map((line, i) => (
                            <span key={i} className="block">
                              {line}
                            </span>
                          ))}
                        </div>
                        <div className="block lg:hidden">
                          {film.mobileTitle.map((line, i) => (
                            <span key={i} className="block">
                              {line}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      film.title.map((line, i) => (
                        <span key={i} className="block">
                          {line}
                        </span>
                      ))
                    )}
                  </h3>

                  {/* Caption */}
                  <p
                    className={`font-sans font-light text-sm sm:text-base leading-[1.8] text-[#080808]/80 max-w-md mb-6 sm:mb-8 ${
                      isRightAlignedOnMobile ? "text-right lg:text-left" : ""
                    }`}
                  >
                    {film.caption}
                  </p>

                  {/* Hairline separator dash */}
                  <div className="hidden lg:block w-8 h-[1px] bg-[#080808]/30 mb-5 sm:mb-6" />

                  {/* Metadata */}
                  <div
                    className={`space-y-1 font-sans text-[11px] sm:text-xs tracking-[0.24em] uppercase text-[#080808]/65 font-medium ${
                      isRightAlignedOnMobile ? "text-right lg:text-left" : ""
                    }`}
                  >
                    <p>{film.couple}</p>
                    <p>{film.category}</p>
                  </div>
                </div>

                {/* Television Column */}
                <div
                  className={`w-full ${
                    isEven
                      ? "lg:col-span-7 lg:order-1"
                      : "lg:col-span-7 lg:order-2"
                  }`}
                >
                  <Television
                    film={film}
                    isPlaying={playingFilmId === film.id}
                    onTogglePlay={() => togglePlay(film.id)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section Footer Divider */}
        <div className="w-full h-[1px] bg-[#080808]/15 mt-24 sm:mt-32 md:mt-40 mb-8 sm:mb-12" />

        {/* Bottom Editorial Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-left">
          <span className="font-sans text-[10px] sm:text-[11px] tracking-[0.26em] uppercase text-[#080808]/70">
            REAL STORIES
          </span>
          <p className="font-editorial italic text-base sm:text-lg text-[#080808]/85 tracking-wide">
            More than films. A feeling.
          </p>
          <span className="font-sans text-[10px] sm:text-[11px] tracking-[0.26em] uppercase text-[#080808]/70">
            BY 90S FILM
          </span>
        </div>
      </div>
    </section>
  );
}
