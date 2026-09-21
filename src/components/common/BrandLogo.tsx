import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../lib/LanguageContext';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  to?: string;
  className?: string;
  lightMode?: boolean;
  iconOnly?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  to = '/',
  className = '',
  lightMode = false,
  iconOnly = false,
}) => {
  const { language } = useLanguage();

  const iconDimensions = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
    xl: 'w-16 h-16 sm:w-20 sm:h-20'
  }[size];

  const titleSizes = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base tracking-tight',
    lg: 'text-lg sm:text-xl',
    xl: 'text-2xl sm:text-3xl'
  }[size];

  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* 3D Professional Football Emblem (Transparent, Sculptural, No Photo Box) */}
      <div className={`${iconDimensions} relative shrink-0 transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]`}>
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -inset-1 bg-gradient-to-tr from-[#00ff88]/30 via-[#00e5ff]/20 to-transparent blur-[6px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Scalable 3D Heraldic Football Crest */}
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 overflow-visible"
        >
          <defs>
            {/* 3D Specular and Drop Shadows */}
            <filter id={`pfc-depth-${size}`} x="-20%" y="-20%" width="150%" height="150%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.85" />
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#00ff88" floodOpacity="0.3" />
            </filter>

            {/* Metallic Shield Outer Bevel (3D Lighting Direction: Top-Left to Bottom-Right) */}
            <linearGradient id={`shield-bevel-light-${size}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="22%" stopColor="#00ff88" />
              <stop offset="55%" stopColor="#00c8ff" />
              <stop offset="100%" stopColor="#040b18" />
            </linearGradient>

            <linearGradient id={`shield-bevel-dark-${size}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0c1b36" />
              <stop offset="50%" stopColor="#050a17" />
              <stop offset="100%" stopColor="#010308" />
            </linearGradient>

            {/* 3D Titanium Plate Gradient */}
            <linearGradient id={`shield-body-grad-${size}`} x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#0d1c38" />
              <stop offset="35%" stopColor="#070e1c" />
              <stop offset="70%" stopColor="#040812" />
              <stop offset="100%" stopColor="#010307" />
            </linearGradient>

            {/* 3D Golden Apex Star */}
            <linearGradient id={`star-light-${size}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff5b8" />
              <stop offset="50%" stopColor="#ffcc00" />
              <stop offset="100%" stopColor="#d48800" />
            </linearGradient>
            <linearGradient id={`star-dark-${size}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d48800" />
              <stop offset="100%" stopColor="#6e3c00" />
            </linearGradient>

            {/* 3D Volumetric Ball Shading (Radial specular lighting) */}
            <radialGradient id={`ball-sphere-3d-${size}`} cx="34%" cy="30%" r="68%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="18%" stopColor="#d2e4ff" />
              <stop offset="46%" stopColor="#5b7499" />
              <stop offset="76%" stopColor="#121d30" />
              <stop offset="100%" stopColor="#040810" />
            </radialGradient>

            {/* Metallic Ball Seam Highlights */}
            <linearGradient id={`seam-facet-grad-${size}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00ffaa" />
              <stop offset="50%" stopColor="#00c8ff" />
              <stop offset="100%" stopColor="#0055aa" />
            </linearGradient>

            {/* 3D Ascending Wing Chevrons */}
            <linearGradient id={`chevron-3d-${size}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ff88" />
              <stop offset="50%" stopColor="#00c8ff" />
              <stop offset="100%" stopColor="#071b3b" />
            </linearGradient>
          </defs>

          {/* MAIN 3D SHIELD BODY */}
          <g filter={`url(#pfc-depth-${size})`}>
            {/* 3D Outer Cast Beveled Rim */}
            <path
              d="M60 6 L104 20 L104 56 C104 84 85 106 60 114 C35 106 16 84 16 56 L16 20 Z"
              fill={`url(#shield-bevel-dark-${size})`}
              stroke={`url(#shield-bevel-light-${size})`}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Shield Left-Facing Light Chamfer */}
            <path
              d="M60 6 L16 20 L16 56 C16 84 35 106 60 114 L60 6 Z"
              fill="#ffffff"
              fillOpacity="0.08"
            />

            {/* Recessed Titanium Core Plate */}
            <path
              d="M60 12 L98 24 L98 55 C98 79 81 98 60 106 C39 98 22 79 22 55 L22 24 Z"
              fill={`url(#shield-body-grad-${size})`}
              stroke="#00e5ff"
              strokeWidth="1.2"
              strokeOpacity="0.4"
              strokeLinejoin="round"
            />

            {/* High-Tech Tactical Grid Accents */}
            <g opacity="0.12" stroke="#ffffff" strokeWidth="1">
              <line x1="28" y1="32" x2="92" y2="32" />
              <line x1="26" y1="44" x2="94" y2="44" />
              <line x1="26" y1="56" x2="94" y2="56" />
              <line x1="28" y1="68" x2="92" y2="68" />
              <line x1="33" y1="80" x2="87" y2="80" />
            </g>

            {/* 3D ASCENDING APEX CHEVRONS */}
            <path
              d="M32 40 L60 22 L88 40 L82 45 L60 30 L38 45 Z"
              fill={`url(#chevron-3d-${size})`}
              stroke="#ffffff"
              strokeWidth="0.8"
              strokeOpacity="0.6"
            />
            <path
              d="M38 50 L60 34 L82 50 L77 54 L60 41 L43 54 Z"
              fill={`url(#chevron-3d-${size})`}
              opacity="0.6"
            />

            {/* 3D RELIEF FOOTBALL SPHERE */}
            <g transform="translate(60, 68)">
              {/* Ball Drop Shadow Inside Plate */}
              <ellipse cx="0" cy="24" rx="25" ry="5" fill="#000000" opacity="0.8" />

              {/* Shaded 3D Sphere */}
              <circle
                cx="0"
                cy="0"
                r="26"
                fill={`url(#ball-sphere-3d-${size})`}
                stroke="#00ff88"
                strokeWidth="1.4"
                strokeOpacity="0.8"
              />

              {/* Central Embossed Pentagon */}
              <polygon
                points="0,-8 9,-1 6,9 -6,9 -9,-1"
                fill="#030814"
                stroke={`url(#seam-facet-grad-${size})`}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="0" cy="1.5" r="2.2" fill="#00ff88" />

              {/* 3D Beveled Seams */}
              <line x1="0" y1="-8" x2="0" y2="-26" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="9" y1="-1" x2="23" y2="-12" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="6" y1="9" x2="17" y2="20" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="-6" y1="9" x2="-17" y2="20" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="-9" y1="-1" x2="-23" y2="-12" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />

              {/* Faceted Geometry Plates on Ball */}
              <path d="M0 -26 C9 -26 18 -21 23 -12 L9 -1 Z" fill="#0b172a" fillOpacity="0.7" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <path d="M0 -26 C-9 -26 -18 -21 -23 -12 L-9 -1 Z" fill="#00ff88" fillOpacity="0.2" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <path d="M23 -12 C27 -3 27 8 17 20 L6 9 Z" fill="#030712" fillOpacity="0.85" />
              <path d="M-23 -12 C-27 -3 -27 8 -17 20 L-6 9 Z" fill="#00e5ff" fillOpacity="0.22" />

              {/* Specular 3D Light Glint */}
              <path
                d="M-16 -18 C-7 -25 7 -25 16 -18 C12 -21 0 -24 -12 -18 Z"
                fill="#ffffff"
                opacity="0.85"
              />
              <ellipse cx="-8" cy="-12" rx="4" ry="2" transform="rotate(-30 -8 -12)" fill="#ffffff" opacity="0.7" />
            </g>

            {/* 3D GOLDEN APEX STAR */}
            <g transform="translate(60, 15)">
              <polygon points="0,-10 2.2,-2.5 9.5,-2.5 3.6,1.8 5.8,9 0,4.6" fill={`url(#star-light-${size})`} />
              <polygon points="0,-10 0,4.6 -5.8,9 -3.6,1.8 -9.5,-2.5 -2.2,-2.5" fill={`url(#star-dark-${size})`} />
              <polygon points="0,-3 2.5,0 0,3 -2.5,0" fill="#ffffff" />
            </g>

            {/* Specular Light Rim on Beveled Top Edges */}
            <path
              d="M60 8 L101 21 L101 35"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeOpacity="0.6"
            />
            <path
              d="M60 8 L19 21 L19 35"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeOpacity="0.85"
            />
          </g>
        </svg>
      </div>

      {/* Modern High-End Wordmark */}
      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <div className={`font-black uppercase flex items-center gap-1.5 font-mono ${titleSizes} ${lightMode ? 'text-gray-950' : 'text-white'}`}>
            <span className="tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">PRO FOOTBALL</span>
            <span className="bg-gradient-to-r from-[#00ff88] via-[#00e5ff] to-[#00ff88] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,255,136,0.4)]">
              CLASS
            </span>
          </div>
          {showSubtitle && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.18em] text-gray-400 uppercase font-sans">
                {language === 'am' ? 'የላቀ የእግር ኳስ መድረክ' : 'ELITE PATHWAY PORTAL'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] shadow-[0_0_6px_#00ff88] animate-pulse" />
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="focus:outline-none focus:ring-1 focus:ring-[#00ff88]/50 rounded-sm">
        {content}
      </Link>
    );
  }

  return content;
};

