/**
 * Game Constants
 * All magic numbers and configuration values for the chess game
 */

// Board dimensions
export const BOARD_SIZE = 8;
export const SQUARE_SIZE = 1; // Size of each square in 3D units

// Minecraft color palette (HSL-based for vibrant look)
export const COLORS = {
    // Light squares (grass-themed)
    GRASS_LIGHT: '#7cbd6b',
    GRASS_DARK: '#6aad5a',

    // Dark squares (dirt-themed)
    DIRT_LIGHT: '#8b6e4e',
    DIRT_DARK: '#7a5d3d',

    // Accent colors
    STONE: '#7f7f7f',
    WOOD: '#9c7853',
    SKY: '#87ceeb',

    // UI colors
    HIGHLIGHT: '#ffd700', // Gold for valid moves
    SELECTED: '#ff6b6b',  // Red for selected piece
    CHECK: '#ff4757',     // Bright red for check
} as const;

// Camera configuration
export const CAMERA = {
    FOV: 50,
    NEAR: 0.1,
    FAR: 1000,
    POSITION: [12, 12, 12] as [number, number, number],
    LOOK_AT: [0, 0, 0] as [number, number, number],
    ORTHO_ZOOM: 70, // Increased zoom for orthographic view
} as const;

// Lighting configuration
export const LIGHTING = {
    AMBIENT_INTENSITY: 0.6,
    DIRECTIONAL_INTENSITY: 0.8,
    DIRECTIONAL_POSITION: [5, 10, 7] as [number, number, number],
} as const;

// Animation configuration
export const ANIMATION = {
    MOVE_DURATION: 0.3, // seconds
    EASING: 'easeInOutCubic' as const,
} as const;
