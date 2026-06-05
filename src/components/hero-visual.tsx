/**
 * Lightweight, calm hero visual — an inline SVG "map / globe" motif.
 * Decorative only (aria-hidden), so no LCP image attributes are needed.
 * Uses restrained brand accents over a near-black surface.
 */
export function HeroVisual({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      role="img"
      aria-label="Abstract map of connected places"
      className={className}
    >
      <defs>
        <radialGradient id="erth-glow" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="oklch(0.22 0.03 280)" />
          <stop offset="100%" stopColor="oklch(0.1 0.01 280)" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="190" r="150" fill="url(#erth-glow)" />
      <circle
        cx="200"
        cy="190"
        r="150"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="1"
      />

      {/* meridians / parallels */}
      <g
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="1"
      >
        <ellipse cx="200" cy="190" rx="150" ry="55" />
        <ellipse cx="200" cy="190" rx="150" ry="110" />
        <ellipse cx="200" cy="190" rx="55" ry="150" />
        <ellipse cx="200" cy="190" rx="110" ry="150" />
        <line x1="50" y1="190" x2="350" y2="190" />
        <line x1="200" y1="40" x2="200" y2="340" />
      </g>

      {/* connection routes */}
      <g fill="none" strokeWidth="1.5" strokeOpacity="0.5">
        <path d="M120 150 Q200 90 280 170" className="stroke-primary" />
        <path d="M150 250 Q230 300 300 220" className="stroke-accent" />
        <path
          d="M110 230 Q170 200 250 130"
          stroke="oklch(0.65 0.2 250)"
        />
      </g>

      {/* place markers */}
      <g>
        <circle cx="120" cy="150" r="4" className="fill-primary" />
        <circle cx="280" cy="170" r="4" className="fill-primary" />
        <circle cx="150" cy="250" r="4" className="fill-accent" />
        <circle cx="300" cy="220" r="4" className="fill-accent" />
        <circle cx="250" cy="130" r="4" fill="oklch(0.65 0.2 250)" />
        <circle cx="110" cy="230" r="4" fill="oklch(0.65 0.2 250)" />
      </g>
    </svg>
  );
}
