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
        <svg viewBox="6 24 86 60" width="220" height="154">
          {/* Same four facets as the logo, each opening on its own beat. */}
          <path className="intro-f1" d="M26 30 L56 30 L42 54 L12 54 Z" fill="#4F5BF7" />
          <path className="intro-f2" d="M56 30 L86 30 L72 54 L42 54 Z" fill="#AEB4C2" />
          <path className="intro-f3" d="M42 54 L72 54 L58 78 L28 78 Z" fill="#F4F6F8" />
          <path className="intro-f4" d="M58 78 L72 54 L86 54 L72 78 Z" fill="#8A6CFF" />
        </svg>
      </div>
    </div>
  );
}
