import React from "react";

type DisplayLogoProps = {
  className?: string;
};

const PIXEL = 8;
const GAP = 1;

const rows = {
  DJ: [
    "11110 101",
    "00010 101",
    "11110 101",
    "10000 101",
    "11110 011",
  ],
  SHORTCUT: [
    "11111 10001 01110 11111 11111 11111 10001 11111",
    "10000 10001 10000 00100 00100 00100 10001 00100",
    "11110 11111 10000 00100 00100 00100 10001 00100",
    "00001 10001 10000 00100 00100 00100 10001 00100",
    "11110 10001 01110 00100 00100 11111 01110 00100",
  ],
};

function makeRects(pattern: string[], yOffset: number, blockWidth = PIXEL) {
  const rects: Array<{ x: number; y: number; w: number; h: number }> = [];

  pattern.forEach((row, y) => {
    row.split(" ").forEach((word, wordIndex) => {
      [...word].forEach((cell, x) => {
        if (cell === "1") {
          rects.push({
            x: (x + wordIndex * (word.length + GAP)) * blockWidth,
            y: (y + yOffset) * PIXEL,
            w: blockWidth,
            h: PIXEL,
          });
        }
      });
    });
  });

  return rects;
}

export default function DisplayLogo({ className }: DisplayLogoProps) {
  const top = makeRects(rows.DJ, 0);
  const bottom = makeRects(rows.SHORTCUT, 7);
  const mainRects = [...top, ...bottom];

  return (
    <svg
      className={className}
      viewBox="0 0 520 120"
      preserveAspectRatio="xMinYMid meet"
      width="100%"
      role="img"
      aria-label="DJ SHORTCUT pixel logo"
    >
      <defs>
        <filter id="glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="520" height="120" fill="#000" />

      <g className="logo-layer logo-layer--outline-1" transform="translate(3 3)">
        {mainRects.map((r, i) => (
          <rect key={`o1-${i}`} x={r.x} y={r.y} width={r.w} height={r.h} fill="#066b3b" />
        ))}
      </g>
      <g className="logo-layer logo-layer--outline-2" transform="translate(1.5 1.5)">
        {mainRects.map((r, i) => (
          <rect key={`o2-${i}`} x={r.x} y={r.y} width={r.w} height={r.h} fill="#0a8f4f" />
        ))}
      </g>

      <g className="logo-layer logo-layer--main" filter="url(#glow)">
        {mainRects.map((r, i) => (
          <rect key={`m-${i}`} x={r.x} y={r.y} width={r.w} height={r.h} fill="#00ff88" />
        ))}
      </g>

      <g opacity="0.5" stroke="#d2ffe9" strokeWidth="1">
        <line x1="20" y1="30" x2="74" y2="30" />
        <line x1="20" y1="86" x2="500" y2="86" />
      </g>

      <rect className="scanline" x="0" y="0" width="520" height="120" fill="url(#scan)" />

      <style>{`
        .logo-layer {
          animation: flicker 6s infinite steps(1, end);
          transform-box: fill-box;
          transform-origin: center;
          transition: transform 140ms ease;
        }

        svg:hover .logo-layer--main {
          transform: translate(1px, 0);
        }

        .scanline {
          opacity: 0.08;
          mix-blend-mode: screen;
        }

        @keyframes flicker {
          0%, 19%, 21%, 58%, 62%, 100% { opacity: 1; }
          20%, 60% { opacity: 0.92; }
          61% { opacity: 0.96; }
        }
      `}</style>

      <defs>
        <pattern id="scan" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="1" fill="#ffffff" />
          <rect y="1" width="4" height="3" fill="transparent" />
        </pattern>
      </defs>
    </svg>
  );
}
