# design.md — "TERMINAL//NEXUS" Techie Dark Landing Page

## 0. Role and Goal

You are a senior creative front-end engineer who specializes in CSS/Canvas 2D motion design. Build a single-page, modern, cyber-terminal-styled marketing website that LOOKS like a Three.js showcase site (depth, rotating 3D objects, particle fields, parallax) but uses **zero Three.js and zero WebGL**.

Deliver what is specified here. Do not add features, pages, auth, backend, or dependencies beyond this document.

---

## 1. Hard Constraints (MUST)

- **Stack:** plain HTML + CSS + vanilla JavaScript (ES2020). Single `index.html` with inline `<style>` and `<script>`, OR `index.html` + `style.css` + `main.js`. No build step.
- **Forbidden:** Three.js, WebGL, React/Vue, GSAP, jQuery, any animation library, any external image. Fonts may load from Google Fonts with a monospace fallback stack.
- **3D illusion tools allowed:** CSS 3D transforms (`perspective`, `rotateX/Y/Z`, `preserve-3d`), Canvas 2D with manual 3D→2D projection math, SVG, CSS gradients, `mix-blend-mode`, `backdrop-filter`.
- **Theme:** dark only. No light mode, no theme toggle.
- **Performance:** 60 fps target on a mid-range laptop. Use `requestAnimationFrame`, one shared RAF loop where possible, `will-change` only on animated layers, cap canvas DPR at 2, pause animations when the tab is hidden (`visibilitychange`) and when a canvas is off-screen (`IntersectionObserver`).
- **Accessibility:** honor `prefers-reduced-motion: reduce` (disable glitch, rain, rotation; show typewriter text instantly). All text must be real DOM text (readable by screen readers). Body text contrast ≥ 4.5:1. Visible `:focus-visible` outline in accent green.
- **Responsive:** fluid from 360px to 1920px. Mobile: stack columns, reduce particle counts by 50%, disable mouse-tilt.

---

## 2. Design Tokens

```css
:root {
  --bg-0: #05070a;          /* page background */
  --bg-1: #0a0f14;          /* panels */
  --bg-2: #0f1720;          /* raised panels */
  --line: #14202b;          /* faint grid lines */
  --green: #00ff9c;         /* primary accent */
  --green-dim: #00b36e;     /* secondary accent, corners at rest */
  --green-glow: rgba(0,255,156,.35);
  --cyan: #00e5ff;          /* glitch channel A */
  --magenta: #ff2bd6;       /* glitch channel B */
  --text: #cfe8dc;          /* body text */
  --text-dim: #6f8a7e;      /* captions, meta */
  --font-mono: "JetBrains Mono","Fira Code","IBM Plex Mono",ui-monospace,Menlo,Consolas,monospace;
  --font-display: "Space Grotesk","JetBrains Mono",ui-monospace,monospace;
  --corner-len: 18px;       /* length of each corner bracket arm */
  --corner-w: 2px;          /* thickness of bracket */
}
```

- Base font-size 16px, line-height 1.6. Headings use `--font-display`, uppercase, letter-spacing 0.04em. Everything else uses `--font-mono`.
- Type scale: H1 `clamp(2.5rem, 7vw, 6rem)`, H2 `clamp(1.75rem, 4vw, 3rem)`, body 1rem, meta 0.75rem uppercase with 0.12em tracking.
- Green is the ONLY accent for UI chrome. Cyan and magenta appear ONLY inside glitch effects.

---

## 3. Signature Component: Corner-Only Green Borders

Every card, panel, button, input, and the hero frame uses a border that shows **only the four corners** (L-shaped brackets). There is never a full outline.

Implement as a reusable `.frame` class using background gradients (no extra DOM):

```css
.frame {
  position: relative;
  padding: 1.5rem;
  background: var(--bg-1);
  --c: var(--green-dim);
  background-image:
    linear-gradient(var(--c), var(--c)), linear-gradient(var(--c), var(--c)), /* top-left  */
    linear-gradient(var(--c), var(--c)), linear-gradient(var(--c), var(--c)), /* top-right */
    linear-gradient(var(--c), var(--c)), linear-gradient(var(--c), var(--c)), /* bottom-left */
    linear-gradient(var(--c), var(--c)), linear-gradient(var(--c), var(--c)); /* bottom-right */
  background-repeat: no-repeat;
  background-size:
    var(--corner-len) var(--corner-w), var(--corner-w) var(--corner-len),
    var(--corner-len) var(--corner-w), var(--corner-w) var(--corner-len),
    var(--corner-len) var(--corner-w), var(--corner-w) var(--corner-len),
    var(--corner-len) var(--corner-w), var(--corner-w) var(--corner-len);
  background-position:
    0 0, 0 0,
    100% 0, 100% 0,
    0 100%, 0 100%,
    100% 100%, 100% 100%;
  background-color: var(--bg-1);
  transition: --c .2s, filter .2s;
}
.frame:hover, .frame:focus-within {
  --c: var(--green);
  filter: drop-shadow(0 0 8px var(--green-glow));
  --corner-len: 26px;   /* corners "expand" on hover */
}
```

Rules:
- Bracket color at rest: `--green-dim`; on hover/focus: `--green` with glow and longer arms (animate `--corner-len` via `@property` registered as `<length>`, with a plain fallback).
- Optional 4px green "node" squares at each corner on the hero frame only.
- Small metadata label (e.g., `[ SYS.01 ]`) may sit on the top edge in 0.75rem `--text-dim`, with a `--bg-0` background to "cut" the space; do NOT draw a line across the edge.

---

## 4. Signature Text Effects

### 4.1 Glitch (CSS only, no JS required)
Apply to H1, section H2s, nav logo, and any element with `.glitch`. Markup: `<h1 class="glitch" data-text="SAME TEXT">SAME TEXT</h1>`.

- Two pseudo-elements (`::before`, `::after`) render `attr(data-text)`, offset ±2px, colored `--cyan` and `--magenta`, blended with `mix-blend-mode: screen`.
- Animate each with `clip-path: inset(...)` keyframes that jump between random horizontal slices, plus small `translateX` jitter and occasional `skewX`.
- Cycle: 3.5s loop where the glitch is idle (subtle) for ~80% of the time and bursts for ~300ms. Add a stronger continuous glitch on `:hover`.
- Optional: a JS "scramble" that briefly replaces random characters with `!<>-_\/[]{}—=+*^?#` for 200ms at random 4–7s intervals, then restores the original text. `data-text` must be updated in sync.

### 4.2 Typewriter (JS)
- Reusable `typewriter(el, text, {speed: 28, jitter: 18, startDelay})`. Each character has randomized delay (speed ± jitter ms).
- Blinking block cursor `▋` in `--green` (`animation: blink 1s steps(2) infinite`), which stays after typing finishes on hero elements and disappears on the rest.
- Trigger: hero subtitle starts on load; every other typewriter element starts once when it enters the viewport (`IntersectionObserver`, threshold 0.4).
- Hero subtitle cycles through 4 phrases (type → hold 1.8s → delete faster → next), e.g.:
  1. `> initializing neural interface...`
  2. `> building the web, one pixel at a time`
  3. `> zero dependencies. infinite depth.`
  4. `> welcome, operator.`
- Prefix terminal prompts (`>`, `$`, `//`) in `--green`.
- Layout must not shift while typing: reserve height with a hidden full-text copy (`visibility:hidden`) or `min-height`.

### 4.3 Combined use
H1 first types in (typewriter), then permanently gets the glitch class after typing completes.

---

## 5. "Three.js-Looking" Effects Without Three.js

Implement ALL of the following. Each must be self-contained and toggled off under reduced motion.

1. **Hero 3D wireframe object (CSS 3D).** A rotating cube (or icosahedron approximated with nested cubes) built from `div` faces with `preserve-3d`, transparent faces, 1px green borders, and a smaller counter-rotating inner cube. Continuous `rotateX/rotateY` keyframes (20s linear infinite). Mouse movement adds parallax tilt (±15°) by updating CSS variables via `pointermove` (lerped in RAF, not set directly).
2. **Projected 3D point-cloud sphere (Canvas 2D).** ~600 points on a sphere (Fibonacci distribution). Each frame: rotate around Y and X by small angles, project with `scale = fov / (fov + z)`, draw dots whose size and alpha depend on depth. Connect near neighbors with faint green lines (limit to nearest ~3 per point, precompute neighbors once). Sphere responds to pointer by adding rotational velocity with damping.
3. **Perspective grid floor.** CSS: a large element with a repeating linear-gradient grid, `transform: perspective(600px) rotateX(70deg)`, animating `background-position-y` to create endless forward motion. Fades into the horizon with a mask-image gradient. Sits behind the hero.
4. **Matrix-style code rain (Canvas 2D).** Faint (opacity ≤ 0.15) falling katakana/hex characters in `--green-dim` as a full-page fixed background layer. Column speed varies; head character brighter.
5. **Floating depth particles.** 60–100 tiny dots on a fixed canvas layer with 3 depth layers moving at different scroll-parallax rates (`translateY` tied to `scrollY * depth`), giving a starfield/dust feel.
6. **Scroll-driven 3D reveal.** Each `.frame` section enters with `transform: perspective(1000px) rotateX(12deg) translateY(40px)` → `none`, opacity 0 → 1, triggered via `IntersectionObserver`; stagger children by 80ms.
7. **Card 3D tilt.** Feature cards tilt toward the pointer (max ±8°) with a radial green highlight following the cursor (`radial-gradient` at CSS vars `--mx`, `--my`).
8. **CRT overlay.** Fixed full-screen pseudo-element with subtle scanlines (`repeating-linear-gradient`, 3px period, 6% opacity), a soft vignette, and a very slow (8s) horizontal "scan bar" sweeping vertically. `pointer-events: none`, `z-index` above content but below the custom cursor.
9. **Custom cursor.** Small green crosshair (12px, corner-bracket style, matching §3) that follows the pointer with lerp easing and expands over interactive elements. Native cursor hidden ONLY on devices with `(pointer: fine)`.
10. **Boot sequence loader.** On first load show a fullscreen terminal boot log (8–10 lines typed quickly, e.g. `[ OK ] loading kernel`, `[ OK ] mounting /dev/gpu`), a green progress bar built from `█` blocks, then a glitch-wipe transition (clip-path slices) to reveal the page. Total ≤ 2.5s. Skippable by click/keypress.

---

## 6. Page Structure

Sticky top nav + 5 sections + footer. All sections use `.frame` containers, max-width 1200px, 96px vertical rhythm.

1. **Nav** — logo `NEXUS//OS` (glitch), links (`about`, `features`, `stack`, `contact`) prefixed with `./`, and a `[ LAUNCH ]` button (corner-bracket style). Background `rgba(5,7,10,.7)` with `backdrop-filter: blur(8px)`. Mobile: hamburger becomes a fullscreen terminal-style menu.
2. **Hero** — left: status tag `● SYSTEM ONLINE` (pulsing green dot), glitch H1 ("BUILD THE FUTURE IN DEPTH"), typewriter cycling subtitle, two CTA buttons (`> get_started`, `$ view_docs`). Right: the CSS 3D cube above the point-cloud sphere canvas (cube inside sphere, centered). Perspective grid floor behind.
3. **About / Manifesto** — split layout; left a typewriter paragraph (3–4 lines), right a "terminal window" `.frame` showing a fake command session typed line by line (`$ whoami`, `$ cat mission.txt`, ...).
4. **Features** — 3 to 6 cards in a responsive grid, each with a `[ 01 ]` index, an inline-SVG line icon in green, title (glitch on hover), 2-line description. 3D tilt + corner expansion on hover.
5. **Stats / Telemetry** — 4 counters that count up (0→target, 1.2s ease-out, formatted with monospace padding) when scrolled into view; each beside a tiny animated SVG sparkline or bar made of `█` blocks.
6. **Contact / CTA** — a terminal-styled form (`> enter_email:` with blinking caret), submit button `[ TRANSMIT ]`. On submit show a typewriter success line `> transmission received. stand by.` (client-side only, no network request).
7. **Footer** — one line of `--text-dim` meta text, small ASCII divider, fake uptime counter ticking every second.

Copy is placeholder but MUST read as coherent techie marketing copy (no lorem ipsum).

---

## 7. Motion Rules

- Easing: `cubic-bezier(.2,.8,.2,1)` for reveals; `steps()` for glitch/cursor.
- Durations: hover 200ms, reveals 600ms, page loader ≤ 2.5s.
- No more than 3 simultaneously active heavy canvases (code rain, sphere, particles). Code rain drops to 30 fps.
- Never animate `width/height/top/left`; use `transform` and `opacity` only (except the grid floor `background-position`).

---

## 8. Scope Locks and Stop Conditions

- Only create `index.html` (and optionally `style.css`, `main.js`). Do not create other files, install packages, or touch anything outside the project folder.
- Do not add dark/light toggle, routing, analytics, cookie banners, or sound.
- STOP and ask before: adding any dependency, using any external asset other than Google Fonts, or changing the palette in §2.

---

## 9. Acceptance Criteria (binary, all must pass)

1. Page opens from disk (`file://`) with no console errors and no network requests other than Google Fonts.
2. No occurrence of `three`, `THREE`, `WebGLRenderingContext`, or `getContext("webgl")` in the source.
3. No element anywhere shows a full rectangular green border; all green borders are corner-only brackets.
4. H1 types in, then glitches periodically; glitch also fires on hover for nav logo and card titles.
5. Hero subtitle cycles through all 4 phrases with a visible blinking cursor.
6. The cube rotates, the sphere point-cloud rotates and reacts to the pointer, grid floor scrolls, code rain and scanlines are visible but subtle.
7. Feature cards tilt in 3D on hover and their corner brackets expand.
8. With `prefers-reduced-motion: reduce` enabled, no glitch, rain, rotation, or typing animation runs and all text is immediately readable.
9. Layout has no horizontal scroll at 360px, 768px, and 1440px widths.
10. Lighthouse Performance ≥ 85 on desktop.

## 10. Final Report Format

After building, output: `✅` one line per section built, the list of files created, and any acceptance criterion you could not verify (state which and why). Do not claim a criterion passed unless you actually checked it.
