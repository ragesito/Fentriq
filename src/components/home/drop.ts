/**
 * The phone drawer's reveal: an upside-down water drop. Its tail stays on the
 * point the visitor tapped while the round head rises and swells until it
 * fills the screen; closing runs it backwards.
 */

const OPEN_MS = 680;
const CLOSE_MS = 460;
const CIRCLE = 0.5523; // Cubic handle length that draws a quarter circle.

export interface Point {
  x: number;
  y: number;
}

export interface Drop {
  play(target: 0 | 1, from?: Point | null, onDone?: () => void): void;
  stop(): void;
}

export function dropSupported(): boolean {
  return (
    typeof CSS !== "undefined" &&
    CSS.supports("clip-path", "path('M0 0L1 1Z')") &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);

function dropPath(p: number, w: number, h: number, o: Point): string {
  const e = ease(p);
  const r = Math.hypot(w, h) * 1.1 * e ** 1.6;
  const cx = o.x + (w / 2 - o.x) * Math.min(1, e * 1.5);
  const cy = o.y + (h / 2 - o.y) * Math.min(1, e * 1.6);
  // The tail sinks past the bottom edge at the end, so no corner stays uncovered.
  const tipY = o.y + h * 2 * e ** 4;
  const k = CIRCLE * r;
  const tail = (tipY - cy) * 0.35;
  const n = (v: number) => v.toFixed(1);
  return [
    `M${n(o.x)} ${n(tipY)}`,
    `C${n(o.x - r * 0.18)} ${n(tipY - tail)} ${n(cx - r)} ${n(cy + r * 0.9)} ${n(cx - r)} ${n(cy)}`,
    `C${n(cx - r)} ${n(cy - k)} ${n(cx - k)} ${n(cy - r)} ${n(cx)} ${n(cy - r)}`,
    `C${n(cx + k)} ${n(cy - r)} ${n(cx + r)} ${n(cy - k)} ${n(cx + r)} ${n(cy)}`,
    `C${n(cx + r)} ${n(cy + r * 0.9)} ${n(o.x + r * 0.18)} ${n(tipY - tail)} ${n(o.x)} ${n(tipY)}Z`,
  ].join("");
}

export function createDrop(el: HTMLElement): Drop {
  let progress = 0;
  let raf = 0;
  let origin: Point | null = null;

  const draw = () => {
    const w = el.clientWidth;
    const h = el.clientHeight;
    el.style.clipPath =
      progress >= 1 ? "" : `path("${dropPath(progress, w, h, origin ?? { x: w / 2, y: h })}")`;
  };

  const stop = () => cancelAnimationFrame(raf);

  return {
    stop,
    play(target, from, onDone) {
      stop();
      // A new origin only makes sense for a drop that hasn't started yet.
      if (progress === 0) origin = from ?? null;
      draw();
      if (progress === target) {
        onDone?.();
        return;
      }
      const duration = target === 1 ? OPEN_MS : CLOSE_MS;
      let last = performance.now();
      const step = (now: number) => {
        const delta = (now - last) / duration;
        last = now;
        progress = target === 1 ? Math.min(1, progress + delta) : Math.max(0, progress - delta);
        draw();
        if (progress === target) onDone?.();
        else raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    },
  };
}
