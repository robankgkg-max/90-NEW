# Rebuild the Fourfold Pictures Gallery Section — Paste-Ready Prompt

Copy everything below this line into the other chat as a single message.

---

Build a full-bleed editorial photo gallery section for a wedding photography site. It must reproduce EXACTLY the design, layout, ordering, typography, and behavior described below. Do not redesign it. Do not simplify it. Do not substitute images.

## 1. Prerequisites the other project must have

- Tailwind CSS installed and configured (the component uses Tailwind utility classes: `grid`, `aspect-[4/5]`, `clamp`-based responsive text sizes, `group-hover` scale transitions).
- React + TypeScript.
- Google Fonts loaded via `<link>` tags in the document head (NOT @import in CSS):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Italiana&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&family=Pinyon+Script&display=swap" rel="stylesheet" />
```

## 2. CSS tokens — paste into the project's global CSS

```css
:root {
  --milk: #FDFBF0;    /* Milky White — page background */
  --sage: #465940;    /* Deep Sage — body text */
  --sand: #E4DBC4;    /* Sand — gallery section + interstitial cell backgrounds */
  --everest: #18442A; /* Everest — headings + script text */
}

.font-display {
  font-family: "Cormorant Garamond", ui-serif, Georgia, serif;
}

.editorial-headline {
  font-family: "Cormorant Garamond", ui-serif, Georgia, serif;
  font-weight: 400;
  line-height: 0.95;
  letter-spacing: -0.01em;
}

.cover-line {
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-weight: 400;
}
```

## 3. The component — create `src/components/labelknot/Gallery.tsx` with EXACTLY this code

```tsx
// 15 unique portfolio images + extras. Tonally arranged: warm → neutral → cool.
const GALLERY_POOL = [
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536030/The_beginning_of_beautiful_forever_%EF%B8%8F_Reeyaa_Nair_MR_Khanijo_Designed_Photographed_-_f_2_axywtv.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536030/The_beginning_of_beautiful_forever_%EF%B8%8F_Reeyaa_Nair_MR_Khanijo_Designed_Photographed_-_f_1_l56ehr.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536027/happiest_day_of_our_lives_%EF%B8%8F_%EF%B8%8F_wearing_falgunishanepeacockindia_jewelry_thehouseoframbhajos_1_d8mfpl.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536026/SnapInsta.to_584379985_18099135868704263_996930929795271541_n_dzjggo.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536028/Photographed_-_fourfoldpictures_Shot_on_-_canonindia_official_EOSR5M2_Venue_-_theleela_jjx1ny.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536024/SnapInsta.to_566520930_18096225913704263_3186290050904152969_n_sifgmv.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536019/She_wore_the_wind_like_a_whisper_draped_in_sunlight_and_silence_a_fleeting_dream_by_the_water_s_fmyacn.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536018/SnapInsta.to_476996943_18072413347704263_2797024523165678757_n_kvq9gg.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536014/SnapInsta.to_469357702_18065687548704263_2091319423728317775_n_gcb3on.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536018/SnapInsta.to_476954063_18072413365704263_3843128294774299133_n_bhfmdg.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536013/Sakshi_Raghav_Photographed-_fourfoldpictures_Muah_-_meerasakhrani_Outfits_-_seemagujraldes_tuziek.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536012/SnapInsta.to_658813963_18576268351025068_8987836767423854437_n_nyfw6f.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536017/SnapInsta.to_471455656_18067546981704263_2281211428631011054_n_tatyih.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536016/SnapInsta.to_469328362_18065688475704263_2300210543057426434_n_icadut.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536016/SnapInsta.to_463649675_18061077367704263_3536923457009578892_n_xgux4u.jpg",
];

const EXTRA_POOL = [
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536011/SnapInsta.to_469287513_18065688406704263_8090720898632866003_n_kxqejw.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536010/SnapInsta.to_651004156_18097043860235068_2790687977078960437_n_glglwk.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536009/SnapInsta.to_655760929_18101574105235068_5895388860891538706_n_qwxdca.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536010/SnapInsta.to_469278126_18065687737704263_4891117197391283596_n_yauoex.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536009/Aarushi_Chirag_..._Couple_-_aarushimall_chiragbansal19_Muah_-_dollyouup_bys_Bride_Saree_-_ek_4_uwbrf0.jpg",
  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536010/SnapInsta.to_469183908_18065687623704263_3856023466478099866_n_jfbzwh.jpg",
];

// Tonally arranged 30 cells: 15 unique images repeated, with 5 sand interstitials
// at balanced positions (rows: 2, 4, 6, 8, 9 — not clustered).
type Cell =
  | { kind: "img"; src: string; idx: number }
  | { kind: "text"; line: string };

// Warm → neutral → cool curated order using indices into GALLERY_POOL
const ORDER = [
  2, 0, 4,
  1, 3, 5,
  6, 7, 8,
  9, 10, 11,
  12, 13, 14,
  0, 5, 2,
  4, 8, 6,
  1, 11, 3,
  9, 13, 7,
  10, 14, 12,
];

const INTERSTITIALS: { at: number; line: string }[] = [
  { at: 4, line: "Frames of Pure Emotion" },
  { at: 11, line: "Sacred Vows" },
  { at: 17, line: "Timeless in Soft Light" },
  { at: 22, line: "Stolen Glances" },
  { at: 27, line: "Golden Hours" },
];

function buildCells(): Cell[] {
  const cells: Cell[] = ORDER.map((idx) => ({
    kind: "img" as const,
    src: GALLERY_POOL[idx],
    idx,
  }));
  INTERSTITIALS.forEach(({ at, line }) => {
    cells[at] = { kind: "text", line };
  });
  const EXTRA_ORDER = [
    "https://res.cloudinary.com/dtembvivw/image/upload/v1778166004/SaveClip.App_656403465_18019254551824133_1727390248362862999_n_kamcvk.jpg", GALLERY_POOL[3],  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536017/SnapInsta.to_471588587_18067547047704263_893259353441750017_n_zy2zim.jpg",
    GALLERY_POOL[7], EXTRA_POOL[2],  GALLERY_POOL[11],
    "https://res.cloudinary.com/dtembvivw/image/upload/v1777536017/MEAGAN_SHELDON_As_seen_in_vogueindia_Photographed_-_fourfoldpictures_Bride_stylist_by_amazi_1_tud8ye.jpg", "https://res.cloudinary.com/dtembvivw/image/upload/v1777536025/Can_t_get_over_this_beautiful_intimate_wedding_of_Anjana_-_Anish_-_Bahrain_%EF%B8%8F_vogue_voguewe_bwq9qt.jpg",  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536015/SnapInsta.to_469140943_18065687320704263_1820009380109301005_n_oeicru.jpg",
    "https://res.cloudinary.com/dtembvivw/image/upload/v1777536023/SnapInsta.to_573576427_18097592563704263_398145204125775613_n_npdqjv.jpg", "https://res.cloudinary.com/dtembvivw/image/upload/v1777536010/SnapInsta.to_469278126_18065684848704263_7029483129411727534_n_loaayk.jpg",  "https://res.cloudinary.com/dtembvivw/image/upload/v1777536023/SnapInsta.to_571874902_18097592692704263_7967907277228602865_n_ouy709.jpg",
    GALLERY_POOL[2], GALLERY_POOL[8],  GALLERY_POOL[8],
  ];
  EXTRA_ORDER.forEach((src) => {
    cells.push({ kind: "img" as const, src, idx: -1 });
  });
  return cells;
}

function getPosition(i: number): string {
  const m = i % 9;
  if (m === 0) return "center 20%";
  if (m === 1) return "center 50%";
  if (m === 2) return "center 30%";
  if (m === 3) return "center 70%";
  if (m === 5) return "center 15%";
  if (m === 6) return "center 40%";
  if (m === 8) return "center 60%";
  return "center center";
}

export function Gallery() {
  const cells = buildCells();
  return (
    <section
      id="gallery"
      className="relative pt-32 md:pt-44 pb-[2px]"
      style={{ backgroundColor: "var(--sand)" }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 mb-14 md:mb-20 text-center">
        <h2
          className="editorial-headline text-4xl md:text-6xl mx-auto max-w-4xl uppercase tracking-tight"
          style={{ color: "var(--everest)" }}
        >
          The Frames That Felt Like Breathing
        </h2>
        <p
          className="font-display italic mt-6 mx-auto max-w-2xl text-lg md:text-2xl"
          style={{ color: "var(--everest)" }}
        >
          Everything the eye almost missed — we were already watching before it happened.
        </p>
      </div>

      {/* Full bleed 3 col grid */}
      <div className="grid grid-cols-3 gap-[2px]">
        {cells.map((c, i) =>
          c.kind === "img" ? (
            i === 9 ? (
              <div
                key={i}
                className="aspect-[4/5] flex items-center justify-center"
                style={{ backgroundColor: "var(--sand)" }}
              >
                <p
                  style={{
                    fontFamily: "'Pinyon Script', cursive",
                    fontSize: "clamp(1.6rem, 5.2vw, 2.5rem)",
                    lineHeight: 1.35,
                    color: "var(--everest)",
                    textAlign: "center",
                    padding: "0 8%",
                    opacity: 0.88,
                  }}
                >
                  Love That Lives On
                </p>
              </div>
            ) : i === 34 ? (
              <div
                key={i}
                className="aspect-[4/5] flex items-center justify-center"
                style={{ backgroundColor: "var(--sand)" }}
              >
                <p
                  style={{
                    fontFamily: "'Pinyon Script', cursive",
                    fontSize: "clamp(1.6rem, 5.2vw, 2.5rem)",
                    lineHeight: 1.35,
                    color: "var(--everest)",
                    textAlign: "center",
                    padding: "0 8%",
                    opacity: 0.88,
                  }}
                >
                  Cherished forever.
                </p>
              </div>
            ) : i === 42 || i === 44 ? (
              <div
                key={i}
                className="aspect-[4/5] flex items-center justify-center"
                style={{ backgroundColor: "var(--sand)" }}
              >
                <p
                  style={{
                    fontFamily: "'Pinyon Script', cursive",
                    fontSize: "clamp(1.6rem, 5.2vw, 2.5rem)",
                    lineHeight: 1.35,
                    color: "var(--everest)",
                    textAlign: "center",
                    padding: "0 8%",
                    opacity: 0.88,
                  }}
                >
                  {i === 42 ? "Quiet Grace" : "Forever Yours"}
                </p>
              </div>
            ) : (
              <figure key={i} className="relative overflow-hidden group bg-[var(--milk)] aspect-[4/5]">
                <img
                  src={c.src}
                  alt={`Label Knot frame ${i + 1}`}
                  loading={i < 6 ? "eager" : "lazy"}
                  style={{ objectPosition: getPosition(i) }}
                  className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
              </figure>
            )
          ) : (
            <div
              key={i}
              className="aspect-[4/5] flex items-center justify-center"
              style={{ backgroundColor: "var(--sand)" }}
            >
              <p
                style={{
                  fontFamily: "'Pinyon Script', cursive",
                  fontSize: "clamp(1.6rem, 5.2vw, 2.5rem)",
                  lineHeight: 1.35,
                  color: "var(--everest)",
                  textAlign: "center",
                  padding: "0 8%",
                  opacity: 0.88,
                }}
              >
                {c.line}
              </p>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
```

## 4. How to place it

- Render `<Gallery />` where the old gallery/portfolio section was, replacing it entirely. Import it as: `import { Gallery } from "@/components/labelknot/Gallery";`

## 5. Behavior checklist — verify all of these after building

1. **Section**: full-width, background `--sand` (#E4DBC4), top padding 128px (192px on md+), bottom 2px.
2. **Header**: centered Cormorant Garamond uppercase headline "THE FRAMES THAT FELT LIKE BREATHING" (text-4xl mobile / text-6xl desktop, max-w-4xl) + italic serif subline "Everything the eye almost missed — we were already watching before it happened." (text-lg / text-2xl, mt-6).
3. **Grid**: full-bleed 3-column grid with 2px gaps, NO horizontal padding. Every cell is aspect-ratio 4/5.
4. **Cell count**: exactly 45 cells = 30 (15 images in the curated ORDER with 5 replaced by script-text interstitials) + 15 EXTRA_ORDER images appended.
5. **Interstitial text cells** (sand background, no image, Pinyon Script at clamp(1.6rem, 5.2vw, 2.5rem), color --everest, opacity 0.88): index 4 "Frames of Pure Emotion", 11 "Sacred Vows", 17 "Timeless in Soft Light", 22 "Stolen Glances", 27 "Golden Hours".
6. **Four extra named script cells replacing images**: index 9 "Love That Lives On", index 34 "Cherished forever.", index 42 "Quiet Grace", index 44 "Forever Yours" — same Pinyon Script style.
7. **Hover**: image scales to 1.04 over 1200ms ease-out inside an overflow-hidden figure.
8. **Framing**: `objectPosition` varies per cell via the getPosition(i) modulo-9 pattern (never default center for most cells) so faces are not cropped identically.
9. **Loading**: first 6 images `loading="eager"`, everything else lazy.
10. Fonts render as Cormorant Garamond (headlines/sublines) and Pinyon Script (all script text) — if the script font shows as generic cursive, the Google Fonts link in step 1 was not added.
