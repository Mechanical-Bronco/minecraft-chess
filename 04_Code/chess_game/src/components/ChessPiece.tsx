import { useMemo, memo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { PieceType, PieceColor } from '@/game/types';
import { getPieceDefinition, VoxelBlock } from '@/game/pieceDefinitions';
import { usePieceStyle, PieceStyle } from '@/game/pieceStyleContext';
import { createMergedVoxelGeometry } from '@/game/geometryUtils';
import { getDogComponent } from './DogPieces';

interface ChessPieceProps {
    type: PieceType;
    color: PieceColor;
    position: [number, number, number]; // Target position
    onClick?: () => void;
}

/**
 * Chess piece - renders as voxels or dog SVG sprites based on style
 */
const ChessPiece = memo(({ type, color, position, onClick }: ChessPieceProps) => {
    const { style } = usePieceStyle();
    const groupRef = useRef<THREE.Group>(null);
    const targetPos = useMemo(() => new THREE.Vector3(...position), [position]);

    // Handle smooth movement
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.position.lerp(targetPos, 0.15);
        }
    });

    // Set initial position immediately to avoid sliding from [0,0,0] on mount
    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.position.copy(targetPos);
        }
    }, []);

    // Only compute voxel data for non-dog styles
    const pieceDefinition = useMemo(
        () => style !== PieceStyle.DOGS ? getPieceDefinition(type, color, style) : null,
        [type, color, style]
    );

    // Split voxels into standard and emissive for merging
    const { standardVoxels, emissiveVoxels } = useMemo(() => {
        if (!pieceDefinition) return { standardVoxels: [], emissiveVoxels: [] };
        const standard: VoxelBlock[] = [];
        const emissive: VoxelBlock[] = [];
        pieceDefinition.voxels.forEach(v => {
            if (v.emissive && v.emissive !== '#000000') {
                emissive.push(v);
            } else {
                standard.push(v);
            }
        });
        return { standardVoxels: standard, emissiveVoxels: emissive };
    }, [pieceDefinition]);

    // Create merged geometries
    const standardGeometry = useMemo(
        () => standardVoxels.length > 0 ? createMergedVoxelGeometry(standardVoxels) : null,
        [standardVoxels]
    );
    const emissiveGeometry = useMemo(
        () => emissiveVoxels.length > 0 ? createMergedVoxelGeometry(emissiveVoxels) : null,
        [emissiveVoxels]
    );

    // Eye color for emissive material
    const eyeColor = useMemo(() => {
        if (emissiveVoxels.length > 0) return emissiveVoxels[0].color;
        return '#000000';
    }, [emissiveVoxels]);

    // Get the dog SVG component for this piece type
    const DogSvg = useMemo(() => getDogComponent(type), [type]);

    return (
        <group
            ref={groupRef}
            onClick={(e) => {
                if (onClick) {
                    e.stopPropagation();
                    onClick();
                }
            }}
        >
            {/* Dog SVG sprite mode */}
            {style === PieceStyle.DOGS && (
                <Html
                    center
                    transform
                    sprite
                    distanceFactor={8}
                    position={[0, 0.6, 0]}
                    style={{
                        pointerEvents: 'none',
                        userSelect: 'none',
                    }}
                >
                    <div style={{
                        filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.4))',
                        transform: 'scale(1.2)',
                    }}>
                        <DogSvg color={color} size={80} />
                    </div>
                </Html>
            )}

            {/* Voxel mode (Simple or Advanced) */}
            {style !== PieceStyle.DOGS && standardGeometry && (
                <>
                    {/* Standard Voxel Mesh */}
                    <mesh geometry={standardGeometry} castShadow>
                        <meshStandardMaterial
                            vertexColors
                            roughness={0.7}
                            metalness={0.1}
                        />
                    </mesh>

                    {/* Emissive Voxel Mesh (Eyes/Glowing parts) */}
                    {emissiveGeometry && (
                        <mesh geometry={emissiveGeometry} castShadow>
                            <meshStandardMaterial
                                color={eyeColor}
                                emissive={eyeColor}
                                emissiveIntensity={1.0}
                                roughness={0.5}
                                metalness={0.2}
                            />
                        </mesh>
                    )}
                </>
            )}
        </group>
    );
});

ChessPiece.displayName = 'ChessPiece';

export default ChessPiece;
