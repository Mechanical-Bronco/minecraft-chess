'use client';

/**
 * Dog Piece SVG Components
 * Cute emoji-style miniature dog breeds for chess pieces
 */

import { PieceType, PieceColor } from '@/game/types';

interface DogSvgProps {
  color: PieceColor;
  size?: number;
}

// Color palettes for white and black pieces
const getColors = (color: PieceColor) => {
  if (color === 'white') {
    return {
      primary: '#F5E6D3',      // Cream/tan base
      secondary: '#E8D4BC',    // Slightly darker cream
      accent: '#D4B896',       // Darker tan for shading
      nose: '#2D2D2D',         // Dark nose
      eyes: '#3D2314',         // Dark brown eyes
      tongue: '#FF8B9A',       // Pink tongue
      collar: '#4A90D9',       // Blue collar for white pieces
      highlight: '#FFFFFF',    // White highlights
    };
  }
  return {
    primary: '#8B6914',        // Golden brown base
    secondary: '#6B4E0A',      // Darker brown
    accent: '#5A4208',         // Even darker for shading
    nose: '#1A1A1A',           // Black nose
    eyes: '#1A1A1A',           // Black eyes
    tongue: '#FF6B7A',         // Pink tongue
    collar: '#D4AF37',         // Gold collar for black pieces
    highlight: '#A67C00',      // Golden highlight
  };
};

/**
 * Chihuahua - Pawn
 * Big pointy ears, apple-shaped head, huge eyes
 */
export function ChihuahuaSvg({ color, size = 64 }: DogSvgProps) {
  const c = getColors(color);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Big pointy ears */}
      <ellipse cx="14" cy="18" rx="10" ry="16" fill={c.primary} transform="rotate(-20 14 18)" />
      <ellipse cx="14" cy="18" rx="6" ry="10" fill={c.tongue} transform="rotate(-20 14 18)" />
      <ellipse cx="50" cy="18" rx="10" ry="16" fill={c.primary} transform="rotate(20 50 18)" />
      <ellipse cx="50" cy="18" rx="6" ry="10" fill={c.tongue} transform="rotate(20 50 18)" />

      {/* Apple-shaped head */}
      <ellipse cx="32" cy="38" rx="22" ry="20" fill={c.primary} />
      <ellipse cx="32" cy="42" rx="14" ry="10" fill={c.secondary} />

      {/* Huge eyes */}
      <ellipse cx="24" cy="34" rx="7" ry="8" fill="#FFFFFF" />
      <ellipse cx="40" cy="34" rx="7" ry="8" fill="#FFFFFF" />
      <ellipse cx="25" cy="35" rx="4" ry="5" fill={c.eyes} />
      <ellipse cx="41" cy="35" rx="4" ry="5" fill={c.eyes} />
      <circle cx="26" cy="33" r="2" fill="#FFFFFF" />
      <circle cx="42" cy="33" r="2" fill="#FFFFFF" />

      {/* Tiny nose */}
      <ellipse cx="32" cy="46" rx="4" ry="3" fill={c.nose} />
      <ellipse cx="32" cy="45" rx="1.5" ry="1" fill="#666666" />

      {/* Little smile */}
      <path d="M28 50 Q32 54 36 50" stroke={c.nose} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/**
 * French Bulldog - Rook
 * Bat ears, flat face, square head, sturdy
 */
export function FrenchBulldogSvg({ color, size = 64 }: DogSvgProps) {
  const c = getColors(color);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Bat ears */}
      <ellipse cx="12" cy="14" rx="8" ry="14" fill={c.primary} />
      <ellipse cx="12" cy="14" rx="5" ry="9" fill={c.tongue} />
      <ellipse cx="52" cy="14" rx="8" ry="14" fill={c.primary} />
      <ellipse cx="52" cy="14" rx="5" ry="9" fill={c.tongue} />

      {/* Square-ish head */}
      <rect x="8" y="20" width="48" height="38" rx="12" fill={c.primary} />

      {/* Flat face/muzzle */}
      <ellipse cx="32" cy="46" rx="16" ry="12" fill={c.secondary} />

      {/* Wrinkles on forehead */}
      <path d="M22 28 Q32 32 42 28" stroke={c.accent} strokeWidth="2" fill="none" />

      {/* Eyes */}
      <ellipse cx="22" cy="36" rx="6" ry="6" fill="#FFFFFF" />
      <ellipse cx="42" cy="36" rx="6" ry="6" fill="#FFFFFF" />
      <circle cx="23" cy="37" r="4" fill={c.eyes} />
      <circle cx="43" cy="37" r="4" fill={c.eyes} />
      <circle cx="24" cy="35" r="1.5" fill="#FFFFFF" />
      <circle cx="44" cy="35" r="1.5" fill="#FFFFFF" />

      {/* Wide flat nose */}
      <ellipse cx="32" cy="48" rx="7" ry="5" fill={c.nose} />
      <ellipse cx="28" cy="48" rx="2" ry="2.5" fill="#1A1A1A" />
      <ellipse cx="36" cy="48" rx="2" ry="2.5" fill="#1A1A1A" />

      {/* Jowls */}
      <ellipse cx="20" cy="52" rx="6" ry="4" fill={c.secondary} />
      <ellipse cx="44" cy="52" rx="6" ry="4" fill={c.secondary} />
    </svg>
  );
}

/**
 * Miniature Pinscher - Knight
 * Sleek head, alert cropped ears, noble expression
 */
export function MinPinSvg({ color, size = 64 }: DogSvgProps) {
  const c = getColors(color);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Alert pointed ears */}
      <polygon points="12,8 20,28 4,28" fill={c.primary} />
      <polygon points="14,12 18,26 8,26" fill={c.tongue} />
      <polygon points="52,8 60,28 44,28" fill={c.primary} />
      <polygon points="50,12 56,26 46,26" fill={c.tongue} />

      {/* Sleek elongated head */}
      <ellipse cx="32" cy="38" rx="20" ry="22" fill={c.primary} />

      {/* Tan markings (characteristic of min pins) */}
      <ellipse cx="32" cy="48" rx="12" ry="10" fill={c.secondary} />
      <circle cx="22" cy="32" r="4" fill={c.secondary} />
      <circle cx="42" cy="32" r="4" fill={c.secondary} />

      {/* Alert eyes */}
      <ellipse cx="24" cy="34" rx="5" ry="6" fill="#FFFFFF" />
      <ellipse cx="40" cy="34" rx="5" ry="6" fill="#FFFFFF" />
      <ellipse cx="25" cy="35" rx="3" ry="4" fill={c.eyes} />
      <ellipse cx="41" cy="35" rx="3" ry="4" fill={c.eyes} />
      <circle cx="26" cy="33" r="1.5" fill="#FFFFFF" />
      <circle cx="42" cy="33" r="1.5" fill="#FFFFFF" />

      {/* Refined nose */}
      <ellipse cx="32" cy="48" rx="5" ry="4" fill={c.nose} />
      <ellipse cx="32" cy="47" rx="2" ry="1" fill="#555555" />

      {/* Confident smile */}
      <path d="M26 52 Q32 56 38 52" stroke={c.nose} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Miniature Schnauzer - Bishop
 * Rectangular head, bushy eyebrows, distinguished beard
 */
export function SchnauzerSvg({ color, size = 64 }: DogSvgProps) {
  const c = getColors(color);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Folded ears */}
      <ellipse cx="10" cy="20" rx="8" ry="10" fill={c.primary} />
      <ellipse cx="54" cy="20" rx="8" ry="10" fill={c.primary} />

      {/* Rectangular head */}
      <rect x="12" y="14" width="40" height="36" rx="8" fill={c.primary} />

      {/* Bushy eyebrows */}
      <ellipse cx="20" cy="26" rx="8" ry="4" fill={c.secondary} />
      <ellipse cx="44" cy="26" rx="8" ry="4" fill={c.secondary} />

      {/* Eyes peeking from under eyebrows */}
      <ellipse cx="20" cy="30" rx="4" ry="4" fill="#FFFFFF" />
      <ellipse cx="44" cy="30" rx="4" ry="4" fill="#FFFFFF" />
      <circle cx="21" cy="31" r="2.5" fill={c.eyes} />
      <circle cx="45" cy="31" r="2.5" fill={c.eyes} />
      <circle cx="22" cy="30" r="1" fill="#FFFFFF" />
      <circle cx="46" cy="30" r="1" fill="#FFFFFF" />

      {/* Schnauzer muzzle/beard */}
      <rect x="20" y="36" width="24" height="20" rx="6" fill={c.secondary} />
      <ellipse cx="32" cy="58" rx="10" ry="6" fill={c.secondary} />

      {/* Nose */}
      <ellipse cx="32" cy="42" rx="5" ry="4" fill={c.nose} />
      <ellipse cx="32" cy="41" rx="2" ry="1" fill="#555555" />

      {/* Mustache effect */}
      <path d="M22 46 Q27 44 32 46 Q37 44 42 46" stroke={c.accent} strokeWidth="2" fill="none" />
    </svg>
  );
}

/**
 * Papillon - Queen
 * Butterfly wing ears with long fur, elegant and delicate
 */
export function PapillonSvg({ color, size = 64 }: DogSvgProps) {
  const c = getColors(color);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Butterfly wing ears - the signature feature! */}
      {/* Left ear */}
      <ellipse cx="10" cy="20" rx="12" ry="18" fill={c.primary} />
      <ellipse cx="8" cy="18" rx="8" ry="12" fill="#FFFFFF" />
      <ellipse cx="6" cy="16" rx="4" ry="6" fill={c.primary} />

      {/* Right ear */}
      <ellipse cx="54" cy="20" rx="12" ry="18" fill={c.primary} />
      <ellipse cx="56" cy="18" rx="8" ry="12" fill="#FFFFFF" />
      <ellipse cx="58" cy="16" rx="4" ry="6" fill={c.primary} />

      {/* Delicate head */}
      <ellipse cx="32" cy="40" rx="18" ry="18" fill="#FFFFFF" />

      {/* Face markings */}
      <ellipse cx="32" cy="32" rx="6" ry="8" fill={c.primary} />

      {/* Large elegant eyes */}
      <ellipse cx="24" cy="38" rx="5" ry="6" fill="#FFFFFF" />
      <ellipse cx="40" cy="38" rx="5" ry="6" fill="#FFFFFF" />
      <ellipse cx="25" cy="39" rx="3" ry="4" fill={c.eyes} />
      <ellipse cx="41" cy="39" rx="3" ry="4" fill={c.eyes} />
      <circle cx="26" cy="37" r="1.5" fill="#FFFFFF" />
      <circle cx="42" cy="37" r="1.5" fill="#FFFFFF" />

      {/* Refined small nose */}
      <ellipse cx="32" cy="48" rx="3" ry="2.5" fill={c.nose} />

      {/* Delicate smile */}
      <path d="M28 52 Q32 55 36 52" stroke={c.nose} strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* Crown/tiara for the Queen */}
      <path d="M24 24 L28 18 L32 22 L36 18 L40 24" stroke={c.collar} strokeWidth="2" fill="none" />
      <circle cx="28" cy="18" r="2" fill={c.collar} />
      <circle cx="32" cy="22" r="2" fill={c.collar} />
      <circle cx="36" cy="18" r="2" fill={c.collar} />
    </svg>
  );
}

/**
 * Cavalier King Charles Spaniel - King
 * Floppy silky ears, round gentle eyes, regal expression
 */
export function CavalierSvg({ color, size = 64 }: DogSvgProps) {
  const c = getColors(color);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Crown for the King! */}
      <path d="M20 12 L24 4 L32 10 L40 4 L44 12 Z" fill={c.collar} />
      <rect x="20" y="12" width="24" height="6" fill={c.collar} />
      <circle cx="24" cy="4" r="2" fill="#FF6B6B" />
      <circle cx="32" cy="10" r="2" fill="#4ECDC4" />
      <circle cx="40" cy="4" r="2" fill="#FF6B6B" />

      {/* Long floppy silky ears */}
      <ellipse cx="8" cy="36" rx="10" ry="20" fill={c.primary} />
      <ellipse cx="6" cy="40" rx="6" ry="14" fill={c.secondary} />
      <ellipse cx="56" cy="36" rx="10" ry="20" fill={c.primary} />
      <ellipse cx="58" cy="40" rx="6" ry="14" fill={c.secondary} />

      {/* Round gentle head */}
      <ellipse cx="32" cy="38" rx="20" ry="20" fill="#FFFFFF" />

      {/* Characteristic markings */}
      <ellipse cx="32" cy="30" rx="8" ry="10" fill={c.primary} />
      <circle cx="20" cy="36" r="6" fill={c.primary} />
      <circle cx="44" cy="36" r="6" fill={c.primary} />

      {/* Large round gentle eyes */}
      <ellipse cx="24" cy="38" rx="6" ry="7" fill="#FFFFFF" />
      <ellipse cx="40" cy="38" rx="6" ry="7" fill="#FFFFFF" />
      <ellipse cx="25" cy="39" rx="4" ry="5" fill={c.eyes} />
      <ellipse cx="41" cy="39" rx="4" ry="5" fill={c.eyes} />
      <circle cx="26" cy="37" r="2" fill="#FFFFFF" />
      <circle cx="42" cy="37" r="2" fill="#FFFFFF" />

      {/* Soft nose */}
      <ellipse cx="32" cy="50" rx="4" ry="3" fill={c.nose} />
      <ellipse cx="32" cy="49" rx="1.5" ry="1" fill="#555555" />

      {/* Gentle smile */}
      <path d="M26 54 Q32 58 38 54" stroke={c.nose} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Get the appropriate dog SVG component for a piece type
 */
export function getDogComponent(type: PieceType): React.FC<DogSvgProps> {
  switch (type) {
    case 'pawn': return ChihuahuaSvg;
    case 'rook': return FrenchBulldogSvg;
    case 'knight': return MinPinSvg;
    case 'bishop': return SchnauzerSvg;
    case 'queen': return PapillonSvg;
    case 'king': return CavalierSvg;
    default: return ChihuahuaSvg;
  }
}

/**
 * Dog breed names for display
 */
export const DOG_BREED_NAMES: Record<PieceType, string> = {
  pawn: 'Chihuahua',
  rook: 'French Bulldog',
  knight: 'Min Pin',
  bishop: 'Schnauzer',
  queen: 'Papillon',
  king: 'Cavalier',
};
