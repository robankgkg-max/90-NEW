import { useEffect, useState } from "react";
import { Philosophy } from "./components/Philosophy.tsx";
import { Gallery } from "./components/labelknot/Gallery.tsx";
import { FilmCollection } from "./components/film/FilmCollection.tsx";

const SLIDES = [
  "https://res.cloudinary.com/cbi5mcab/image/upload/v1791530489/SaveClip.App_632648246_18092819237051532_7974760865679486695_n_m1b73t.jpg",
  "https://res.cloudinary.com/cbi5mcab/image/upload/v1791618662/SaveClip.App_646041741_17944259484134829_729453406910433037_n_brtevb.jpg",
  "https://res.cloudinary.com/cbi5mcab/image/upload/v1791618663/SaveClip.App_587271515_18085700834051532_6665946415540074906_n_i26efd.jpg",
  "https://res.cloudinary.com/cbi5mcab/image/upload/v1791618663/SaveClip.App_541586472_18076222982051532_4030795883923455753_n_evx4ce.jpg",
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    SLIDES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="top" className="relative h-[100svh] min-h-[720px] w-full overflow-hidden">
      {/* Slideshow */}
      {SLIDES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="90s FRAME — premium Indian wedding photography"
          crossOrigin="anonymous"
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{
            opacity: i === current ? 1 : 0,
            transition: "opacity 1.2s ease-in-out",
            zIndex: i === current ? 1 : 0,
          }}
          loading={i === 0 ? "eager" : "lazy"}
          onError={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
        />
      ))}

      {/* Editorial vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/25 to-transparent z-10" />

      {/* Cover anatomy */}
      <div
        className="relative z-10 h-full w-full flex flex-col"
        style={{ color: "var(--milk)" }}
      >
        {/* Top issue line */}
        <div className="px-6 md:px-12 pt-7 md:pt-28 flex items-center justify-center md:justify-between fade-up">
          <span className="cover-line opacity-90 hidden md:block">
            Volume XII &nbsp;·&nbsp; MMXXVI
          </span>
          <span className="cover-line opacity-90 text-[9px] md:text-[10px] tracking-[0.24em] md:tracking-[0.28em] text-center md:text-right">
            Est. 2020 &nbsp;·&nbsp; Six Years of Trust
          </span>
        </div>

        {/* Masthead — restored to original vertical placement */}
        <div className="px-6 md:px-12 mt-[10vh] md:mt-10 fade-up text-center flex flex-col items-center">
          <h1 className="font-masthead text-[13.5vw] sm:text-[10vw] md:text-[6.8vw] lg:text-[5.5rem] xl:text-[6.2rem] font-normal leading-[0.95] text-[var(--milk)] select-none">
            90s&nbsp;<span className="tracking-[0.035em]">FRAME</span>
          </h1>
          <p className="mt-5 md:mt-6 font-masthead italic text-base md:text-xl tracking-wide opacity-90 select-none">
            Some moments deserve forever.
          </p>
        </div>

        {/* Mobile split line: Volume XII on left, MMXXVI on right, dragged ~10% down */}
        <div className="px-6 md:hidden mt-[8vh] sm:mt-[10vh] fade-up flex items-center justify-between">
          <span className="cover-line opacity-85 text-[8.5px] sm:text-[9px] tracking-[0.24em] uppercase">
            Volume XII
          </span>
          <span className="cover-line opacity-85 text-[8.5px] sm:text-[9px] tracking-[0.24em] uppercase">
            MMXXVI
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-[3vh]" />

        {/* Cover lines — short, editorial, magazine-rhythm */}
        <div className="px-6 md:px-12 pb-6 md:pb-8 fade-up">
          {/* Editorial row: N°01 left · N°02 right (mirrored, moved 5% higher together) */}
          <div className="grid grid-cols-2 gap-6 md:gap-8 items-start -translate-y-[8vh]">
            <div>
              <p className="cover-line opacity-80 mb-2">N° 01</p>
              <p className="font-display italic text-xl md:text-3xl leading-tight">
                Subtle Luxury,
                <br />
                <span className="not-italic uppercase tracking-[0.04em]">Quiet Vows</span>
              </p>
            </div>
            <div className="text-right -mt-[calc(2.5rem+3vh)] md:-mt-[calc(2rem+3vh)]">
              <p className="cover-line opacity-80 mb-2">N° 02</p>
              <p className="font-display italic text-xl md:text-3xl leading-tight">
                Rare Frames,
                <br />
                <span className="not-italic uppercase tracking-[0.04em]">Fine Moments</span>
              </p>
            </div>
          </div>

          {/* Centered: Premium Wedding House + locations dragged close to bottom */}
          <div className="mt-12 md:mt-16 text-center space-y-2 md:space-y-3">
            <p className="cover-line opacity-80">Premium Wedding House</p>
            <p className="font-display text-base md:text-2xl leading-snug tracking-[0.24em] whitespace-nowrap">
              IND &nbsp;·&nbsp; DUBAI &nbsp;·&nbsp; UK
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Hero />
      <Philosophy />
      <Gallery />
      <FilmCollection />
    </div>
  );
}
