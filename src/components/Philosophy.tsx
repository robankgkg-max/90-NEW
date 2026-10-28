import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Maximize,
  Minimize,
} from "lucide-react";

const VIDEO_POSTER =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85";
const VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function Philosophy() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);

  const triggerControlsActivity = () => {
    setShowControls(true);
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
    }
    if (isPlaying) {
      hideTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 2400);
    }
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    triggerControlsActivity();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    triggerControlsActivity();
  };

  const handleReplay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    setCurrentTime(0);
    videoRef.current.play();
    setIsPlaying(true);
    triggerControlsActivity();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
    triggerControlsActivity();
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="relative w-full bg-[#FFFFFF] text-[#080808] py-24 sm:py-32 md:py-40 px-6 sm:px-8 md:px-12 selection:bg-[#080808] selection:text-[#FFFFFF]">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Top Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="font-vogue font-normal uppercase tracking-[0.24em] text-xl sm:text-2xl md:text-3xl lg:text-[34px] leading-tight text-[#080808]">
            OUR PHILOSOPHY
          </h2>
          <p className="mt-3 md:mt-4 font-editorial italic text-base sm:text-lg md:text-xl text-[#080808]/75 tracking-wide">
            don't skip what's coming if you want the best from 90s Frame
          </p>
        </div>

        {/* 16:9 Cinema Video Player */}
        <div
          ref={containerRef}
          onMouseMove={triggerControlsActivity}
          onTouchStart={triggerControlsActivity}
          className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_12px_44px_rgba(0,0,0,0.12)] border border-[#080808]/10 bg-black group select-none"
        >
          <video
            ref={videoRef}
            src={VIDEO_URL}
            poster={VIDEO_POSTER}
            playsInline
            crossOrigin="anonymous"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => {
              setIsPlaying(false);
              setShowControls(true);
            }}
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Large Center Translucent Backdrop-Blur Play/Pause Button */}
          {(!isPlaying || showControls) && (
            <button
              onClick={togglePlay}
              type="button"
              aria-label={isPlaying ? "Pause video" : "Play video"}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-black/40 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-black/55 shadow-2xl z-20 ${
                isPlaying && !showControls ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white fill-white" />
              ) : (
                <Play className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white fill-white translate-x-0.5 sm:translate-x-1" />
              )}
            </button>
          )}

          {/* Poster prompt indicator when not started */}
          {!hasStarted && (
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs tracking-[0.2em] uppercase font-sans pointer-events-none">
              Cinema Reel &nbsp;·&nbsp; 16:9
            </div>
          )}

          {/* Custom Bottom Control Bar */}
          <div
            className={`absolute inset-x-0 bottom-0 pt-12 pb-4 sm:pb-5 px-4 sm:px-6 bg-gradient-to-t from-black/85 via-black/45 to-transparent transition-opacity duration-300 z-20 flex flex-col gap-2.5 sm:gap-3 text-white ${
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Time Scrubber Slider */}
            <div className="relative w-full group/scrubber flex items-center cursor-pointer">
              <div className="w-full h-1 sm:h-1.5 bg-white/25 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                aria-label="Seek time"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-sans">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Mini Play/Pause */}
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="p-1 hover:text-white/80 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                  )}
                </button>

                {/* Replay button */}
                <button
                  type="button"
                  onClick={handleReplay}
                  aria-label="Replay from start"
                  className="p-1 hover:text-white/80 transition-colors"
                  title="Replay"
                >
                  <RotateCcw className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>

                {/* Timecode */}
                <span className="font-mono text-[11px] sm:text-xs text-white/90 tracking-wider">
                  {formatTime(currentTime)} &nbsp;/&nbsp; {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                {/* Audio mute toggle */}
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  className="p-1 hover:text-white/80 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>

                {/* Fullscreen toggle */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  className="p-1 hover:text-white/80 transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Headline Under Video */}
        <div className="mt-20 sm:mt-24 md:mt-28 text-center max-w-4xl">
          <h3 className="font-vogue font-normal uppercase text-2xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-[50px] tracking-[0.04em] leading-[1.12] text-[#080808]">
            THE DAY MOVES FASTER THAN YOU THINK
          </h3>
        </div>

        {/* Hairline editorial rule */}
        <div className="w-16 h-[1px] bg-[#080808]/15 my-12 sm:my-16" />

        {/* Poetic Editorial Cadence Copy */}
        <div className="w-full max-w-3xl space-y-12 sm:space-y-16 text-center sm:text-left">
          {/* Stanza 1 */}
          <div>
            <p className="font-editorial italic text-2xl sm:text-3xl md:text-4xl leading-snug text-[#080808]">
              You will not remember it the way you think you will.
            </p>
          </div>

          {/* Stanza 2 */}
          <div>
            <p className="font-sans font-light text-base sm:text-lg md:text-xl leading-[1.8] text-[#080808]/80 max-w-2xl">
              The morning. The chaos. The quiet before the ceremony. Your
              mother’s face when she saw you. Your father, composing himself in a
              corridor where he thought no one was watching.
            </p>
          </div>

          {/* Stanza 3 */}
          <div>
            <p className="font-editorial italic text-2xl sm:text-3xl md:text-4xl leading-snug text-[#080808]">
              These moments do not wait.
            </p>
          </div>

          {/* Stanza 4 */}
          <div>
            <p className="font-sans font-light text-base sm:text-lg md:text-xl leading-[1.8] text-[#080808]/80 max-w-2xl">
              They happen in the margins — while everyone is looking somewhere
              else — and then they are gone. Not just from the day. From
              everything.
            </p>
          </div>

          {/* Stanza 5 */}
          <div className="pt-2">
            <p className="font-sans font-normal text-lg sm:text-xl md:text-2xl text-[#080808]">
              This is the only part of your wedding that cannot be redone.
            </p>
            <p className="font-sans font-semibold uppercase tracking-[0.16em] text-xs sm:text-sm text-[#080808]/60 mt-2">
              NOT THE FLOWERS. NOT THE VENUE. NOT THE FOOD.
            </p>
          </div>

          {/* Stanza 6 */}
          <div className="py-2">
            <p className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#080808]">
              The moments.
            </p>
          </div>

          {/* Stanza 7 */}
          <div>
            <p className="font-sans font-light text-base sm:text-lg md:text-xl leading-[1.8] text-[#080808]/80 max-w-2xl">
              90s Frame exists for exactly this. We have been in that corridor.
              We know what happens there. And we will not miss it.
            </p>
          </div>

          {/* Stanza 8 */}
          <div className="pt-2">
            <p className="font-editorial italic text-2xl sm:text-3xl md:text-4xl text-[#080808]">
              Your day is safe with us.
            </p>
          </div>

          {/* Optional Button */}
          <div className="pt-6 sm:pt-8 text-center sm:text-left">
            <a
              href="#contact"
              className="inline-block uppercase tracking-[0.26em] text-xs sm:text-sm py-4 px-8 sm:px-10 border border-[#080808] hover:bg-[#080808] hover:text-[#FFFFFF] transition-all duration-300 font-sans font-medium text-[#080808]"
            >
              CHECK AVAILABILITY &amp; COMMISSIONS
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
