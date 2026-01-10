/**
 * Piece Voxel Definitions
 * Defines the 3D structure of each chess piece type in both simple and advanced modes
 */

import { PieceType, PieceColor } from './types';
import { getPieceColors } from './pieceColors';

export interface VoxelBlock {
    position: [number, number, number]; // x, y, z
    size: [number, number, number];     // width, height, depth
    color: string;
    emissive?: string;  // For glowing effects
    emissiveIntensity?: number;
}

export interface PieceDefinition {
    type: PieceType;
    color: PieceColor;
    voxels: VoxelBlock[];
    height: number;
}

/**
 * Generate simple (lightly stylized) piece voxels
 */
function getSimplePieceVoxels(type: PieceType, color: PieceColor): VoxelBlock[] {
    const colors = getPieceColors(color);
    const { primary, secondary, accent, eyes } = colors;

    switch (type) {
        case 'pawn':
            return [
                { position: [0, 0.15, 0], size: [0.35, 0.3, 0.35], color: primary },      // base
                { position: [-0.12, 0.05, 0], size: [0.1, 0.1, 0.1], color: secondary },  // left foot
                { position: [0.12, 0.05, 0], size: [0.1, 0.1, 0.1], color: secondary },   // right foot
                { position: [0, 0.5, 0], size: [0.28, 0.3, 0.28], color: primary },       // body
                { position: [0, 0.42, 0], size: [0.3, 0.06, 0.3], color: accent },        // belt
                { position: [-0.18, 0.55, 0], size: [0.08, 0.12, 0.15], color: secondary }, // left shoulder
                { position: [0.18, 0.55, 0], size: [0.08, 0.12, 0.15], color: secondary },  // right shoulder
                { position: [0, 0.75, 0], size: [0.32, 0.3, 0.32], color: secondary },    // head
                { position: [0, 0.72, 0.17], size: [0.06, 0.06, 0.04], color: primary },  // nose
                { position: [0, 0.92, 0], size: [0.24, 0.04, 0.24], color: accent },      // helmet ridge
                // Eyes
                { position: [-0.1, 0.78, 0.17], size: [0.06, 0.06, 0.02], color: eyes, emissive: eyes, emissiveIntensity: 0.5 },
                { position: [0.1, 0.78, 0.17], size: [0.06, 0.06, 0.02], color: eyes, emissive: eyes, emissiveIntensity: 0.5 },
            ];

        case 'rook':
            return [
                { position: [0, 0.15, 0], size: [0.45, 0.3, 0.45], color: secondary },    // base
                { position: [0, 0.5, 0], size: [0.35, 0.4, 0.35], color: primary },       // tower
                // Corner pillars
                { position: [-0.18, 0.5, -0.18], size: [0.06, 0.4, 0.06], color: accent },
                { position: [0.18, 0.5, -0.18], size: [0.06, 0.4, 0.06], color: accent },
                { position: [-0.18, 0.5, 0.18], size: [0.06, 0.4, 0.06], color: accent },
                { position: [0.18, 0.5, 0.18], size: [0.06, 0.4, 0.06], color: accent },
                // Arrow slits
                { position: [0, 0.55, 0.19], size: [0.06, 0.12, 0.02], color: '#1a1a1a' },
                { position: [0, 0.55, -0.19], size: [0.06, 0.12, 0.02], color: '#1a1a1a' },
                // Door
                { position: [0, 0.22, 0.24], size: [0.1, 0.14, 0.02], color: accent },
                { position: [0, 0.95, 0], size: [0.4, 0.2, 0.4], color: secondary },      // top platform
                // Battlements
                { position: [-0.15, 1.15, -0.15], size: [0.1, 0.15, 0.1], color: primary },
                { position: [0.15, 1.15, -0.15], size: [0.1, 0.15, 0.1], color: primary },
                { position: [-0.15, 1.15, 0.15], size: [0.1, 0.15, 0.1], color: primary },
                { position: [0.15, 1.15, 0.15], size: [0.1, 0.15, 0.1], color: primary },
            ];

        case 'knight':
            return [
                { position: [0, 0.15, 0], size: [0.35, 0.3, 0.35], color: secondary },    // base
                { position: [0, 0.08, 0], size: [0.28, 0.05, 0.38], color: accent },      // hoof base
                { position: [0, 0.45, 0.05], size: [0.25, 0.25, 0.3], color: primary },   // neck
                // Mane
                { position: [0, 0.65, -0.02], size: [0.08, 0.18, 0.08], color: secondary },
                { position: [0, 0.52, -0.06], size: [0.06, 0.14, 0.06], color: secondary },
                { position: [0, 0.42, -0.08], size: [0.05, 0.1, 0.05], color: secondary },
                { position: [0, 0.75, 0.15], size: [0.3, 0.35, 0.25], color: primary },   // head
                // Bridle and harness
                { position: [0, 0.78, 0.28], size: [0.18, 0.03, 0.03], color: accent },   // bridle
                { position: [0, 0.6, 0.18], size: [0.22, 0.03, 0.03], color: accent },    // harness
                // Nostrils
                { position: [-0.06, 0.68, 0.28], size: [0.03, 0.03, 0.02], color: '#1a1a1a' },
                { position: [0.06, 0.68, 0.28], size: [0.03, 0.03, 0.02], color: '#1a1a1a' },
                { position: [-0.08, 0.88, 0.22], size: [0.08, 0.15, 0.08], color: secondary }, // ear left
                { position: [0.08, 0.88, 0.22], size: [0.08, 0.15, 0.08], color: secondary },  // ear right
                // Eyes
                { position: [-0.08, 0.8, 0.28], size: [0.05, 0.05, 0.02], color: eyes, emissive: eyes, emissiveIntensity: 0.4 },
                { position: [0.08, 0.8, 0.28], size: [0.05, 0.05, 0.02], color: eyes, emissive: eyes, emissiveIntensity: 0.4 },
            ];

        case 'bishop':
            return [
                { position: [0, 0.15, 0], size: [0.4, 0.3, 0.4], color: secondary },      // base
                { position: [0, 0.5, 0], size: [0.3, 0.35, 0.3], color: primary },        // body
                // Robe folds
                { position: [-0.18, 0.35, 0], size: [0.05, 0.25, 0.28], color: primary },
                { position: [0.18, 0.35, 0], size: [0.05, 0.25, 0.28], color: primary },
                { position: [0, 0.25, -0.18], size: [0.22, 0.2, 0.05], color: primary },
                // Staff (crozier)
                { position: [-0.22, 0.6, 0], size: [0.04, 0.6, 0.04], color: accent },
                { position: [-0.22, 0.92, 0], size: [0.08, 0.08, 0.04], color: accent },
                { position: [0, 0.7, 0], size: [0.28, 0.05, 0.28], color: accent },       // collar
                { position: [0, 0.85, 0], size: [0.22, 0.25, 0.22], color: primary },     // upper body
                { position: [0, 1.12, 0], size: [0.15, 0.2, 0.15], color: secondary },    // hat cone
                { position: [0, 1.05, 0], size: [0.18, 0.04, 0.18], color: accent },      // hat band
                { position: [0, 1.32, 0], size: [0.08, 0.12, 0.08], color: accent },      // hat tip
                // Face eyes
                { position: [-0.08, 0.52, 0.16], size: [0.05, 0.05, 0.02], color: eyes, emissive: eyes, emissiveIntensity: 0.3 },
                { position: [0.08, 0.52, 0.16], size: [0.05, 0.05, 0.02], color: eyes, emissive: eyes, emissiveIntensity: 0.3 },
            ];

        case 'queen':
            return [
                { position: [0, 0.15, 0], size: [0.45, 0.3, 0.45], color: secondary },    // base
                { position: [0, 0.5, 0], size: [0.32, 0.35, 0.32], color: primary },      // lower body
                // Dress layers
                { position: [-0.22, 0.35, 0], size: [0.08, 0.35, 0.3], color: primary },
                { position: [0.22, 0.35, 0], size: [0.08, 0.35, 0.3], color: primary },
                { position: [0, 0.25, -0.2], size: [0.28, 0.25, 0.06], color: primary },
                { position: [0, 0.88, 0], size: [0.28, 0.3, 0.28], color: primary },      // upper body
                // Necklace
                { position: [0, 0.76, 0.15], size: [0.22, 0.04, 0.02], color: accent },
                { position: [0, 1.18, 0], size: [0.35, 0.15, 0.35], color: secondary },   // crown base
                // Crown points
                { position: [-0.12, 1.38, 0], size: [0.08, 0.15, 0.08], color: accent },
                { position: [0.12, 1.38, 0], size: [0.08, 0.15, 0.08], color: accent },
                { position: [0, 1.38, -0.12], size: [0.08, 0.15, 0.08], color: accent },
                { position: [0, 1.38, 0.12], size: [0.08, 0.15, 0.08], color: accent },
                // Crown gems (between points)
                { position: [-0.08, 1.32, -0.08], size: [0.04, 0.08, 0.04], color: accent },
                { position: [0.08, 1.32, -0.08], size: [0.04, 0.08, 0.04], color: accent },
                { position: [-0.08, 1.32, 0.08], size: [0.04, 0.08, 0.04], color: accent },
                { position: [0.08, 1.32, 0.08], size: [0.04, 0.08, 0.04], color: accent },
                // Eyes
                { position: [-0.08, 0.92, 0.15], size: [0.05, 0.05, 0.02], color: eyes, emissive: eyes, emissiveIntensity: 0.6 },
                { position: [0.08, 0.92, 0.15], size: [0.05, 0.05, 0.02], color: eyes, emissive: eyes, emissiveIntensity: 0.6 },
            ];

        case 'king':
            return [
                { position: [0, 0.15, 0], size: [0.45, 0.3, 0.45], color: secondary },    // base
                { position: [0, 0.5, 0], size: [0.35, 0.4, 0.35], color: primary },       // lower body
                // Cape
                { position: [0, 0.6, -0.22], size: [0.32, 0.5, 0.05], color: accent },
                { position: [0, 0.45, -0.24], size: [0.28, 0.3, 0.03], color: secondary },
                // Belt
                { position: [0, 0.72, 0], size: [0.36, 0.05, 0.36], color: accent },
                { position: [0, 0.98, 0], size: [0.3, 0.35, 0.3], color: primary },       // upper body
                // Beard
                { position: [0, 0.9, 0.18], size: [0.14, 0.1, 0.04], color: secondary },
                { position: [0, 0.85, 0.16], size: [0.1, 0.08, 0.03], color: secondary },
                { position: [0, 1.35, 0], size: [0.38, 0.12, 0.38], color: secondary },   // crown base
                // Crown gems
                { position: [-0.14, 1.42, 0], size: [0.04, 0.06, 0.04], color: accent },
                { position: [0.14, 1.42, 0], size: [0.04, 0.06, 0.04], color: accent },
                { position: [0, 1.42, 0.14], size: [0.04, 0.06, 0.04], color: accent },
                // Cross on top
                { position: [0, 1.52, 0], size: [0.06, 0.18, 0.06], color: accent },      // vertical
                { position: [0, 1.58, 0], size: [0.15, 0.06, 0.06], color: accent },      // horizontal
                // Eyes
                { position: [-0.09, 1.02, 0.16], size: [0.06, 0.06, 0.02], color: eyes, emissive: eyes, emissiveIntensity: 0.7 },
                { position: [0.09, 1.02, 0.16], size: [0.06, 0.06, 0.02], color: eyes, emissive: eyes, emissiveIntensity: 0.7 },
            ];

        default:
            return [];
    }
}

/**
 * Generate advanced (Minecraft mob) piece voxels
 */
function getAdvancedPieceVoxels(type: PieceType, color: PieceColor): VoxelBlock[] {
    const colors = getPieceColors(color);
    const { primary, secondary, accent, eyes } = colors;

    switch (type) {
        case 'pawn': // Steve / Alex character
            return [
                { position: [0, 0.1, 0], size: [0.35, 0.2, 0.35], color: secondary },    // feet/boots
                { position: [0, 0.45, 0], size: [0.3, 0.4, 0.3], color: '#3498db' },     // blue shirt armor
                { position: [0, 0.8, 0], size: [0.3, 0.3, 0.3], color: '#ffdbac' },      // skin tone head
                { position: [0, 0.85, 0.16], size: [0.2, 0.1, 0.02], color: '#4a2511' }, // hair
                // Glowing Eyes
                { position: [-0.08, 0.82, 0.16], size: [0.06, 0.04, 0.02], color: eyes, emissive: eyes, emissiveIntensity: 0.5 },
                { position: [0.08, 0.82, 0.16], size: [0.06, 0.04, 0.02], color: eyes, emissive: eyes, emissiveIntensity: 0.5 },
            ];

        case 'rook': // Iron Golem
            return [
                { position: [0, 0.15, 0], size: [0.5, 0.3, 0.5], color: '#d3d3d3' },     // base
                { position: [0, 0.55, 0], size: [0.4, 0.5, 0.3], color: '#e0e0e0' },     // body
                { position: [-0.28, 0.6, 0], size: [0.15, 0.6, 0.15], color: '#d3d3d3' }, // arm L
                { position: [0.28, 0.6, 0], size: [0.15, 0.6, 0.15], color: '#d3d3d3' },  // arm R
                { position: [0, 0.95, 0.05], size: [0.25, 0.25, 0.25], color: '#e0e0e0' }, // head
                { position: [0, 0.9, 0.18], size: [0.05, 0.12, 0.05], color: '#d3d3d3' },  // nose
                // Eyes
                { position: [-0.07, 1.0, 0.18], size: [0.04, 0.04, 0.02], color: '#ff0000', emissive: '#ff0000', emissiveIntensity: 0.4 },
                { position: [0.07, 1.0, 0.18], size: [0.04, 0.04, 0.02], color: '#ff0000', emissive: '#ff0000', emissiveIntensity: 0.4 },
            ];

        case 'knight': // Horse
            return [
                { position: [0, 0.15, 0], size: [0.4, 0.3, 0.5], color: secondary },     // base/legs
                { position: [0, 0.5, -0.1], size: [0.35, 0.45, 0.4], color: primary },   // body
                { position: [0, 0.9, 0.1], size: [0.25, 0.4, 0.25], color: primary },    // neck
                { position: [0, 1.1, 0.3], size: [0.25, 0.25, 0.4], color: primary },    // head
                { position: [-0.1, 1.3, 0.15], size: [0.08, 0.15, 0.08], color: primary }, // ear L
                { position: [0.1, 1.3, 0.15], size: [0.08, 0.15, 0.08], color: primary },  // ear R
                { position: [0, 0.7, -0.35], size: [0.15, 0.4, 0.15], color: secondary }, // tail
                // Eyes
                { position: [-0.13, 1.15, 0.35], size: [0.05, 0.05, 0.05], color: eyes, emissive: eyes, emissiveIntensity: 0.4 },
                { position: [0.13, 1.15, 0.35], size: [0.05, 0.05, 0.05], color: eyes, emissive: eyes, emissiveIntensity: 0.4 },
            ];

        case 'bishop': // Creeper (stylized)
            return [
                { position: [-0.15, 0.15, -0.15], size: [0.2, 0.3, 0.2], color: primary }, // foot BL
                { position: [0.15, 0.15, -0.15], size: [0.2, 0.3, 0.2], color: primary },  // foot BR
                { position: [-0.15, 0.15, 0.15], size: [0.2, 0.3, 0.2], color: primary },  // foot FL
                { position: [0.15, 0.15, 0.15], size: [0.2, 0.3, 0.2], color: primary },   // foot FR
                { position: [0, 0.75, 0], size: [0.3, 0.9, 0.25], color: primary },        // body
                { position: [0, 1.35, 0], size: [0.45, 0.45, 0.45], color: primary },      // head
                { position: [0, 1.7, 0], size: [0.25, 0.3, 0.25], color: secondary },      // hat base
                { position: [0, 1.95, 0], size: [0.15, 0.2, 0.15], color: accent },        // hat tip
                // Face
                { position: [-0.1, 1.45, 0.23], size: [0.1, 0.1, 0.02], color: '#1a1a1a' }, // eye L
                { position: [0.1, 1.45, 0.23], size: [0.1, 0.1, 0.02], color: '#1a1a1a' },  // eye R
                { position: [0, 1.25, 0.23], size: [0.08, 0.15, 0.02], color: '#1a1a1a' },  // mouth center
            ];

        case 'queen': // Ender Dragon
            return [
                { position: [0, 0.15, 0], size: [0.5, 0.3, 0.6], color: '#1a1a1a' },      // base
                { position: [0, 0.6, 0], size: [0.4, 0.6, 0.5], color: '#1a1a1a' },       // body
                { position: [-0.6, 0.8, -0.1], size: [0.8, 0.1, 0.4], color: '#2a2a2a' },  // wing L
                { position: [0.6, 0.8, -0.1], size: [0.8, 0.1, 0.4], color: '#2a2a2a' },   // wing R
                { position: [0, 1.1, 0.25], size: [0.2, 0.5, 0.2], color: '#1a1a1a' },     // neck
                { position: [0, 1.45, 0.5], size: [0.3, 0.3, 0.5], color: '#1a1a1a' },     // head
                { position: [0, 1.4, 0.8], size: [0.25, 0.15, 0.2], color: '#1a1a1a' },    // jaw
                { position: [-0.1, 1.65, 0.4], size: [0.05, 0.15, 0.05], color: '#2a2a2a' }, // horn L
                { position: [0.1, 1.65, 0.4], size: [0.05, 0.15, 0.05], color: '#2a2a2a' },  // horn R
                // Eyes
                { position: [-0.12, 1.5, 0.72], size: [0.06, 0.06, 0.05], color: '#d455d4', emissive: '#d455d4', emissiveIntensity: 0.8 },
                { position: [0.12, 1.5, 0.72], size: [0.06, 0.06, 0.05], color: '#d455d4', emissive: '#d455d4', emissiveIntensity: 0.8 },
            ];

        case 'king': // Enderman
            return [
                { position: [0, 0.15, 0], size: [0.4, 0.3, 0.4], color: '#1a1a1a' },      // base
                { position: [-0.12, 0.7, 0], size: [0.08, 1.2, 0.08], color: '#0a0a0a' },  // leg L
                { position: [0.12, 0.7, 0], size: [0.08, 1.2, 0.08], color: '#0a0a0a' },   // leg R
                { position: [0, 1.5, 0], size: [0.35, 0.4, 0.3], color: '#1a1a1a' },       // body
                { position: [-0.22, 1.5, 0], size: [0.06, 0.8, 0.06], color: '#0a0a0a' },  // arm L
                { position: [0.22, 1.5, 0], size: [0.06, 0.8, 0.06], color: '#0a0a0a' },   // arm R
                { position: [0, 1.9, 0], size: [0.4, 0.4, 0.4], color: '#1a1a1a' },       // head
                { position: [0, 2.15, 0], size: [0.45, 0.15, 0.45], color: '#d4af37' },    // golden crown base
                { position: [0, 2.25, 0], size: [0.1, 0.2, 0.1], color: '#d4af37' },       // crown tip
                // Eyes
                { position: [-0.1, 1.95, 0.21], size: [0.12, 0.05, 0.02], color: '#d455d4', emissive: '#d455d4', emissiveIntensity: 1.0 },
                { position: [0.1, 1.95, 0.21], size: [0.12, 0.05, 0.02], color: '#d455d4', emissive: '#d455d4', emissiveIntensity: 1.0 },
            ];

        default:
            return [];
    }
}

/**
 * Get piece definition for rendering
 */
export function getPieceDefinition(
    type: PieceType,
    color: PieceColor,
    style: 'simple' | 'advanced'
): PieceDefinition {
    const voxels = style === 'simple'
        ? getSimplePieceVoxels(type, color)
        : getAdvancedPieceVoxels(type, color);

    // Calculate height from voxels
    const height = voxels.reduce((max, voxel) => {
        const voxelTop = voxel.position[1] + voxel.size[1] / 2;
        return Math.max(max, voxelTop);
    }, 0);

    return {
        type,
        color,
        voxels,
        height,
    };
}
