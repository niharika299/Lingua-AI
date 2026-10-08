import React from 'react';

export const HeroVisual: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center select-none ${className}`}>
      {/* Ambient background glow rings */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#7C4DBA]/20 via-[#0D9488]/15 to-[#F59E0B]/15 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
        aria-hidden="true"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="bookCoverGrad" x1="50" y1="340" x2="450" y2="440" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B0735" />
            <stop offset="0.5" stopColor="#53164D" />
            <stop offset="1" stopColor="#250523" />
          </linearGradient>

          <linearGradient id="pageLeftGrad" x1="100" y1="280" x2="250" y2="380" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#F3EEFA" />
          </linearGradient>

          <linearGradient id="pageRightGrad" x1="250" y1="280" x2="400" y2="380" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#EFE8F9" />
          </linearGradient>

          <linearGradient id="phoneGrad" x1="260" y1="90" x2="380" y2="280" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E152A" />
            <stop offset="1" stopColor="#361D4C" />
          </linearGradient>

          <linearGradient id="beamGrad" x1="320" y1="200" x2="250" y2="360" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0D9488" stopOpacity="0.4" />
            <stop offset="0.7" stopColor="#7C4DBA" stopOpacity="0.25" />
            <stop offset="1" stopColor="#A855F7" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="sunburstGrad" cx="250" cy="220" r="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E9D8FD" stopOpacity="0.6" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Central Sunburst */}
        <circle cx="250" cy="270" r="180" fill="url(#sunburstGrad)" />

        {/* --- 1. OPEN 3D BOOK FOUNDATION --- */}
        {/* Book Outer Spine & Cover */}
        <path
          d="M60 365 C140 335, 230 345, 250 375 C270 345, 360 335, 440 365 L430 395 C350 365, 270 375, 250 405 C230 375, 150 365, 70 395 Z"
          fill="url(#bookCoverGrad)"
          stroke="#7C4DBA"
          strokeWidth="2"
        />

        {/* Left Open Page Thick Stack */}
        <path
          d="M72 360 C145 330, 230 338, 248 370 L248 290 C230 258, 145 250, 72 280 Z"
          fill="url(#pageLeftGrad)"
          stroke="#E2D4F0"
          strokeWidth="2"
        />

        {/* Right Open Page Thick Stack */}
        <path
          d="M252 370 C270 338, 355 330, 428 360 L428 280 C355 250, 270 258, 252 290 Z"
          fill="url(#pageRightGrad)"
          stroke="#E2D4F0"
          strokeWidth="2"
        />

        {/* Page Text Line Shading on Left Page */}
        <path d="M100 285 C140 272, 195 277, 220 293" stroke="#D1BBE8" strokeWidth="3" strokeLinecap="round" />
        <path d="M100 305 C140 292, 195 297, 220 313" stroke="#D1BBE8" strokeWidth="3" strokeLinecap="round" />
        <path d="M100 325 C140 312, 195 317, 220 333" stroke="#D1BBE8" strokeWidth="3" strokeLinecap="round" />

        {/* Page Text Line Shading on Right Page */}
        <path d="M280 293 C305 277, 360 272, 400 285" stroke="#D1BBE8" strokeWidth="3" strokeLinecap="round" />
        <path d="M280 313 C305 297, 360 292, 400 305" stroke="#D1BBE8" strokeWidth="3" strokeLinecap="round" />
        <path d="M280 333 C305 317, 360 312, 400 325" stroke="#D1BBE8" strokeWidth="3" strokeLinecap="round" />

        {/* --- 2. SCANNING BEAM CONE (From Phone down to Book) --- */}
        <polygon points="310,195 350,180 390,345 190,360" fill="url(#beamGrad)" />

        {/* Scanning Reticle Frame on Book Surface */}
        <polygon
          points="205,335 375,325 385,355 215,365"
          fill="none"
          stroke="#0D9488"
          strokeWidth="2.5"
          strokeDasharray="8 4"
        />

        {/* --- 3. 3D FLOATING SMARTPHONE SCANNER --- */}
        <g transform="rotate(-12 320 160)">
          {/* Phone Drop Shadow */}
          <rect x="275" y="65" width="110" height="190" rx="22" fill="#000000" opacity="0.25" filter="url(#glowFilter)" />

          {/* Phone Outer Chassis */}
          <rect x="270" y="60" width="110" height="190" rx="22" fill="url(#phoneGrad)" stroke="#A855F7" strokeWidth="2.5" />

          {/* Screen Glass */}
          <rect x="278" y="75" width="94" height="160" rx="16" fill="#180D26" />

          {/* Camera Notch & Speaker */}
          <rect x="315" y="66" width="20" height="4" rx="2" fill="#4B3363" />

          {/* Viewfinder Target on Phone Screen */}
          <rect x="288" y="95" width="74" height="85" rx="8" fill="#25123A" stroke="#0D9488" strokeWidth="1.5" strokeDasharray="4 2" />

          {/* Mini Scanned Page in Screen */}
          <path d="M296 110 H354 M296 122 H340 M296 134 H350 M296 146 H330" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />

          {/* Camera Scanning Laser Line */}
          <line x1="288" y1="126" x2="362" y2="126" stroke="#2DD4BF" strokeWidth="2" filter="url(#glowFilter)" />

          {/* Capture Circle Button on Screen */}
          <circle cx="325" cy="205" r="14" fill="#7C4DBA" stroke="#C084FC" strokeWidth="2" />
          <circle cx="325" cy="205" r="8" fill="#FFFFFF" />
        </g>

        {/* --- 4. AUDIO SOUND WAVES & SPEECH FREQUENCIES --- */}
        <g stroke="#0D9488" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M130 190 C120 170, 120 150, 130 130" opacity="0.6" />
          <path d="M115 200 C100 170, 100 140, 115 110" opacity="0.8" />
          <path d="M100 210 C80 170, 80 130, 100 90" />
        </g>

        {/* Sound notes */}
        <g fill="#0D9488">
          <circle cx="145" cy="165" r="5" />
          <rect x="148" y="145" width="2.5" height="20" rx="1" />
          <path d="M150 145 C155 142, 160 148, 165 147" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>

        {/* --- 5. NEURAL CONNECTIONS & SYNAPSE NODES --- */}
        <g stroke="#C084FC" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3">
          <line x1="160" y1="110" x2="220" y2="80" />
          <line x1="220" y1="80" x2="280" y2="60" />
          <line x1="220" y1="80" x2="240" y2="150" />
          <line x1="390" y1="80" x2="430" y2="120" />
          <line x1="430" y1="120" x2="410" y2="190" />
        </g>

        {/* Synapse Nodes */}
        <circle cx="160" cy="110" r="5" fill="#38BDF8" filter="url(#glowFilter)" />
        <circle cx="220" cy="80" r="6" fill="#F472B6" filter="url(#glowFilter)" />
        <circle cx="280" cy="60" r="4" fill="#FBBF24" />
        <circle cx="430" cy="120" r="5" fill="#2DD4BF" filter="url(#glowFilter)" />
        <circle cx="410" cy="190" r="4" fill="#C084FC" />

        {/* --- 6. MULTILINGUAL FLOATING GLYPHS / LETTERS --- */}
        {/* Letter A */}
        <g transform="translate(140, 60) scale(0.9)">
          <rect width="44" height="44" rx="12" fill="#FFFFFF" stroke="#E9D8FD" strokeWidth="2" filter="url(#glowFilter)" />
          <text x="22" y="30" textAnchor="middle" fill="#4A154B" fontSize="22" fontWeight="bold" fontFamily="sans-serif">
            A
          </text>
        </g>

        {/* Hindi Glyph क */}
        <g transform="translate(70, 220) scale(0.85)">
          <rect width="44" height="44" rx="12" fill="#FFFFFF" stroke="#CCFBF1" strokeWidth="2" filter="url(#glowFilter)" />
          <text x="22" y="30" textAnchor="middle" fill="#0D9488" fontSize="22" fontWeight="bold" fontFamily="sans-serif">
            क
          </text>
        </g>

        {/* Bengali Glyph অ */}
        <g transform="translate(410, 150) scale(0.85)">
          <rect width="44" height="44" rx="12" fill="#FFFFFF" stroke="#FDE68A" strokeWidth="2" filter="url(#glowFilter)" />
          <text x="22" y="30" textAnchor="middle" fill="#D97706" fontSize="22" fontWeight="bold" fontFamily="sans-serif">
            অ
          </text>
        </g>

        {/* Tamil Glyph த */}
        <g transform="translate(400, 240) scale(0.8)">
          <rect width="44" height="44" rx="12" fill="#FFFFFF" stroke="#E9D8FD" strokeWidth="2" filter="url(#glowFilter)" />
          <text x="22" y="30" textAnchor="middle" fill="#7C4DBA" fontSize="20" fontWeight="bold" fontFamily="sans-serif">
            த
          </text>
        </g>

        {/* Gold Star celebration */}
        <polygon
          points="250,15 255,27 268,28 258,37 261,50 250,43 239,50 242,37 232,28 245,27"
          fill="#F59E0B"
          filter="url(#glowFilter)"
        />
      </svg>
    </div>
  );
};
