export function SkyMotion() {
  return (
    <svg
      className="erth-sky-motion"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="erth-meteor-tail" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="42%" stopColor="rgba(160,190,255,0.22)" />
          <stop offset="82%" stopColor="rgba(255,222,190,0.72)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.98)" />
        </linearGradient>
        <linearGradient id="erth-meteor-tail-cool" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="48%" stopColor="rgba(128,168,255,0.28)" />
          <stop offset="88%" stopColor="rgba(218,230,255,0.78)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.98)" />
        </linearGradient>
        <radialGradient id="erth-meteor-head">
          <stop offset="0%" stopColor="rgba(255,255,255,1)" />
          <stop offset="42%" stopColor="rgba(255,229,198,0.82)" />
          <stop offset="100%" stopColor="rgba(255,229,198,0)" />
        </radialGradient>
        <filter id="erth-meteor-bloom" x="-80%" y="-1200%" width="240%" height="2400%">
          <feGaussianBlur stdDeviation="2.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Cubic and quadratic paths give the streaks parabolic, perspective-like arcs. */}
        <path id="erth-comet-path-a" d="M -180 170 C 190 26 570 66 1380 318" />
        <path id="erth-comet-path-b" d="M -160 456 C 210 238 650 260 1330 560" />
        <path id="erth-fall-path-a" d="M 980 -140 Q 760 270 490 950" />
        <path id="erth-fall-path-b" d="M 360 -130 Q 285 220 120 920" />
      </defs>

      <g className="erth-meteor erth-meteor-comet">
        <animateMotion dur="18s" begin="-11s" repeatCount="indefinite" rotate="auto">
          <mpath href="#erth-comet-path-a" />
        </animateMotion>
        <line
          className="erth-meteor-tail erth-meteor-tail-long"
          x1="-178"
          x2="0"
          y1="0"
          y2="0"
          stroke="url(#erth-meteor-tail)"
          strokeLinecap="round"
          pathLength="1"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="1;0.18;0;0.64;1"
            keyTimes="0;0.24;0.44;0.78;1"
            dur="18s"
            begin="-11s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-width"
            values="0.4;1.8;2.6;1.4;0.4"
            keyTimes="0;0.25;0.48;0.78;1"
            dur="18s"
            begin="-11s"
            repeatCount="indefinite"
          />
        </line>
        <circle className="erth-meteor-head" cx="0" cy="0" r="1.8" fill="url(#erth-meteor-head)">
          <animate
            attributeName="r"
            values="0;2.2;3.8;2.4;0"
            keyTimes="0;0.24;0.48;0.78;1"
            dur="18s"
            begin="-11s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      <g className="erth-meteor erth-meteor-comet erth-meteor-soft">
        <animateMotion dur="26s" begin="-18s" repeatCount="indefinite" rotate="auto">
          <mpath href="#erth-comet-path-b" />
        </animateMotion>
        <line
          className="erth-meteor-tail"
          x1="-126"
          x2="0"
          y1="0"
          y2="0"
          stroke="url(#erth-meteor-tail-cool)"
          strokeLinecap="round"
          pathLength="1"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="1;0.32;0;0.72;1"
            keyTimes="0;0.28;0.48;0.82;1"
            dur="26s"
            begin="-18s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-width"
            values="0.3;1.2;2;1;0.3"
            keyTimes="0;0.28;0.5;0.82;1"
            dur="26s"
            begin="-18s"
            repeatCount="indefinite"
          />
        </line>
        <circle className="erth-meteor-head" cx="0" cy="0" r="1.4" fill="url(#erth-meteor-head)">
          <animate
            attributeName="r"
            values="0;1.8;2.8;1.6;0"
            keyTimes="0;0.28;0.5;0.82;1"
            dur="26s"
            begin="-18s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      <g className="erth-meteor erth-meteor-fall">
        <animateMotion dur="10s" begin="-5s" repeatCount="indefinite" rotate="auto">
          <mpath href="#erth-fall-path-a" />
        </animateMotion>
        <line
          className="erth-meteor-tail"
          x1="-92"
          x2="0"
          y1="0"
          y2="0"
          stroke="url(#erth-meteor-tail)"
          strokeLinecap="round"
          pathLength="1"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="1;0.1;0.2;1"
            keyTimes="0;0.3;0.62;1"
            dur="10s"
            begin="-5s"
            repeatCount="indefinite"
          />
        </line>
        <circle className="erth-meteor-head" cx="0" cy="0" r="1.6" fill="url(#erth-meteor-head)">
          <animate
            attributeName="r"
            values="0;2.4;1.6;0"
            keyTimes="0;0.32;0.66;1"
            dur="10s"
            begin="-5s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      <g className="erth-meteor erth-meteor-fall erth-meteor-soft">
        <animateMotion dur="13s" begin="-8s" repeatCount="indefinite" rotate="auto">
          <mpath href="#erth-fall-path-b" />
        </animateMotion>
        <line
          className="erth-meteor-tail"
          x1="-72"
          x2="0"
          y1="0"
          y2="0"
          stroke="url(#erth-meteor-tail-cool)"
          strokeLinecap="round"
          pathLength="1"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="1;0.18;0.36;1"
            keyTimes="0;0.32;0.68;1"
            dur="13s"
            begin="-8s"
            repeatCount="indefinite"
          />
        </line>
        <circle className="erth-meteor-head" cx="0" cy="0" r="1.2" fill="url(#erth-meteor-head)">
          <animate
            attributeName="r"
            values="0;1.8;1.2;0"
            keyTimes="0;0.32;0.68;1"
            dur="13s"
            begin="-8s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  );
}
