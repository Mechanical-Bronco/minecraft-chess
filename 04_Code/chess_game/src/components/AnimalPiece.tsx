'use client';

/**
 * AnimalPiece Component
 * Renders cute pet photos on 3D coins
 * Dogs = one player, Cats = other player
 */

import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { PieceType, PieceColor } from '@/game/types';

interface AnimalPieceProps {
  type: PieceType;
  color: PieceColor;
  position: [number, number, number];
  onClick?: () => void;
}

// Coin sizes for each piece type (maintains chess hierarchy)
const PIECE_SIZES: Record<PieceType, { radius: number; height: number }> = {
  king:   { radius: 0.42, height: 0.15 },
  queen:  { radius: 0.40, height: 0.14 },
  bishop: { radius: 0.35, height: 0.12 },
  knight: { radius: 0.35, height: 0.12 },
  rook:   { radius: 0.35, height: 0.12 },
  pawn:   { radius: 0.28, height: 0.10 },
};

// Coin colors
const DOG_COIN_COLOR = '#C9A66B'; // Golden/brass for dogs
const CAT_COIN_COLOR = '#7B8B9A'; // Silver/steel for cats

export default function AnimalPiece({ type, color, position, onClick }: AnimalPieceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetPos = useMemo(() => new THREE.Vector3(...position), [position]);

  // Load pet image texture
  const texturePath = color === 'white' ? '/images/pets/dog.jpg' : '/images/pets/cat.jpg';
  const texture = useLoader(TextureLoader, texturePath);

  // Configure texture for circular display
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
  }, [texture]);

  const { radius, height } = PIECE_SIZES[type];
  const coinColor = color === 'white' ? DOG_COIN_COLOR : CAT_COIN_COLOR;

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

  // Create circular mask geometry for the image
  const imageGeometry = useMemo(() => {
    return new THREE.CircleGeometry(radius * 0.85, 32);
  }, [radius]);

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
      {/* Coin base (cylinder) */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 32]} />
        <meshStandardMaterial
          color={coinColor}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Coin rim (slightly larger, thinner ring for visual depth) */}
      <mesh position={[0, height / 2, 0]}>
        <torusGeometry args={[radius, 0.02, 8, 32]} />
        <meshStandardMaterial
          color={coinColor}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Pet image on top of coin */}
      <mesh
        position={[0, height + 0.001, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={imageGeometry}
      >
        <meshBasicMaterial
          map={texture}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Decorative ring around image */}
      <mesh position={[0, height + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.85, radius * 0.95, 32]} />
        <meshStandardMaterial
          color={color === 'white' ? '#FFD700' : '#C0C0C0'}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Crown indicator for King */}
      {type === 'king' && (
        <mesh position={[0, height + 0.08, 0]}>
          <cylinderGeometry args={[0.08, 0.10, 0.06, 6]} />
          <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.2} />
        </mesh>
      )}

      {/* Tiara indicator for Queen */}
      {type === 'queen' && (
        <mesh position={[0, height + 0.06, 0]}>
          <coneGeometry args={[0.06, 0.08, 5]} />
          <meshStandardMaterial color="#E5E4E2" metalness={0.8} roughness={0.2} />
        </mesh>
      )}
    </group>
  );
}
