/**
 * The entrance: the brand mark unfolds and the screen opens along its seam.
 *
 * Built from the logo's own geometry — the four facets of the folded band —
 * so it could not belong to any other studio. The diagonal it opens along is
 * the same seam that separates sections further down the page (FoldDivider).
 *
 * It is deliberately server-rendered markup with a pure-CSS animation, so it
 * is painted with the very first frame instead of appearing after hydration.
 * Interaction is never blocked: the overlay is pointer-events:none from the
 * start, so a click during the intro lands on the page underneath. The page
 * itself renders below it, so this delays nothing but the looking.
 *
 * It runs once per session and not at all for prefers-reduced-motion — both
 * decided before paint by the inline script in the layout (`intro-done`).
 */
export function IntroFold() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-half intro-half-a" />
      <div className="intro-half intro-half-b" />
      <div className="intro-seam" />
      <div className="intro-mark">
        {/* Halo that blooms once the mark is whole; it lives inside the mark
            so it scales and fades away with it. */}
        <div className="intro-glow" />
        <svg viewBox="6 24 86 60" width="220" height="154">
          {/* The logo's four facets. The real mark cuts a 2-unit seam between
              blue|grey, grey|white and white|purple with a mask; since these
              facets fly in separately, that gap is baked into each outline
              instead (each facet gives up 1 unit along its seam edges), so the
              assembled mark matches the logo exactly, gaps included. */}
          <path className="intro-f1" d="M26 30 L54.85 30 L40.85 54 L12 54 Z" fill="#4F5BF7" />
          <path className="intro-f2" d="M57.16 30 L86 30 L72.58 53 L43.74 53 Z" fill="#AEB4C2" />
          <path className="intro-f3" d="M41.42 55 L70.26 55 L56.85 78 L28 78 Z" fill="#F4F6F8" />
          <path className="intro-f4" d="M73.16 54 L86 54 L72 78 L59.16 78 Z" fill="#8A6CFF" />
        </svg>
      </div>
    </div>
  );
}
