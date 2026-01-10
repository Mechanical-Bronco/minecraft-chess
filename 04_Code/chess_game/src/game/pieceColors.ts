/**
 * Piece Color Palette
 * Color schemes for white and black chess pieces
 */

import { PieceColor } from './types';

export interface PieceColorScheme {
    primary: string;
    secondary: string;
    accent: string;
    eyes: string;
}

export const PIECE_COLORS: Record<PieceColor, PieceColorScheme> = {
    white: {
        primary: '#7cbd6b',    // Grass green
        secondary: '#a8a8a8',  // Light stone
        accent: '#ffffff',     // White highlights
        eyes: '#00ffff',       // Cyan glow
    },
    black: {
        primary: '#8b6e4e',    // Dirt brown
        secondary: '#4a4a4a',  // Dark stone
        accent: '#2c2c2c',     // Charcoal
        eyes: '#9b59b6',       // Purple glow
    },
};

/**
 * Get color scheme for a piece
 */
export function getPieceColors(color: PieceColor): PieceColorScheme {
    return PIECE_COLORS[color];
}
