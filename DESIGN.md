# design.md — "ABHI//OS" Indian Techno-Noir Landing Page

## 0. Role and Goal

You are a senior creative front-end engineer who specializes in CSS/Canvas 2D motion design and multilingual (Latin + Devanagari) typography. Build a single-page, modern, terminal-styled marketing website that LOOKS like a Three.js showcase site (depth, rotating 3D objects, particle fields, parallax) but uses **zero Three.js and zero WebGL**.

Visual identity: **Indian techno-noir**. A cyber-terminal interface with corner-bracket frames, warmed up with saffron, marigold, ivory and vermilion, and layered with Indian craft motifs (mandala, jaali lattice, chakra, diya glow) and a bilingual English/Hindi voice. It MUST NOT read as "black screen with green text".

Deliver what is specified here. Do not add features, pages, auth, backend, or dependencies beyond this document.

---

## 1. Hard Constraints (MUST)

- **Stack:** plain HTML + CSS + vanilla JavaScript (ES2020). Single `index.html` with inline `<style>` and `<script>`, OR `index.html` + `style.css` + `main.js`. No build step.
- **Forbidden:** Three.js, WebGL, React/Vue, GSAP, jQuery, any animation library, any external image. All motifs are inline SVG or CSS. Fonts may load ONLY from Google Fonts: `Rajdhani` (Latin + Devanagari), `JetBrains Mono`, `Noto Sans Devanagari`, each with a system fallback stack.
- **3D illusion tools allowed:** CSS 3D transforms (`perspective`, `rotateX/Y/Z`, `preserve-3d`), Canvas 2D with manual 3D→2D projection math, SVG, CSS gradients, `mix-blend-mode`, `backdrop-filter`.
- **Theme:** dark only (warm midnight-indigo, never pure `#000`). No light mode, no theme toggle.
- **Performance:** 60 fps target on a mid-range laptop. Use `requestAnimationFrame`, one shared RAF loop where possible, `will-change` only on animated layers, cap canvas DPR at 2, pause animations when the tab is hidden (`visibilitychange`) and when a canvas is off-screen (`IntersectionObserver`).
- **Accessibility:** honor `prefers-reduced-motion: reduce` (disable glitch, rain, rotation, embers, flicker; show typewriter text instantly). All text is real DOM text. Body text contrast ≥ 4.5:1. Visible `:focus-visible` outline: 2px `--saffron` with 3px offset. Every Hindi element carries `lang="hi"`.
- **Responsive:** fluid from 360px to 1920px. Mobile: stack columns, halve particle counts, disable mouse-tilt and custom cursor.

---

## 2. Design Tokens and Color System

```css
:root {
  /* Surfaces: warm midnight indigo, NOT black */
  --bg-0: #0c0a12;
  --bg-1: #141020;
  --bg-2: #1d1730;
  --line: #2a2140;            /* jaali / grid lines */

  /* Text */
  --white: #ffffff;
  --ivory: #f6efe3;           /* headings, primary text */
  --text: #e9e0d0;            /* body */
  --text-dim: #a1978a;        /* captions, meta */

  /* Warm accents (dominant accent family) */
  --saffron: #ff9933;         /* primary accent, CTAs, hover state */
  --marigold: #ffc21a;        /* prompts, highlights, counters */
  --sindoor: #ff4d1c;         /* vermilion orange-red, warnings, hot spots */

  /* Cool / tech accents (minor) */
  --green: #22e07f;           /* corner brackets at rest, OK states */
  --green-deep: #138808;      /* tricolor stripe only */
  --rani: #ff2f92;            /* rani pink: glitch channel B */
  --chakra: #3a6bff;          /* chakra blue: rare highlights, links visited */

  --glitch-a: #ffb000;
  --glitch-b: #ff2f92;

  --glow-saffron: rgba(255,153,51,.40);
  --glow-green: rgba(34,224,127,.30);

  --font-display: "Rajdhani","Noto Sans Devanagari",system-ui,sans-serif;
  --font-mono: "JetBrains Mono","Fira Code",ui-monospace,Menlo,Consolas,monospace;
  --corner-len: 18px;
  --corner-w: 2px;
}
```

**Color proportions of the visible page (MUST hold):**
- ~60% deep indigo surfaces (`--bg-*`)
- ~20% ivory / white text and fine lines
- ~12% warm accents (saffron, marigold, sindoor)
- ~5% green (corner brackets, status dots, success)
- ~3% rani pink / chakra blue (glitch layers, rare highlights)

**Color roles:**
| Element | Color |
|---|---|
| Page/body text | `--text` (never green) |
| H1/H2 | `--white` / `--ivory`, with one emphasized word in a `--saffron`→`--marigold` gradient (`.hl`, `background-clip:text`) |
| Terminal prompts (`>`, `$`, `//`) and counters | `--marigold` |
| Corner brackets at rest | `--green`; on hover/focus → `--saffron` |
| Primary CTA | filled `--saffron` with `--bg-0` text, corner brackets `--marigold` |
| Secondary CTA | transparent, `--ivory` text, green corners |
| Meta labels, captions | `--text-dim` |
| Glitch layers | `--glitch-a` and `--glitch-b` only |
| Links | `--marigold`, hover `--saffron` |
| Errors / warnings | `--sindoor` |

**Background recipe (fixed, on `body`):**
```css
background:
  radial-gradient(60% 50% at 85% 0%,  rgba(255,153,51,.18), transparent 70%),
  radial-gradient(50% 40% at 0% 100%, rgba(255,47,146,.12), transparent 70%),
  radial-gradient(40% 30% at 50% 115%, rgba(34,224,127,.08), transparent 70%),
  linear-gradient(180deg, #0c0a12 0%, #120d1c 50%, #0c0a12 100%);
```
Alternate section backgrounds between `--bg-0` and `--bg-1` so the page has rhythm.

**Typography:** base 16px, line-height 1.6. Display/headings `--font-display` (Rajdhani), uppercase for Latin only, letter-spacing 0.04em for Latin only. Body and terminal text `--font-mono`. Type scale: H1 `clamp(2.5rem, 7vw, 6rem)`, H2 `clamp(1.75rem, 4vw, 3rem)`, body 1rem, meta 0.75rem uppercase with 0.12em tracking (Latin only).

---

## 3. Signature Component: Corner-Only Borders

Every card, panel, button, input, and the hero frame uses a border that shows **only the four corners** (L-shaped brackets). There is never a full outline.

```css
.frame {
  position: relative;
  padding: 1.5rem;
  --c: var(--green);
  --c1: var(--c); --c2: var(--c); --c3: var(--c); --c4: var(--c); /* per-corner override */
  background-color: var(--bg-1);
  background-image:
    linear-gradient(var(--c1), var(--c1)), linear-gradient(var(--c1), var(--c1)), /* top-left  */
    linear-gradient(var(--c2), var(--c2)), linear-gradient(var(--c2), var(--c2)), /* top-right */
    linear-gradient(var(--c3), var(--c3)), linear-gradient(var(--c3), var(--c3)), /* bottom-left */
    linear-gradient(var(--c4), var(--c4)), linear-gradient(var(--c4), var(--c4)); /* bottom-right */
  background-repeat: no-repeat;
  background-size:
    var(--corner-len) var(--corner-w), var(--corner-w) var(--corner-len),
    var(--corner-len) var(--corner-w), var(--corner-w) var(--corner-len),
    var(--corner-len) var(--corner-w), var(--corner-w) var(--corner-len),
    var(--corner-len) var(--corner-w), var(--corner-w) var(--corner-len);
  background-position: 0 0, 0 0, 100% 0, 100% 0, 0 100%, 0 100%, 100% 100%, 100% 100%;
}
.frame:hover, .frame:focus-within {
  --c: var(--saffron);
  --corner-len: 26px;                 /* corners "expand" */
  filter: drop-shadow(0 0 10px var(--glow-saffron));
}
.frame--hero { --c1: var(--saffron); --c2: var(--saffron); --c3: var(--green); --c4: var(--green); }
```

Rules:
- Register `--corner-len` and the corner colors with `@property` so transitions animate, with a plain fallback if unsupported.
- The hero frame has 4px square "nodes" at each corner in `--white`.
- A small metadata label (e.g. `[ SYS.०१ ]`) may sit on a top edge in `--text-dim` with a `--bg-0` background to "cut" the space. Do NOT draw a line across any edge.

---

## 4. Signature Text Effects

All three effects MUST work for both Latin and Devanagari text (see §4.5).

### 4.1 Glitch (CSS only, no JS required)
Apply to H1, section H2s, nav logo, and any `.glitch`. Markup: `<h1 class="glitch" data-text="SAME TEXT">SAME TEXT</h1>`.

- Two pseudo-elements (`::before`, `::after`) render `attr(data-text)`, offset ±2px, colored `--glitch-a` (marigold) and `--glitch-b` (rani pink), blended with `mix-blend-mode: screen`.
- Animate each with `clip-path: inset(...)` keyframes that jump between random horizontal slices, plus small `translateX` jitter and occasional `skewX`.
- Cycle: 3.5s loop, idle (subtle) ~80% of the time, burst ~300ms. Stronger continuous glitch on `:hover`.
- Glitch layers MUST always mirror the element's current text: whenever scramble (§4.3) changes the text, update `data-text` in the same frame.
- Base text stays `--ivory`/`--white`; only the offset layers are colored.

### 4.2 Typewriter (JS)
- Reusable `typewriter(el, text, {speed: 28, jitter: 18, startDelay})`. Randomized delay per character (speed ± jitter ms). **Iterate by grapheme cluster** (§4.5), never by UTF-16 code unit.
- Blinking block cursor `▋` in `--saffron` (`animation: blink 1s steps(2) infinite`); stays after typing on hero elements, disappears on the rest.
- Trigger: hero subtitle starts on load; every other typewriter element starts once when it enters the viewport (`IntersectionObserver`, threshold 0.4).
- Hero subtitle cycles through 4 phrases (type → hold 1.8s → delete faster → next):
  1. `> namaste, operator. system chalu ho raha hai...`
  2. `> jugaad meets engineering. built to scale.`
  3. `> कोड लिखो, भविष्य बनाओ`
  4. `> sab set hai. shuru karein?`
- Prompt prefixes (`>`, `$`, `//`) in `--marigold`; typed text in `--text`.
- No layout shift while typing: reserve height with a hidden full-text copy (`visibility:hidden`) or `min-height`.

### 4.3 Text Scramble / Decode (JS)
Characters resolve from random symbols into the real text, left to right.

- Reusable `scramble(el, newText, {duration: 900})` using a single `requestAnimationFrame` loop (no `setInterval`).
- Latin pool: `!<>-_\/[]{}—=+*^?#0123456789ABCDEF`. Devanagari pool (used when the target cluster is Devanagari): `अआइईउऊएऐओऔकखगघचछजझटठडढणतथदधनपफबभमयरलवशषसह०१२३४५६७८९`.
- Algorithm: split into grapheme clusters; for each index `i` precompute random `start` and `end` frames (`end` grows with `i`). Before `start`: old character. Between: random pool character (re-randomized ~30% of frames). After `end`: final character. Spaces and newlines are never scrambled.
- Unresolved characters are wrapped in `<span class="dud">` colored `--saffron` at 65% opacity; resolved characters use the normal text color. Build with DOM nodes/`textContent`, never `innerHTML` with dynamic text.
- Set `aria-label` to the final text and `aria-hidden="true"` on animated inner spans.
- Prevent width shift: before animating, measure and set `min-width` on the element to the larger of old/new rendered widths; release after finishing. (Devanagari is proportional, so this is required for it.)
- Triggers (implement all):
  1. **Scroll-in:** every `[data-scramble]` heading and nav link decodes once on entering the viewport (threshold 0.4).
  2. **Hover:** nav links, card titles, and buttons re-scramble their own text (600ms) on `pointerenter`; ignore while already running.
  3. **Idle loop on the H1:** every 4–7s (random), scramble 30–50% of characters for ~250ms, then restore. Skip while hovered.
  4. **Phrase morph:** the hero status tag cycles `SYSTEM ONLINE` → `NEURAL LINK ACTIVE` → `सिस्टम चालू है` → `AWAITING INPUT` every 3.5s (pad shorter strings with spaces; switch `lang` attribute per phrase).
  5. **Section labels:** `[ ०१ ]`-style indices and `[ SYS.०१ ]` frame labels decode on scroll-in.
  6. **Language toggle:** switching EN ↔ हिं (§6.4) morphs every translated element with `scramble()`.
- While scrambling, add `.is-scrambling` to raise glitch offset to ±3px.
- Under `prefers-reduced-motion: reduce`, `scramble()` sets the final text instantly.

### 4.4 Combined use
- H1: typewriter → permanent glitch class → idle scramble loop.
- Typewriter for long copy and terminal lines; scramble for short labels, headings, nav, status text. Never both on the same element at the same time.

### 4.5 Devanagari Rules (MUST)
- Segment text with `Intl.Segmenter(undefined, {granularity: "grapheme"})`; fall back to `Array.from(text)` if unavailable. Never split with `.split("")`, or matras and conjuncts (e.g. `क्ष`, `ह्न`, `कि`) will break.
- For `:lang(hi)`: `letter-spacing: 0; text-transform: none; font-variant-ligatures: normal; line-height: 1.7; font-family: var(--font-display)`. Do NOT apply `font-variant-ligatures: none` or letter-spacing to Devanagari; it breaks the headline bar (shirorekha) and conjuncts.
- Devanagari at display sizes uses weight 600–700 and is at least 1.1× the Latin size beside it, so both scripts look optically equal.
- Glitch pseudo-elements copy `data-text` and inherit the same font, so they align with the base text.

---

## 5. "Three.js-Looking" Effects Without Three.js

Implement ALL of the following. Each must be self-contained and disabled under reduced motion.

1. **Hero 3D wireframe object (CSS 3D).** A rotating cube built from `div` faces with `preserve-3d`, faces filled with `rgba(255,153,51,.05)`, 1px `--saffron` edges, and a smaller counter-rotating inner cube with `--marigold` edges. 20s linear infinite rotation. Pointer parallax tilt (±15°) through CSS variables lerped in RAF.
2. **Projected 3D point-cloud sphere (Canvas 2D).** ~600 Fibonacci-distributed points. Each frame: rotate Y and X, project with `scale = fov / (fov + z)`. Depth coloring: near points `--white`, mid `--marigold`, far `--saffron` at low alpha; size and alpha scale with depth. Connect ~3 nearest neighbors per point with `--green` lines at 12–18% alpha (precompute neighbors once). Pointer adds rotational velocity with damping.
3. **Perspective grid floor + "surya" sun.** A large element with a repeating grid in `rgba(255,153,51,.25)`, `transform: perspective(600px) rotateX(70deg)`, animating `background-position-y` for endless forward motion, faded into the horizon with a `mask-image` gradient. At the horizon sits a half-sun disc (radial gradient `--marigold` → `--sindoor`, cut by horizontal stripe mask, ~30% opacity) with a soft warm glow. Behind the hero.
4. **Devanagari code rain (Canvas 2D).** Faint (alpha ≤ 0.15) falling Devanagari letters, numerals `०–९`, and hex characters in `--saffron`; the head character is `--ivory`. 1 in 6 columns uses `--green` instead. Fixed full-page background. Column speeds vary. Runs at 30 fps.
5. **Rising embers / gulal dust.** 60–100 tiny particles on a fixed canvas in `--marigold`, `--saffron`, `--white` (about 8% `--rani`), drifting upward with slight sinusoidal sway and twinkle, 3 depth layers with different scroll-parallax rates.
6. **Scroll-driven 3D reveal.** Each `.frame` section enters from `perspective(1000px) rotateX(12deg) translateY(40px)`, opacity 0 → 1, via `IntersectionObserver`; stagger children by 80ms.
7. **Card 3D tilt.** Feature cards tilt toward the pointer (max ±8°) with a radial `rgba(255,153,51,.14)` highlight following the cursor (CSS vars `--mx`, `--my`).
8. **CRT overlay.** Fixed full-screen pseudo-element: subtle dark scanlines (3px period, 6% opacity), a warm vignette, and a slow (8s) vertical scan bar in `rgba(255,153,51,.05)`. `pointer-events: none`.
9. **Custom cursor.** 12px crosshair drawn as corner brackets in `--ivory` that turn `--saffron` and expand over interactive elements; lerp-follow. Native cursor hidden ONLY on `(pointer: fine)`.
10. **Boot sequence loader.** Fullscreen terminal boot log (8–10 lines typed fast), then a progress bar built from `█` blocks in three consecutive color bands (`--saffron`, `--white`, `--green-deep`; abstract stripe only, not a flag replica), and a rotating 24-spoke chakra spinner (§6.1, motif 2). Then a glitch-wipe (clip-path slices) reveals the page. ≤ 2.5s, skippable by click/keypress. Log lines:
    - `[ OK ] loading kernel`
    - `[ OK ] mounting /dev/gpu`
    - `[ OK ] loading 22 language packs`
    - `[ OK ] namaste, operator`
    - `[ OK ] सिस्टम चालू है`
11. **Rotating mandala (SVG + CSS).** A large layered mandala behind the hero (see §6.1, motif 1), rotating slowly with a counter-rotating second ring.

---

## 6. Indian Accent Layer

### 6.1 Motifs (all inline SVG or CSS, no external images)
1. **Mandala:** 24-petal concentric rings built by rotating one `<path>`/`<use>` petal; strokes `--saffron` at 12–18% opacity, 60s rotation; second ring `--marigold` counter-rotating at 90s. Sits behind the hero object; a smaller static version decorates the footer.
2. **Ashoka-chakra-inspired wheel:** 24 spokes, thin ring, stroke `--marigold`. Used as the loader spinner and as a slow-rotating ring around the hero sphere. Abstract only: no filled blue disc, never distorted or placed on text.
3. **Jaali lattice:** a repeating geometric lattice tile as an inline SVG data-URI or CSS gradient pattern, `--ivory` at 4–6% opacity, used as the texture on alternate sections and inside cards.
4. **Lotus/paisley divider:** between sections, a 1px dashed `--line` rule with a small lotus or paisley (buta) SVG in `--marigold` at the center.
5. **Diya glow:** the primary CTA has a warm radial glow behind it that flickers irregularly (`steps()` keyframes, opacity 0.7–1, 2.4s), in `--saffron`/`--marigold`.
6. **Tricolor hairline:** a 3px stripe (`--saffron` / `--white` / `--green-deep`, equal thirds) at the very top of the nav and above the footer. Abstract accent only.

### 6.2 Numerals and labels
Section indices and frame labels use Devanagari numerals: `[ ०१ ]`, `[ ०२ ]`, … Data counters keep Western digits for legibility.

### 6.3 Copy Voice (Indian English + Hinglish)
- Warm, confident, slightly playful Indian-English voice; contractions are fine; sentences are short.
- Sprinkle Hindi/Hinglish (Roman script) and Devanagari sparingly: at most 1–2 phrases per section, always understandable in context. Suggested vocabulary: `namaste`, `chalu`, `shuru karein`, `sab set hai`, `jugaad`, `ekdum solid`, `bilkul`, `chalo`.
- Respectful, never caricature: no exaggerated accent spelling, no stereotype jokes, no clichés about food, snakes, or call centers.
- Placeholder brand facts are clearly fictional but plausible (e.g. `22 LANGUAGES`, `1.4B+ REACH`, `99.99% UPTIME`, `24/7 SUPPORT`).
- Provide correct, natural standard Hindi. Keep Hindi lines short and simple. In the final report, flag that a native speaker should proofread all Hindi.

### 6.4 Language Toggle (EN | हिं)
- Nav control `[ EN | हिं ]` in corner-bracket style. Elements with `data-en` and `data-hi` attributes swap text using `scramble()`, and the element's `lang` attribute is set to `en` or `hi`. State lives in memory only (no browser storage).
- Provide `data-hi` for at least: nav links, the H1, hero subtitle, both CTAs, and all section titles. Required strings:
  - H1: `BUILD THE FUTURE IN DEPTH` ↔ `भविष्य गढ़ो, गहराई से`
  - Primary CTA: `> get_started` ↔ `> शुरू करें`
  - Secondary CTA: `$ view_docs` ↔ `$ दस्तावेज़ देखें`
  - Contact submit: `[ TRANSMIT ]` ↔ `[ भेजें ]`
- Hero also always shows a small Devanagari "ghost" line beneath the H1 (`भविष्य बनाओ`) in `--saffron` at 60% opacity with the glitch effect.

---

## 7. Page Structure

Tricolor hairline + sticky nav + 5 sections + footer. Sections use `.frame` containers, max-width 1200px, 96px vertical rhythm, lotus/paisley divider between sections.

1. **Nav** — logo `YANTRA//OS` (glitch), links `./about`, `./features`, `./stack`, `./contact` (each with `data-scramble`), language toggle, and a `[ LAUNCH ]` button. Background `rgba(12,10,18,.75)` with `backdrop-filter: blur(8px)`. Mobile: hamburger opens a fullscreen terminal-style menu.
2. **Hero** — left: status tag `● SYSTEM ONLINE` (pulsing `--green` dot, text `--ivory`), glitch H1 "BUILD THE FUTURE IN DEPTH" with "FUTURE" as `.hl`, Devanagari ghost line, cycling typewriter subtitle, two CTAs. Right: CSS 3D cube inside the point-cloud sphere, chakra ring around it, mandala behind. Perspective grid floor and surya sun behind everything. Uses `.frame--hero`.
3. **About / Manifesto** — left: typewriter paragraph (3–4 lines, Indian-English voice); right: a "terminal window" `.frame` typing a fake session line by line (`$ whoami`, `$ cat mission.txt`, `$ echo "namaste, duniya"`).
4. **Features** — 6 cards in a responsive grid, each with `[ ०१ ]` index, a line icon in `--saffron`/`--marigold`, a title that glitches/scrambles on hover, and a 2-line description. Jaali texture inside. 3D tilt + corner expansion.
5. **Stats / Telemetry** — 4 counters (`22` languages, `1.4B+` reach, `99.99%` uptime, `24/7` support) counting up on scroll-in (1.2s ease-out) in `--marigold`, each beside a small animated SVG sparkline or `█` bar.
6. **Contact / CTA** — terminal form (`> enter_email:` with blinking saffron caret), `[ TRANSMIT ]` button with diya glow. On submit show typewriter success `> transmission received. dhanyavaad!` in `--green` (client-side only, no network request).
7. **Footer** — tricolor hairline, static mandala, one line of `--text-dim` meta text, ASCII divider, fake uptime counter ticking every second.

All copy MUST be coherent techie marketing copy (no lorem ipsum).

---

## 8. Motion Rules

- Easing: `cubic-bezier(.2,.8,.2,1)` for reveals; `steps()` for glitch, cursor, and diya flicker.
- Durations: hover 200ms, reveals 600ms, loader ≤ 2.5s.
- At most 3 simultaneously active heavy canvases (code rain, sphere, embers). Code rain at 30 fps.
- Never animate `width/height/top/left`; use `transform` and `opacity` (except grid floor `background-position`).

---

## 9. Scope Locks and Stop Conditions

- Only create `index.html` (and optionally `style.css`, `main.js`). Do not create other files, install packages, or touch anything outside the project folder.
- Do not add a dark/light toggle, routing, analytics, cookie banners, sound, or browser storage.
- STOP and ask before: adding any dependency, using any external asset other than the listed Google Fonts, or changing the palette in §2.

---

## 10. Acceptance Criteria (binary, all must pass)

1. Page opens from disk (`file://`) with no console errors and no network requests other than Google Fonts.
2. No occurrence of `three`, `THREE`, `WebGLRenderingContext`, or `getContext("webgl")` in the source.
3. No element shows a full rectangular border; all frames are corner-only brackets (green at rest, saffron on hover).
4. **Palette:** no pure `#000` backgrounds; body text is ivory/cream, not green; saffron/marigold/orange/white together visibly outweigh green in a full-page screenshot; green appears only in brackets, status dots, faint lines, and success states.
5. H1 types in, then glitches periodically; glitch also fires on hover for the nav logo and card titles, using marigold and rani-pink offset layers.
6. Hero subtitle cycles through all 4 phrases (including the Devanagari one) with a visible blinking saffron cursor.
7. Scramble works for all 6 triggers in §4.3, resolves left to right, causes no width shift, keeps glitch layers in sync, and never exposes random characters to screen readers.
8. **Devanagari integrity:** in typewriter, scramble, and glitch, conjuncts and matras stay intact (e.g. `क्ष`, `कि`, `गढ़`) and the shirorekha is unbroken; no `letter-spacing` is applied to Hindi text.
9. Language toggle swaps all `data-en`/`data-hi` elements and updates `lang` attributes.
10. All 6 motifs in §6.1 are present and visible but subtle; the tricolor hairline appears at nav top and above the footer.
11. Cube rotates, sphere reacts to the pointer, grid floor scrolls with the surya sun at the horizon, Devanagari rain and embers are visible but subtle.
12. Feature cards tilt in 3D on hover and their corners expand and turn saffron.
13. With `prefers-reduced-motion: reduce`, no glitch, rain, rotation, embers, flicker, or typing animation runs, and all text is immediately readable.
14. No horizontal scroll at 360px, 768px, and 1440px widths.
15. Lighthouse Performance ≥ 85 on desktop.

## 11. Final Report Format

After building, output: `✅` one line per section built, the list of files created, a note that Hindi copy needs native-speaker proofreading, and any acceptance criterion you could not verify (state which and why). Do not claim a criterion passed unless you actually checked it.
