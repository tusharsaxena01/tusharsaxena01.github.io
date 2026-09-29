import { prefersReducedMotion } from "./motion";

// §4.5: split by grapheme cluster so matras and conjuncts (क्ष, कि, गढ़) never break.
const segmenter =
    typeof Intl !== "undefined" && "Segmenter" in Intl
        ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
        : null;
export const graphemes = (s: string) =>
    segmenter ? Array.from(segmenter.segment(s), (x) => x.segment) : Array.from(s);

export const isDeva = (s = "") => /[ऀ-ॿ]/.test(s);
export const devaDigits = (s: string) => s.replace(/\d/g, (d) => "०१२३४५६७८९"[+d]);

const LATIN = graphemes("!<>-_\\/[]{}—=+*^?#0123456789ABCDEF");
const DEVA = graphemes("अआइईउऊएऐओऔकखगघचछजझटठडढणतथदधनपफबभमयरलवशषसह०१२३४५६७८९");
const pick = (pool: string[]) => pool[(Math.random() * pool.length) | 0];

interface State { text: string; cancel?: () => void }
const states = new WeakMap<HTMLElement, State>();

export const isScrambling = (el: HTMLElement) => !!states.get(el)?.cancel;
export const currentText = (el: HTMLElement) => states.get(el)?.text ?? el.lastElementChild?.textContent ?? "";

interface Options {
    duration?: number;
    /** Fraction of characters that scramble (the rest stay put). 1 = all. */
    subset?: number;
    /** Called every frame with the visible string, to keep glitch `data-text` in sync. */
    onFrame?: (visible: string) => void;
}

/**
 * Decode `el` from its current text into `to`, left to right (§4.3).
 * Expects `el` to hold exactly two children: an sr-only span (final text) and an aria-hidden span (animated).
 */
export function scramble(el: HTMLElement, to: string, { duration = 900, subset = 1, onFrame }: Options = {}): Promise<void> {
    const sr = el.firstElementChild as HTMLElement;
    const vis = el.lastElementChild as HTMLElement;
    const st: State = states.get(el) ?? { text: vis.textContent ?? "" };
    states.set(el, st);
    st.cancel?.();
    sr.textContent = to;

    if (prefersReducedMotion()) {
        vis.textContent = st.text = to;
        onFrame?.(to);
        return Promise.resolve();
    }

    // Lock width to max(old, new) so neither script shifts layout mid-animation.
    const w0 = el.getBoundingClientRect().width;
    vis.textContent = to;
    const w1 = el.getBoundingClientRect().width;
    vis.textContent = st.text;
    el.style.minWidth = `${Math.max(w0, w1)}px`;
    el.classList.add("is-scrambling");

    const from = graphemes(st.text), target = graphemes(to);
    const frames = Math.max(2, Math.round(duration / 16.7));
    const n = Math.max(from.length, target.length);
    const queue = Array.from({ length: n }, (_, i) => {
        if (Math.random() > subset || /\s/.test(target[i] ?? "x")) return { start: 0, end: 0, dud: "" };
        const end = Math.floor((i / n) * frames * 0.7 + Math.random() * frames * 0.3);
        return { start: Math.floor(Math.random() * Math.min(end, frames * 0.4)), end, dud: "" };
    });

    return new Promise((resolve) => {
        let f = 0, raf = 0;
        const finish = () => {
            cancelAnimationFrame(raf);
            vis.textContent = st.text = to;
            st.cancel = undefined;
            el.style.minWidth = "";
            el.classList.remove("is-scrambling");
            onFrame?.(to);
            resolve();
        };
        st.cancel = finish;

        const tick = () => {
            const nodes: (string | HTMLElement)[] = [];
            let buf = "", done = true;
            queue.forEach((q, i) => {
                if (f >= q.end) { buf += target[i] ?? ""; return; }
                done = false;
                if (f < q.start) { buf += from[i] ?? ""; return; }
                if (!q.dud || Math.random() < 0.3) q.dud = pick(isDeva(target[i] ?? from[i]) ? DEVA : LATIN);
                if (buf) nodes.push(buf);
                buf = "";
                const s = document.createElement("span");
                s.className = "dud";
                s.textContent = q.dud;
                nodes.push(s);
            });
            if (done) return finish();
            if (buf) nodes.push(buf);
            vis.replaceChildren(...nodes);
            onFrame?.(vis.textContent ?? "");
            f++;
            raf = requestAnimationFrame(tick);
        };
        tick();
    });
}
