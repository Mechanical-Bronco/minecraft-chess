import { useMemo, memo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PieceType, PieceColor } from '@/game/types';
import { getPieceDefinition, VoxelBlock } from '@/game/pieceDefinitions';
import { usePieceStyle } from '@/game/pieceStyleContext';
import { createMergedVoxelGeometry } from '@/game/geometryUtils';

interface ChessPieceProps {
    type: PieceType;
    color: PieceColor;
    position: [number, number, number]; // Target position
    onClick?: () => void;
}

/**
 * Chess piece built from merged geometries for performance
 */
const ChessPiece = memo(({ type, color, position, onClick }: ChessPieceProps) => {
    const { style } = usePieceStyle();
    const groupRef = useRef<THREE.Group>(null);
    const targetPos = useMemo(() => new THREE.Vector3(...position), [position]);

    // Handle smooth movement
    useFrame((state, delta) => {
        if (groupRef.current) {
            // Lerp position for smooth movement
            groupRef.current.position.lerp(targetPos, 0.15);
        }
    });

    // Set initial position immediately to avoid sliding from [0,0,0] on mount
    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.position.copy(targetPos);
        }
    }, []);

    const pieceDefinition = useMemo(
        () => getPieceDefinition(type, color, style),
        [type, color, style]
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
    const standardGeometry = useMemo(() => createMergedVoxelGeometry(standardVoxels), [standardVoxels]);
    const emissiveGeometry = useMemo(() => createMergedVoxelGeometry(emissiveVoxels), [emissiveVoxels]);

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
            {emissiveVoxels.length > 0 && (
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

ChessPiece.displayName = 'ChessPiece';

export default ChessPiece;
