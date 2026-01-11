import { useMemo, memo, useRef, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PieceType, PieceColor } from '@/game/types';
import { getPieceDefinition, VoxelBlock } from '@/game/pieceDefinitions';
import { usePieceStyle, PieceStyle } from '@/game/pieceStyleContext';
import { createMergedVoxelGeometry } from '@/game/geometryUtils';
import AnimalPiece from './AnimalPiece';

interface ChessPieceProps {
    type: PieceType;
    color: PieceColor;
    position: [number, number, number]; // Target position
    onClick?: () => void;
}

/**
 * Voxel-based chess piece (Simple/Advanced styles)
 */
const VoxelPiece = memo(({ type, color, position, onClick }: ChessPieceProps) => {
    const { style } = usePieceStyle();
    const groupRef = useRef<THREE.Group>(null);
    const targetPos = useMemo(() => new THREE.Vector3(...position), [position]);

    // Handle smooth movement
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.position.lerp(targetPos, 0.15);
        }
    });

    // Set initial position immediately
    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.position.copy(targetPos);
        }
    }, []);

    // VoxelPiece is only rendered for SIMPLE/ADVANCED styles, never DOGS
    const voxelStyle = style === PieceStyle.ADVANCED ? 'advanced' : 'simple';
    const pieceDefinition = useMemo(
        () => getPieceDefinition(type, color, voxelStyle),
        [type, color, voxelStyle]
    );

    // Split voxels into standard and emissive for merging
    const { standardVoxels, emissiveVoxels } = useMemo(() => {
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
        () => createMergedVoxelGeometry(standardVoxels),
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
        </group>
    );
});

VoxelPiece.displayName = 'VoxelPiece';

/**
 * Loading placeholder while 3D models load
 */
function PieceLoadingFallback({ position }: { position: [number, number, number] }) {
    return (
        <mesh position={position}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial color="#888888" transparent opacity={0.5} />
        </mesh>
    );
}

/**
 * Main ChessPiece component
 * Renders voxels (Simple/Advanced) or 3D animal models (Dogs/Cats)
 */
const ChessPiece = memo(({ type, color, position, onClick }: ChessPieceProps) => {
    const { style } = usePieceStyle();

    // Use 3D animal models for DOGS style
    if (style === PieceStyle.DOGS) {
        return (
            <Suspense fallback={<PieceLoadingFallback position={position} />}>
                <AnimalPiece
                    type={type}
                    color={color}
                    position={position}
                    onClick={onClick}
                />
            </Suspense>
        );
    }

    // Use voxel rendering for Simple/Advanced styles
    return (
        <VoxelPiece
            type={type}
            color={color}
            position={position}
            onClick={onClick}
        />
    );
});

ChessPiece.displayName = 'ChessPiece';

export default ChessPiece;
