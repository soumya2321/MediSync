import { useState } from 'react';

interface AnimatedCapsuleHeroProps {
  loop?: boolean;
}

export function AnimatedCapsuleHero({ loop: _loop = true }: AnimatedCapsuleHeroProps = {}) {
  const [replayKey, setReplayKey] = useState<number>(0);

  const handleReplay = () => {
    setReplayKey((prev) => prev + 1);
  };

  return (
    <div
      key={replayKey}
      onClick={handleReplay}
      role="button"
      tabIndex={0}
      title="Click to interact"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleReplay();
        }
      }}
      className="relative mx-auto my-2 flex items-center justify-center w-[360px] max-w-full h-[290px] select-none cursor-pointer focus:outline-hidden group"
    >
      <style>{`
        /* ==================== 1. ZERO-G LEVITATION ==================== */
        @keyframes capsule-levitate {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(-1.2deg);
          }
        }

        @keyframes floor-shadow-breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 0.72;
          }
          50% {
            transform: scale(0.88) translateY(3px);
            opacity: 0.48;
          }
        }

        /* ==================== 2. AMBIENT HALO BREATHE ==================== */
        @keyframes halo-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.06);
            opacity: 1;
          }
        }

        /* ==================== 3. SPECULAR GLEAM SHIMMER ==================== */
        @keyframes specular-gleam-sweep {
          0%, 40% {
            transform: translateX(-55px) translateY(-55px);
            opacity: 0;
          }
          52% {
            opacity: 0.85;
          }
          66% {
            transform: translateX(75px) translateY(75px);
            opacity: 0;
          }
          100% {
            transform: translateX(75px) translateY(75px);
            opacity: 0;
          }
        }

        /* ==================== 4. MEDICAL CROSS LUMINESCENCE ==================== */
        @keyframes cross-glow-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.6));
            opacity: 0.95;
          }
          50% {
            filter: drop-shadow(0 0 7px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 14px rgba(110, 231, 183, 0.8));
            opacity: 1;
          }
        }

        /* ==================== 5. 3D ORBITAL RING BREATHE ==================== */
        @keyframes orbit-ring-glow {
          0%, 100% {
            opacity: 0.88;
            stroke-width: 2.8px;
          }
          50% {
            opacity: 1;
            stroke-width: 3.4px;
            filter: drop-shadow(0 0 8px rgba(52, 211, 153, 0.75));
          }
        }

        /* ==================== 6. SATELLITE 3D ORBIT REVOLUTION ==================== */
        @keyframes satellite-orbit-front {
  0.0% { transform: translate(300.2px, 110.5px) scale(1.0); opacity: 1.0; }
  3.12% { transform: translate(300.1px, 119.1px) scale(1.04); opacity: 1.0; }
  6.25% { transform: translate(295.4px, 128.6px) scale(1.07); opacity: 1.0; }
  9.38% { transform: translate(286.3px, 138.8px) scale(1.1); opacity: 1.0; }
  12.5% { transform: translate(273.2px, 149.2px) scale(1.13); opacity: 1.0; }
  15.62% { transform: translate(256.4px, 159.4px) scale(1.15); opacity: 1.0; }
  18.75% { transform: translate(236.7px, 169.1px) scale(1.17); opacity: 1.0; }
  21.88% { transform: translate(214.8px, 177.9px) scale(1.18); opacity: 1.0; }
  25.0% { transform: translate(191.6px, 185.4px) scale(1.18); opacity: 1.0; }
  28.12% { transform: translate(167.9px, 191.3px) scale(1.18); opacity: 1.0; }
  31.25% { transform: translate(144.7px, 195.5px) scale(1.17); opacity: 1.0; }
  34.38% { transform: translate(122.9px, 197.7px) scale(1.15); opacity: 1.0; }
  37.5% { transform: translate(103.2px, 197.9px) scale(1.13); opacity: 1.0; }
  40.62% { transform: translate(86.5px, 196.1px) scale(1.1); opacity: 1.0; }
  43.75% { transform: translate(73.4px, 192.3px) scale(1.07); opacity: 1.0; }
  46.88% { transform: translate(64.4px, 186.7px) scale(1.04); opacity: 1.0; }
  50.0% { transform: translate(59.8px, 179.5px) scale(1.0); opacity: 1.0; }
  53.12% { transform: translate(59.9px, 170.9px) scale(0.96); opacity: 0.0; }
  56.25% { transform: translate(64.6px, 161.4px) scale(0.93); opacity: 0.0; }
  59.38% { transform: translate(73.7px, 151.2px) scale(0.9); opacity: 0.0; }
  62.5% { transform: translate(86.8px, 140.8px) scale(0.87); opacity: 0.0; }
  65.62% { transform: translate(103.6px, 130.6px) scale(0.85); opacity: 0.0; }
  68.75% { transform: translate(123.3px, 120.9px) scale(0.83); opacity: 0.0; }
  71.88% { transform: translate(145.2px, 112.1px) scale(0.82); opacity: 0.0; }
  75.0% { transform: translate(168.4px, 104.6px) scale(0.82); opacity: 0.0; }
  78.12% { transform: translate(192.1px, 98.7px) scale(0.82); opacity: 0.0; }
  81.25% { transform: translate(215.3px, 94.5px) scale(0.83); opacity: 0.0; }
  84.38% { transform: translate(237.1px, 92.3px) scale(0.85); opacity: 0.0; }
  87.5% { transform: translate(256.8px, 92.1px) scale(0.87); opacity: 0.0; }
  90.62% { transform: translate(273.5px, 93.9px) scale(0.9); opacity: 0.0; }
  93.75% { transform: translate(286.6px, 97.7px) scale(0.93); opacity: 0.0; }
  96.88% { transform: translate(295.6px, 103.3px) scale(0.96); opacity: 0.0; }
  100.0% { transform: translate(300.2px, 110.5px) scale(1.0); opacity: 1.0; }
        }

        @keyframes satellite-orbit-back {
  0.0% { transform: translate(300.2px, 110.5px) scale(1.0); opacity: 0.0; }
  3.12% { transform: translate(300.1px, 119.1px) scale(1.04); opacity: 0.0; }
  6.25% { transform: translate(295.4px, 128.6px) scale(1.07); opacity: 0.0; }
  9.38% { transform: translate(286.3px, 138.8px) scale(1.1); opacity: 0.0; }
  12.5% { transform: translate(273.2px, 149.2px) scale(1.13); opacity: 0.0; }
  15.62% { transform: translate(256.4px, 159.4px) scale(1.15); opacity: 0.0; }
  18.75% { transform: translate(236.7px, 169.1px) scale(1.17); opacity: 0.0; }
  21.88% { transform: translate(214.8px, 177.9px) scale(1.18); opacity: 0.0; }
  25.0% { transform: translate(191.6px, 185.4px) scale(1.18); opacity: 0.0; }
  28.12% { transform: translate(167.9px, 191.3px) scale(1.18); opacity: 0.0; }
  31.25% { transform: translate(144.7px, 195.5px) scale(1.17); opacity: 0.0; }
  34.38% { transform: translate(122.9px, 197.7px) scale(1.15); opacity: 0.0; }
  37.5% { transform: translate(103.2px, 197.9px) scale(1.13); opacity: 0.0; }
  40.62% { transform: translate(86.5px, 196.1px) scale(1.1); opacity: 0.0; }
  43.75% { transform: translate(73.4px, 192.3px) scale(1.07); opacity: 0.0; }
  46.88% { transform: translate(64.4px, 186.7px) scale(1.04); opacity: 0.0; }
  50.0% { transform: translate(59.8px, 179.5px) scale(1.0); opacity: 0.0; }
  53.12% { transform: translate(59.9px, 170.9px) scale(0.96); opacity: 0.85; }
  56.25% { transform: translate(64.6px, 161.4px) scale(0.93); opacity: 0.85; }
  59.38% { transform: translate(73.7px, 151.2px) scale(0.9); opacity: 0.85; }
  62.5% { transform: translate(86.8px, 140.8px) scale(0.87); opacity: 0.85; }
  65.62% { transform: translate(103.6px, 130.6px) scale(0.85); opacity: 0.85; }
  68.75% { transform: translate(123.3px, 120.9px) scale(0.83); opacity: 0.85; }
  71.88% { transform: translate(145.2px, 112.1px) scale(0.82); opacity: 0.85; }
  75.0% { transform: translate(168.4px, 104.6px) scale(0.82); opacity: 0.85; }
  78.12% { transform: translate(192.1px, 98.7px) scale(0.82); opacity: 0.85; }
  81.25% { transform: translate(215.3px, 94.5px) scale(0.83); opacity: 0.85; }
  84.38% { transform: translate(237.1px, 92.3px) scale(0.85); opacity: 0.85; }
  87.5% { transform: translate(256.8px, 92.1px) scale(0.87); opacity: 0.85; }
  90.62% { transform: translate(273.5px, 93.9px) scale(0.9); opacity: 0.85; }
  93.75% { transform: translate(286.6px, 97.7px) scale(0.93); opacity: 0.85; }
  96.88% { transform: translate(295.6px, 103.3px) scale(0.96); opacity: 0.85; }
  100.0% { transform: translate(300.2px, 110.5px) scale(1.0); opacity: 0.0; }
        }

        /* Class bindings */
        .anim-levitate {
          animation: capsule-levitate 4.2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        .anim-shadow {
          transform-origin: 180px 254px;
          animation: floor-shadow-breathe 4.2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        .anim-halo {
          transform-origin: 180px 145px;
          animation: halo-pulse 4.2s ease-in-out infinite;
        }

        .anim-gleam {
          animation: specular-gleam-sweep 4.2s ease-in-out infinite;
        }

        .anim-cross {
          animation: cross-glow-pulse 4.2s ease-in-out infinite;
        }

        .anim-orbit-ring {
          animation: orbit-ring-glow 4.2s ease-in-out infinite;
        }

        .anim-satellite-front {
          animation: satellite-orbit-front 4.2s linear infinite;
        }

        .anim-satellite-back {
          animation: satellite-orbit-back 4.2s linear infinite;
        }
      `}</style>

      {/* Pure Vector SVG Illustration of 3D Emerald & Ivory Capsule with Orbital Ring */}
      <svg
        viewBox="0 0 360 300"
        className="w-full h-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* Floor Drop Shadow Blur Filter */}
          <filter id="floorShadowBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="9" />
          </filter>

          {/* Soft Ambient Halo Blur Filter */}
          <filter id="haloSoftBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="12" />
          </filter>

          {/* Specular Reflection Blur Filter */}
          <filter id="specularSoftBlur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>

          {/* Satellite Bead Glow Filter */}
          <filter id="beadBloomFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Ambient Mint Disc Halo Gradient */}
          <radialGradient id="ambientHaloGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.32" />
            <stop offset="45%" stopColor="#34D399" stopOpacity="0.16" />
            <stop offset="85%" stopColor="#042A27" stopOpacity="0" />
          </radialGradient>

          {/* ==================== 3D CAPSULE GRADIENTS ==================== */}
          {/* Top Green Shell 3D Shading Gradient (Emerald to Deep Forest) */}
          <linearGradient id="greenCapGrad" x1="0%" y1="0%" x2="100%" y2="85%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="22%" stopColor="#10B981" />
            <stop offset="65%" stopColor="#059669" />
            <stop offset="88%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>

          {/* Bottom Ivory Shell 3D Shading Gradient (Pearl to Golden Cream) */}
          <linearGradient id="ivoryBodyGrad" x1="0%" y1="0%" x2="100%" y2="85%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="28%" stopColor="#FBF8F1" />
            <stop offset="60%" stopColor="#F1E7D5" />
            <stop offset="85%" stopColor="#DFCCA8" />
            <stop offset="100%" stopColor="#C7B089" />
          </linearGradient>

          {/* Specular Crest Highlight Beam Gradient */}
          <linearGradient id="specularBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
          </linearGradient>

          {/* Specular Gleam Sweep Wipe Gradient */}
          <linearGradient id="gleamSweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* 3D Satellite Bead Spherical Gradient */}
          <radialGradient id="satelliteBeadGrad" cx="35%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#D1FAE5" />
            <stop offset="35%" stopColor="#34D399" />
            <stop offset="75%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </radialGradient>

          {/* Front Orbit Ring Luminous Gradient */}
          <linearGradient id="orbitFrontGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#A7F3D0" />
          </linearGradient>

          {/* Back Orbit Ring Soft Gradient */}
          <linearGradient id="orbitBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#34D399" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* 1. Floor Drop Shadow (Soft ambient blurred shadow on dark background) */}
        <ellipse
          cx="180"
          cy="254"
          rx="68"
          ry="15"
          fill="rgba(0, 18, 16, 0.72)"
          filter="url(#floorShadowBlur)"
          className="anim-shadow pointer-events-none"
        />

        {/* 2. Ambient Pale Mint Halo Disc Behind Capsule */}
        <g className="anim-halo pointer-events-none">
          <ellipse
            cx="180"
            cy="145"
            rx="110"
            ry="105"
            fill="url(#ambientHaloGrad)"
            filter="url(#haloSoftBlur)"
          />
        </g>

        {/* 3. Back Half of the 3D Orbital Ring (Passes BEHIND the capsule) */}
        <g className="pointer-events-none">
          <path
            d="M 59.8 179.5 A 125 42 -16 0 1 300.2 110.5"
            fill="none"
            stroke="url(#orbitBackGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>

        {/* 4. Satellite Bead (When traveling in the BACK arc) */}
        <g className="anim-satellite-back pointer-events-none">
          <circle cx="0" cy="0" r="6" fill="url(#satelliteBeadGrad)" />
          <ellipse cx="-1.8" cy="-1.8" rx="2.2" ry="1.4" fill="#FFFFFF" opacity="0.75" />
        </g>

        {/* 5. Main 3D Levitating Capsule Assembly */}
        <g className="anim-levitate">
          {/* Tilted Capsule Body Group (Rotated -46 deg around center 180, 145) */}
          <g transform="translate(180, 145) rotate(-46)">
            {/* Ambient Silhouette Depth Shadow */}
            <rect
              x="-34"
              y="-88"
              width="68"
              height="176"
              rx="34"
              fill="rgba(2, 28, 22, 0.45)"
              filter="url(#specularSoftBlur)"
            />

            {/* ==================== A. LOWER IVORY SHELL ==================== */}
            {/* Ivory Cylinder Body + Bottom Hemispherical Cap */}
            <path
              d="M -34 0 L -34 54 A 34 34 0 0 0 34 54 L 34 0 A 34 7.5 0 0 0 -34 0 Z"
              fill="url(#ivoryBodyGrad)"
            />

            {/* Ivory Underside Shadow Warmth */}
            <path
              d="M -2 54 A 34 34 0 0 1 34 54 L 34 0 A 34 7.5 0 0 1 20 5 L 20 50 A 24 24 0 0 1 -2 54 Z"
              fill="#D4BE9B"
              opacity="0.35"
            />

            {/* ==================== B. UPPER GREEN SHELL ==================== */}
            {/* Green Cylinder Body + Top Hemispherical Cap */}
            <path
              d="M -34 0 L -34 -54 A 34 34 0 0 1 34 -54 L 34 0 A 34 7.5 0 0 1 -34 0 Z"
              fill="url(#greenCapGrad)"
            />

            {/* Green Underside Shadow Depth */}
            <path
              d="M 12 -54 A 34 34 0 0 1 34 -54 L 34 0 A 34 7.5 0 0 1 18 5 L 18 -48 A 24 24 0 0 1 12 -54 Z"
              fill="#064E3B"
              opacity="0.45"
            />

            {/* Raised Collar Lip / Seam Overlap Rim */}
            <path
              d="M -34.5 1.5 L -34.5 -2.5 A 34.5 7.5 0 0 0 34.5 -2.5 L 34.5 1.5 A 34.5 7.5 0 0 1 -34.5 1.5 Z"
              fill="#047857"
              opacity="0.8"
            />
            <path
              d="M -34.5 1.5 A 34.5 7.5 0 0 1 34.5 1.5"
              fill="none"
              stroke="#A7F3D0"
              strokeWidth="0.9"
              opacity="0.75"
            />

            {/* ==================== C. WHITE MEDICAL CROSS ==================== */}
            {/* Bold Centered Medical Cross on the Green Cap */}
            <g transform="translate(0, -42)" className="anim-cross">
              {/* Soft Inset Shadow for 3D Embedded Look */}
              <rect x="-18" y="-6.5" width="36" height="13" rx="3.5" fill="#047857" opacity="0.3" transform="translate(0, 1.2)" />
              <rect x="-6.5" y="-18" width="13" height="36" rx="3.5" fill="#047857" opacity="0.3" transform="translate(0, 1.2)" />

              {/* Crisp Pure White Cross */}
              <rect x="-17.5" y="-6" width="35" height="12" rx="3" fill="#FFFFFF" />
              <rect x="-6" y="-17.5" width="12" height="35" rx="3" fill="#FFFFFF" />

              {/* Subtle Top Bevel Highlight on Cross */}
              <line x1="-15" y1="-5" x2="15" y2="-5" stroke="#FFFFFF" strokeWidth="1" opacity="0.9" strokeLinecap="round" />
            </g>

            {/* ==================== D. 3D SPECULAR REFLECTIONS & HIGHLIGHTS ==================== */}
            {/* 1. Primary Curved Specular Crest Highlight Beam */}
            <path
              d="M -20 -72 Q -25 -10, -22 65 Q -16 -10, -14 -70 Z"
              fill="url(#specularBeamGrad)"
              filter="url(#specularSoftBlur)"
            />

            {/* 2. Sharp High-Gloss Specular Crest Line */}
            <path
              d="M -22 -66 Q -25 -10, -24 52"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* 3. Top Dome Apex Specular Spot Reflection */}
            <ellipse
              cx="-6"
              cy="-70"
              rx="9"
              ry="4.5"
              transform="rotate(-15 -6 -70)"
              fill="#FFFFFF"
              opacity="0.7"
              filter="url(#specularSoftBlur)"
            />

            {/* 4. Bottom Dome Pearl Highlight Spot */}
            <ellipse
              cx="-8"
              cy="62"
              rx="7"
              ry="3.5"
              transform="rotate(-12 -8 62)"
              fill="#FFFFFF"
              opacity="0.5"
              filter="url(#specularSoftBlur)"
            />

            {/* 5. Right-Hand Silhouette Subsurface Rim Light */}
            <path
              d="M 30 -62 Q 33.5 -5, 30 60"
              fill="none"
              stroke="#A7F3D0"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.45"
            />

            {/* 6. Dynamic Specular Light Gleam Sweep Wipe */}
            <g className="anim-gleam">
              <rect
                x="-40"
                y="-100"
                width="24"
                height="200"
                transform="rotate(25)"
                fill="url(#gleamSweepGrad)"
                opacity="0.75"
                filter="url(#specularSoftBlur)"
              />
            </g>
          </g>
        </g>

        {/* 6. Front Half of the 3D Orbital Ring (Passes IN FRONT of the capsule) */}
        <g className="anim-orbit-ring pointer-events-none">
          <path
            d="M 300.2 110.5 A 125 42 -16 0 1 59.8 179.5"
            fill="none"
            stroke="url(#orbitFrontGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            filter="url(#beadBloomFilter)"
          />
          {/* Crisp White Core Line along the Front Orbit */}
          <path
            d="M 290 114 A 125 42 -16 0 1 70 177"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            opacity="0.65"
          />
        </g>

        {/* 7. Satellite Bead (When traveling in the FRONT arc) */}
        <g className="anim-satellite-front pointer-events-none">
          {/* Outer Bloom Halo */}
          <circle cx="0" cy="0" r="10" fill="rgba(52, 211, 153, 0.45)" filter="url(#beadBloomFilter)" />
          {/* 3D Shaded Emerald Bead Sphere */}
          <circle cx="0" cy="0" r="6.8" fill="url(#satelliteBeadGrad)" />
          {/* Crisp Specular Reflection Highlight Dot */}
          <ellipse cx="-2.2" cy="-2.2" rx="2.5" ry="1.6" fill="#FFFFFF" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}
