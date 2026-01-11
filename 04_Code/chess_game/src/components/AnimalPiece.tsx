'use client';

/**
 * AnimalPiece Component
 * Renders 3D dog/cat models for chess pieces
 * Dogs = one player, Cats = other player
 */

import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { PieceType, PieceColor } from '@/game/types';

interface AnimalPieceProps {
  type: PieceType;
  color: PieceColor;
  position: [number, number, number];
  onClick?: () => void;
}

// Scale factors for each piece type (maintains chess hierarchy)
const PIECE_SCALES: Record<PieceType, number> = {
  king: 0.018,
  queen: 0.016,
  bishop: 0.014,
  knight: 0.014,
  rook: 0.013,
  pawn: 0.010,
};

// Y offset to place pieces on the board properly
const PIECE_Y_OFFSETS: Record<PieceType, number> = {
  king: 0.1,
  queen: 0.1,
  bishop: 0.08,
  knight: 0.08,
  rook: 0.06,
  pawn: 0.05,
};

// Color palettes for dogs (white/light team) and cats (black/dark team)
const DOG_COLORS = {
  primary: '#D4A574',    // Tan/golden
  secondary: '#8B6914',  // Darker brown
  accent: '#F5DEB3',     // Wheat/cream highlights
};

const CAT_COLORS = {
  primary: '#4A4A4A',    // Dark gray
  secondary: '#2D2D2D',  // Charcoal
  accent: '#6B6B6B',     // Lighter gray highlights
};

export default function AnimalPiece({ type, color, position, onClick }: AnimalPieceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetPos = useMemo(() => new THREE.Vector3(...position), [position]);

  // Dogs for white, Cats for black
  const modelPath = color === 'white' ? '/models/animals/Dog.obj' : '/models/animals/Cat.obj';
  const obj = useLoader(OBJLoader, modelPath);

  // Clone the object so each piece has its own instance
  const clonedObj = useMemo(() => {
    const clone = obj.clone();

    // Apply colors based on team
    const colors = color === 'white' ? DOG_COLORS : CAT_COLORS;

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Create a new material with team colors
        child.material = new THREE.MeshStandardMaterial({
          color: colors.primary,
          roughness: 0.7,
          metalness: 0.1,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return clone;
  }, [obj, color]);

  // Scale based on piece type
  const scale = PIECE_SCALES[type];
  const yOffset = PIECE_Y_OFFSETS[type];

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
      <primitive
        object={clonedObj}
        scale={[scale, scale, scale]}
        position={[0, yOffset, 0]}
        rotation={[0, color === 'white' ? Math.PI : 0, 0]} // Face forward
      />

      {/* Add crown for King */}
      {type === 'king' && (
        <mesh position={[0, yOffset + scale * 120, 0]}>
          <cylinderGeometry args={[scale * 25, scale * 30, scale * 15, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.3} />
        </mesh>
      )}

      {/* Add tiara for Queen */}
      {type === 'queen' && (
        <mesh position={[0, yOffset + scale * 110, 0]}>
          <coneGeometry args={[scale * 20, scale * 25, 6]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.7} roughness={0.2} />
        </mesh>
      )}

      {/* Add mitre/pointed hat for Bishop */}
      {type === 'bishop' && (
        <mesh position={[0, yOffset + scale * 100, 0]}>
          <coneGeometry args={[scale * 12, scale * 30, 4]} />
          <meshStandardMaterial color={color === 'white' ? '#8B4513' : '#4A0080'} />
        </mesh>
      )}
    </group>
  );
}
