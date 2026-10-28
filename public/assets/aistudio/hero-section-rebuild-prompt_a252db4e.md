# Hero Section — Exact Rebuild Prompt (copy everything below into the other chat)

---

Build the following hero section EXACTLY as specified. Do not redesign, simplify, or improvise. Use the code I provide verbatim. This is a full-viewport, magazine-cover style hero for a wedding photography brand called "Fourfold Pictures", with an auto-advancing 5-image slideshow, a centered masthead logo image, and editorial cover lines at the bottom.

## 1. Fonts (required)

Load these Google Fonts via a `<link>` tag in the document head (do NOT @import them from CSS):

```
https://fonts.googleapis.com/css2?family=Italiana&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap
```

## 2. CSS (add this to the global stylesheet)

Tailwind CSS v4 is used. Add these theme tokens and utilities:

```css
@theme inline {
  --color-milk: var(--milk);
  --font-display: "Cormorant Garamond", ui-serif, Georgia, serif;
  --font-brand: "Italiana", "Cormorant Garamond", ui-serif, Georgia, serif;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}

:root {
  --milk: oklch(0.984 0.018 95); /* #FDFBF0 Milky White */
}

@utility font-display {
  font-family: var(--font-display);
}

.cover-line {
  font-family: var(--font-sans);
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-weight: 400;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-up { animation: fadeUp 1.2s ease-out both; }
```

## 3. Assets (exact URLs — use them verbatim)

Hero logo (white "Fourfold Pictures" wordmark PNG, hosted):

```
https://res.cloudinary.com/dtembvivw/image/upload/v1784292567/fourfold-logo_med8k8.png
```

First slide image (also used as HERO_IMAGE):

```
https://res.cloudinary.com/dtembvivw/image/upload/v1779732042/SaveClip.App_518998457_18085834000704263_2487413177226220895_n_tfq7bv.jpg
```

The other four slideshow images:

```
https://res.cloudinary.com/dtembvivw/image/upload/v1777536030/The_beginning_of_beautiful_forever_%EF%B8%8F_Reeyaa_Nair_MR_Khanijo_Designed_Photographed_-_f_1_l56ehr.jpg
https://res.cloudinary.com/dtembvivw/image/upload/v1777536012/SnapInsta.to_658813963_18576268351025068_8987836767423854437_n_nyfw6f.jpg
https://res.cloudinary.com/dtembvivw/image/upload/v1777536019/She_wore_the_wind_like_a_whisper_draped_in_sunlight_and_silence_a_fleeting_dream_by_the_water_s_fmyacn.jpg
https://res.cloudinary.com/dtembvivw/image/upload/v1777536024/SnapInsta.to_566520930_18096225913704263_3186290050904152969_n_sifgmv.jpg
```

## 4. Complete component code (use verbatim)

```tsx
import { useEffect, useState } from "react";

const HERO_LOGO = "https://res.cloudinary.com/dtembvivw/image/upload/v1784292567/fourfold-logo_med8k8.png";

const SLIDES = [
  "https://res.cloudinary.com/dtembvivw/image/upload/v1779732042/SaveClip.App_518998457_18085834000704263_2487413177226220895_n_tfq7bv.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536030/The_beginning_of_beautiful_forever_%EF%B8%8F_Reeyaa_Nair_MR_Khanijo_Designed_Photographed_-_f_1_l56ehr.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536012/SnapInsta.to_658813963_18576268351025068_8987836767423854437_n_nyfw6f.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536019/She_wore_the_wind_like_a_whisper_draped_in_sunlight_and_silence_a_fleeting_dream_by_the_water_s_fmyacn.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536024/SnapInsta.to_566520930_18096225913704263_3186290050904152969_n_sifgmv.jpg",
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
          alt="Label Knot — premium Indian wedding photography"
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
        <div className="px-6 md:px-12 pt-24 md:pt-28 flex items-start justify-between fade-up">
          <span className="cover-line opacity-90">
            Volume XII &nbsp;·&nbsp; MMXXVI
          </span>
          <span className="cover-line hidden md:block opacity-90">
            Est. 2020 &nbsp;·&nbsp; Six Years of Trust
          </span>
        </div>

        {/* Masthead */}
        <div className="px-6 md:px-12 mt-[10vh] md:mt-10 fade-up text-center flex flex-col items-center">
          <h1 className="sr-only">Fourfold Pictures</h1>
          <img
            src={HERO_LOGO}
            alt="Fourfold Pictures"
            className="w-[85vw] max-w-[640px] md:w-[60vw] lg:w-[52vw] select-none pointer-events-none"
            draggable={false}
          />
          <p className="mt-5 md:mt-6 font-display italic text-base md:text-xl tracking-wide opacity-90">
            Where stories become timeless art
          </p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Cover lines — short, editorial, magazine-rhythm */}
        <div className="px-6 md:px-12 pb-16 md:pb-24 fade-up">
          {/* Editorial row: N°01 left · N°02 right (mirrored) */}
          <div className="grid grid-cols-2 gap-6 md:gap-8 items-start -translate-y-[3vh]">
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

          {/* Centered: Premium Wedding House + locations */}
          <div className="mt-6 md:mt-8 text-center space-y-2 md:space-y-3">
            <p className="cover-line opacity-80">Premium Wedding House</p>
            <p className="font-display text-sm md:text-2xl leading-snug tracking-wide whitespace-nowrap">
              MUMBAI · JAIPUR· BANGLORE · DUBAI · UK ·
            </p>
            <p className="font-display text-sm md:text-2xl leading-snug tracking-wide">
              Worldwide
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

## 5. Behavior requirements (must all be true)

- The section is exactly `100svh` tall (min 720px), full width, overflow hidden.
- Five full-bleed images stacked absolutely, all `object-cover`; only the active one is visible (opacity 1), with a 1.2s ease-in-out crossfade.
- The slideshow advances automatically every 3 seconds, looping back to the first image.
- All five images are preloaded on mount (new Image() in a useEffect).
- The first image loads eagerly; the rest lazily.
- If an image fails to load, the slideshow skips to the next slide (onError advances the index).
- Two gradient overlays sit above the images: a vertical one (black/35 → black/10 → black/55) and a horizontal one (black/25 → transparent), both at z-10.
- All hero text is the Milky White color `var(--milk)` (#FDFBF0), z-10 above the overlays, laid out as a full-height flex column: issue line at top, masthead centered, flexible spacer, cover lines at the bottom.
- The masthead logo scales responsively: 85vw on mobile (max 640px), 60vw on tablet, 52vw on desktop; it is not draggable and not pointer-interactive.
- The bottom N°01/N°02 block is nudged up by `-translate-y-[3vh]`, and the N°02 column is mirrored right with a negative top margin of `-mt-[calc(2.5rem+3vh)]` (mobile) / `-mt-[calc(2rem+3vh)]` (desktop).
- Top and bottom blocks fade in with the `fade-up` animation (1.2s ease-out, 20px rise).
- Do not add navigation, buttons, scroll indicators, or any other elements. This is only the hero section.
