"use client";

import React from "react";

interface CustomSvgProps extends React.SVGProps<SVGSVGElement> {
  glow?: boolean;
}

// Custom Premium Panda Face Silhouette Logo
export const PandaLogo: React.FC<CustomSvgProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Ears */}
    <circle cx="28" cy="28" r="14" fill="currentColor" />
    <circle cx="72" cy="28" r="14" fill="currentColor" />
    <circle cx="28" cy="28" r="8" fill="#070809" />
    <circle cx="72" cy="28" r="8" fill="#070809" />
    
    {/* Head Base */}
    <path
      d="M16 55 C12 75, 25 88, 50 88 C75 88, 88 75, 84 55 C82 40, 72 32, 50 32 C28 32, 18 40, 16 55 Z"
      fill="currentColor"
    />
    
    {/* Eyes patches */}
    <ellipse cx="36" cy="56" rx="10" ry="14" transform="rotate(-15 36 56)" fill="#070809" />
    <ellipse cx="64" cy="56" rx="10" ry="14" transform="rotate(15 64 56)" fill="#070809" />
    
    {/* Eyes (Pupils) */}
    <circle cx="38" cy="54" r="3.5" fill="currentColor" />
    <circle cx="39.5" cy="52.5" r="1" fill="#070809" />
    <circle cx="62" cy="54" r="3.5" fill="currentColor" />
    <circle cx="60.5" cy="52.5" r="1" fill="#070809" />
    
    {/* Nose & Muzzle */}
    <path
      d="M45 66 C48 64, 52 64, 55 66 L50 71 Z"
      fill="#070809"
    />
    <path
      d="M46 72 Q50 75 54 72"
      stroke="#070809"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Custom Luxury Car Contour Outline Icon
export const CarOutlineIcon: React.FC<CustomSvgProps> = ({ glow = false, className, ...props }) => (
  <svg
    viewBox="0 0 100 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? "drop-shadow-[0_0_12px_rgba(132,204,22,0.8)]" : ""}`}
    {...props}
  >
    <path
      d="M5 32 C 12 32, 18 31, 23 26 C 28 20, 36 10, 48 10 C 58 10, 68 12, 75 18 C 82 23, 89 27, 95 27 C 98 27, 99 30, 95 32 C 88 32, 80 32, 75 32 C 73 29, 69 29, 67 32 C 45 32, 35 32, 33 32 C 31 29, 27 29, 25 32 C 15 32, 10 32, 5 32 Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M36 17 L56 17 C 62 17, 68 20, 71 24"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    <circle cx="29" cy="32" r="3" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="71" cy="32" r="3" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

// Ceramic Shield / Protection Coat Custom SVG
export const CeramicShieldIcon: React.FC<CustomSvgProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Shield contour */}
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    {/* Hydrophobic droplet + shine details */}
    <path d="M12 8c-1.5 2-2.5 3.5-2.5 4.5 0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5C14.5 11.5 13.5 10 12 8z" fill="currentColor" opacity="0.3" />
    <path d="M15 6l1.5 1.5M7.5 7.5L9 9" strokeDasharray="1 1" />
  </svg>
);

// Car Polishing Buffer Machine Custom SVG
export const PolisherIcon: React.FC<CustomSvgProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Polishing pad and gear head */}
    <path d="M6 10h12v4H6z" />
    <path d="M12 6v4M8 6h8" />
    <ellipse cx="12" cy="16" rx="9" ry="3" />
    <path d="M3 16c0 1.5 4 2.5 9 2.5s9-1 9-2.5" />
    {/* Swirling polishing motions */}
    <path d="M18 10c1.5-1 3.5-1 4.5.5M6 10c-1.5-1-3.5-1-4.5.5" strokeDasharray="2 2" />
  </svg>
);

// Paint Protection Film (PPF) Rolls / Wrap Custom SVG
export const FilmWrapIcon: React.FC<CustomSvgProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Body panel roll contour */}
    <path d="M19 17v4a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h4" />
    <path d="M9 13v-4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-4" />
    {/* Film layer squeegee application representation */}
    <line x1="9" y1="13" x2="15" y2="7" />
    <polygon points="12,6 15,3 18,6 15,9" fill="currentColor" opacity="0.3" />
  </svg>
);

// Luxury Premium Diamond Sparkle SVG
export const SparkleIcon: React.FC<CustomSvgProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.9 2.9M15.5 15.5l2.9 2.9M5.6 18.4l2.9-2.9M15.5 8.5l2.9-2.9" />
    <polygon points="12,8 14,12 12,16 10,12" fill="currentColor" opacity="0.3" />
  </svg>
);

// Custom Instagram SVG Icon
export const InstagramIcon: React.FC<CustomSvgProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// Custom Telegram SVG Icon
export const TelegramIcon: React.FC<CustomSvgProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path d="M21.13 2.87a2.53 2.53 0 00-2.61-.41L2.85 9.17a1 1 0 00-.09 1.82l6.23 2.76 2.76 6.23a1 1 0 001.82-.09l6.71-15.67a2.53 2.53 0 00-.25-2.35zM9.54 12.38l3.66-3.66" />
  </svg>
);

// Custom Arrow SVG Icon
export const ArrowRightIcon: React.FC<CustomSvgProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// Custom Dry Cleaning Icon
export const DryCleaningIcon: React.FC<CustomSvgProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path d="M12 2v6M9 6l3-3 3 3M4 14h16M4 18h16M6 10h12v4H6z" />
    <circle cx="12" cy="18" r="2" fill="currentColor" opacity="0.3" />
  </svg>
);

// Custom Glass Detailing Icon
export const GlassIcon: React.FC<CustomSvgProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path d="M2 14c4-4 16-4 20 0M12 4v16M2 12h20" />
    <path d="M8 8s1-1.5 2-1.5 2 1.5 2 1.5M14 16s1 1.5 2 1.5 2-1.5 2-1.5" strokeDasharray="2 2" />
  </svg>
);

// Custom Complex Protection Icon
export const ComplexIcon: React.FC<CustomSvgProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
    <polygon points="12,5 19,9.5 19,14.5 12,19 5,14.5 5,9.5" fill="currentColor" opacity="0.2" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="8.5" x2="22" y2="15.5" />
    <line x1="2" y1="15.5" x2="22" y2="8.5" />
  </svg>
);
