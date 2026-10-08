import React from 'react';

interface LinguaHeroVisualProps {
  className?: string;
}

export const LinguaHeroVisual: React.FC<LinguaHeroVisualProps> = ({ className = '' }) => {
  return (
    <div
      className={`relative w-full max-w-md lg:max-w-lg mx-auto aspect-square flex items-center justify-center select-none ${className}`}
      aria-label="Lingua AI 3D Interactive Learning Illustration"
    >
      {/* Ambient background glow atmosphere */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-tr from-[#7C4DBA]/25 via-[#0D9488]/20 to-[#F59E0B]/20 rounded-full blur-3xl animate-pulse pointer-events-none"
      />

      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
        role="img"
      >
        <title>Lingua AI Book, Scanner, Neural Audio & Learning Illustration</title>
        <defs>
          {/* Cover gradient */}
          <linearGradient id="heroBookCover" x1="50" y1="340" x2="450" y2="440" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4A154B" />
            <stop offset="0.5" stopColor="#6B21A8" />
            <stop offset="1" stopColor="#3B0735" />
          </linearGradient>

          {/* Left page gradient */}
          <linearGradient id="heroPageLeft" x1="100" y1="280" x2="250" y2="380" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#F5EEFB" />
          </linearGradient>

          {/* Right page gradient */}
          <linearGradient id="heroPageRight" x1="250" y1="280" x2="400" y2="380" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#EFE5F9" />
          </linearGradient>

          {/* Phone chassis */}
          <linearGradient id="heroPhoneChassis" x1="280" y1="90" x2="390" y2="270" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E132D" />
            <stop offset="1" stopColor="#3E1954" />
          </linearGradient>

          {/* Phone glass screen */}
          <linearGradient id="heroPhoneScreen" x1="290" y1="105" x2="380" y2="255" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0F172A" />
            <stop offset="1" stopColor="#1E1B4B" />
          </linearGradient>

          {/* Holographic scanning cone */}
          <linearGradient id="heroScanCone" x1="330" y1="180" x2="250" y2="360" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2DD4BF" stopOpacity="0.45" />
            <stop offset="0.6" stopColor="#A855F7" stopOpacity="0.25" />
            <stop offset="1" stopColor="#7C4DBA" stopOpacity="0" />
          </linearGradient>

          {/* Sunburst aura */}
          <radialGradient id="heroAura" cx="250" cy="230" r="190" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E9D8FD" stopOpacity="0.65" />
            <stop offset="0.8" stopColor="#F5EEFB" stopOpacity="0.2" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          <filter id="heroGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Backdrop radial aura */}
        <circle cx="250" cy="260" r="185" fill="url(#heroAura)" />

        {/* --- 1. 3D OPEN HARDBOUND BOOK --- */}
        {/* Book spine / shadow */}
        <ellipse cx="250" cy="405" rx="195" ry="18" fill="#1C0620" opacity="0.22" />

        {/* Hardcover Outer Binding */}
        <path
          d="M55 365 C140 332, 230 342, 250 375 C270 342, 360 332, 445 365 L435 398 C350 365, 270 375, 250 408 C230 375, 150 365, 65 398 Z"
          fill="url(#heroBookCover)"
          stroke="#7C4DBA"
          strokeWidth="2"
        />

        {/* Left Open Page Thick Leaf Stack */}
        <path
          d="M68 360 C145 328, 232 336, 248 370 L248 288 C230 254, 145 246, 68 278 Z"
          fill="url(#heroPageLeft)"
          stroke="#DAC7ED"
          strokeWidth="2"
        />

        {/* Right Open Page Thick Leaf Stack */}
        <path
          d="M252 370 C268 336, 355 328, 432 360 L432 278 C355 246, 270 254, 252 288 Z"
          fill="url(#heroPageRight)"
          stroke="#DAC7ED"
          strokeWidth="2"
        />

        {/* Simulated Text Lines On Pages */}
        <path d="M95 285 C140 270, 195 275, 225 292" stroke="#BCA3DA" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M95 305 C140 290, 195 295, 225 312" stroke="#BCA3DA" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M95 325 C140 310, 195 315, 225 332" stroke="#BCA3DA" strokeWidth="3.5" strokeLinecap="round" />

        <path d="M275 292 C305 275, 360 270, 405 285" stroke="#BCA3DA" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M275 312 C305 295, 360 290, 405 305" stroke="#BCA3DA" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M275 332 C305 315, 360 310, 405 325" stroke="#BCA3DA" strokeWidth="3.5" strokeLinecap="round" />

        {/* --- 2. HOLOGRAPHIC SCANNING BEAM --- */}
        <polygon points="315,190 355,175 395,348 185,362" fill="url(#heroScanCone)" />

        {/* Laser Scanning Frame On Book */}
        <polygon
          points="200,338 378,328 388,358 210,368"
          fill="none"
          stroke="#2DD4BF"
          strokeWidth="2"
          strokeDasharray="6 4"
        />

        {/* Horizontal Laser Line */}
        <line x1="205" y1="348" x2="385" y2="338" stroke="#5EEAD4" strokeWidth="3.5" filter="url(#heroGlow)" />

        {/* --- 3. 3D FLOATING SCANNING SMARTPHONE --- */}
        <g transform="rotate(-14 340 180)">
          {/* Phone drop shadow */}
          <rect x="295" y="105" width="100" height="175" rx="22" fill="#1C0620" opacity="0.35" />

          {/* Phone Body */}
          <rect
            x="290"
            y="95"
            width="100"
            height="175"
            rx="22"
            fill="url(#heroPhoneChassis)"
            stroke="#9333EA"
            strokeWidth="2.5"
          />

          {/* Screen Glass */}
          <rect x="296" y="105" width="88" height="155" rx="16" fill="url(#heroPhoneScreen)" />

          {/* Top Speaker / Dynamic Island */}
          <rect x="330" y="112" width="20" height="4" rx="2" fill="#4B5563" />

          {/* Scanning Camera Viewfinder on Phone Screen */}
          <rect
            x="306"
            y="126"
            width="68"
            height="90"
            rx="8"
            fill="#1E293B"
            stroke="#2DD4BF"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Mini Scanned Page in Phone Screen */}
          <rect x="314" y="136" width="52" height="68" rx="4" fill="#F8FAFC" />
          <line x1="320" y1="148" x2="358" y2="148" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="320" y1="158" x2="358" y2="158" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="320" y1="168" x2="348" y2="168" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />

          {/* Audio Wave Bars inside Phone Screen */}
          <rect x="318" y="226" width="4" height="12" rx="2" fill="#A855F7" />
          <rect x="325" y="222" width="4" height="16" rx="2" fill="#2DD4BF" />
          <rect x="332" y="218" width="4" height="20" rx="2" fill="#F59E0B" />
          <rect x="339" y="223" width="4" height="15" rx="2" fill="#2DD4BF" />
          <rect x="346" y="227" width="4" height="11" rx="2" fill="#A855F7" />
        </g>

        {/* --- 4. FLOATING 3D COGNITIVE & ACCESSIBILITY ORBS --- */}
        {/* Floating Letter Orb "A" */}
        <g transform="translate(75, 170)">
          <circle cx="25" cy="25" r="24" fill="#F3E8FF" stroke="#A855F7" strokeWidth="2.5" filter="url(#heroGlow)" />
          <text x="25" y="34" textAnchor="middle" fill="#4A154B" fontSize="22" fontWeight="900" fontFamily="sans-serif">
            A
          </text>
        </g>

        {/* Floating Soundwave Orb */}
        <g transform="translate(145, 90)">
          <circle cx="28" cy="28" r="28" fill="#ECFDF5" stroke="#10B981" strokeWidth="2.5" filter="url(#heroGlow)" />
          <path d="M19 28 L23 20 L27 36 L31 16 L35 40 L39 28" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>

        {/* Floating Multilingual Symbol Orb "अ" (Hindi / Multilingual) */}
        <g transform="translate(385, 80)">
          <circle cx="24" cy="24" r="24" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2.5" filter="url(#heroGlow)" />
          <text x="24" y="32" textAnchor="middle" fill="#92400E" fontSize="20" fontWeight="900" fontFamily="sans-serif">
            अ
          </text>
        </g>

        {/* Floating Star / Accessibility badge */}
        <g transform="translate(410, 240)">
          <circle cx="22" cy="22" r="22" fill="#F0FDFA" stroke="#14B8A6" strokeWidth="2.5" filter="url(#heroGlow)" />
          <path d="M22 12 L24.5 18.5 L31.5 19 L26 23.5 L28 30 L22 26 L16 30 L18 23.5 L12.5 19 L19.5 18.5 Z" fill="#0D9488" />
        </g>

        {/* Neural Network Nodes & Connector Arcs */}
        <g stroke="#C084FC" strokeWidth="1.5" strokeDasharray="3 3">
          <line x1="120" y1="185" x2="160" y2="125" />
          <line x1="175" y1="110" x2="280" y2="135" />
          <line x1="390" y1="115" x2="350" y2="140" />
          <line x1="395" y1="230" x2="350" y2="200" />
        </g>

        {/* Glowing Neural Nodes */}
        <circle cx="160" cy="125" r="4.5" fill="#A855F7" />
        <circle cx="280" cy="135" r="4.5" fill="#2DD4BF" />
        <circle cx="350" cy="140" r="4.5" fill="#F59E0B" />
        <circle cx="350" cy="200" r="4.5" fill="#EC4899" />
      </svg>
    </div>
  );
};
