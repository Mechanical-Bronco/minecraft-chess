import { useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { BOARD_SIZE, SQUARE_SIZE, COLORS } from '@/game/constants';
import ChessPiece from './ChessPiece';
import { PieceType, PieceColor, indexToSquare } from '@/game/types';
import { useGame } from '@/game/GameContext';
import { Square as ChessSquareName } from 'chess.js';
import { createMergedVoxelGeometry } from '@/game/geometryUtils';

interface SquareProps {
    position: [number, number, number];
    isSelected: boolean;
    isValidMove: boolean;
    onClick: () => void;
}

/**
 * Clickable hitbox and highlight overlay for a square.
 * This component does NOT render the base grass/dirt block (those are merged).
 */
function SquareOverlay({ position, isSelected, isValidMove, onClick }: SquareProps) {
    return (
        <group onClick={(e) => { e.stopPropagation(); onClick(); }}>
            {/* Invisible Hitbox for Raycasting */}
            <mesh position={position}>
                <boxGeometry args={[SQUARE_SIZE, 0.2, SQUARE_SIZE]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {/* Selection Highlight */}
            {isSelected && (
                <mesh position={[position[0], position[1] + 0.01, position[2]]}>
                    <boxGeometry args={[SQUARE_SIZE * 0.95, 0.21, SQUARE_SIZE * 0.95]} />
                    <meshStandardMaterial
                        color={COLORS.SELECTED}
                        transparent
                        opacity={0.4}
                    />
                </mesh>
            )}

            {/* Valid move indicator */}
            {isValidMove && (
                <mesh position={[position[0], position[1] + 0.15, position[2]]}>
                    <boxGeometry args={[SQUARE_SIZE * 0.3, 0.1, SQUARE_SIZE * 0.3]} />
                    <meshStandardMaterial
                        color={COLORS.HIGHLIGHT}
                        transparent
                        opacity={0.8}
                        emissive={COLORS.HIGHLIGHT}
                        emissiveIntensity={0.5}
                    />
                </mesh>
            )}
        </group>
    );
}

/**
 * Chess board grid component
 */
export default function ChessBoard() {
    const { pieces: gamePieces, selectedSquare, validMoves, selectSquare } = useGame();

    // Data for all 64 squares
    const squareData = useMemo(() => {
        const result = [];
        for (let rank = 0; rank < BOARD_SIZE; rank++) {
            for (let file = 0; file < BOARD_SIZE; file++) {
                const squareName = indexToSquare(file, rank) as ChessSquareName;
                const isLight = (rank + file) % 2 !== 0;
                const x = (file - BOARD_SIZE / 2 + 0.5) * SQUARE_SIZE;
                const z = (rank - BOARD_SIZE / 2 + 0.5) * SQUARE_SIZE;
                const y = 0;
                const color = isLight ? COLORS.GRASS_LIGHT : COLORS.DIRT_LIGHT;

                result.push({
                    key: squareName,
                    squareName,
                    position: [x, y, z] as [number, number, number],
                    color,
                    size: [SQUARE_SIZE, 0.2, SQUARE_SIZE] as [number, number, number],
                });
            }
        }
        return result;
    }, []);

    // Create a single merged geometry for the whole board base
    const boardGeometry = useMemo(() => {
        return createMergedVoxelGeometry(squareData.map(s => ({
            position: s.position,
            size: s.size,
            color: s.color
        })));
    }, [squareData]);

    // Map pieces to 3D components
    const pieceComponents = useMemo(() => {
        const typeMap: Record<string, PieceType> = {
            'p': 'pawn', 'r': 'rook', 'n': 'knight', 'b': 'bishop', 'q': 'queen', 'k': 'king'
        };

        return gamePieces.map((piece) => {
            const fileIndex = piece.square.charCodeAt(0) - 'a'.charCodeAt(0);
            const rankIndex = parseInt(piece.square[1]) - 1;

            const x = (fileIndex - BOARD_SIZE / 2 + 0.5) * SQUARE_SIZE;
            const z = (rankIndex - BOARD_SIZE / 2 + 0.5) * SQUARE_SIZE;
            const y = 0.3;

            return {
                ...piece,
                type: typeMap[piece.type] || piece.type as PieceType,
                color: piece.color === 'w' ? 'white' as PieceColor : 'black' as PieceColor,
                position: [x, y, z] as [number, number, number],
            };
        });
    }, [gamePieces]);

    const isValidMove = useCallback((squareName: string) => {
        return validMoves.some(m => m.to === squareName);
    }, [validMoves]);

    return (
        <group>
            {/* Merged Static Board Base */}
            <mesh geometry={boardGeometry} receiveShadow>
                <meshStandardMaterial vertexColors roughness={0.8} metalness={0.2} />
            </mesh>

            {/* Interactive Overlays & Hitboxes */}
            {squareData.map((square) => (
                <SquareOverlay
                    key={square.key}
                    position={square.position}
                    isSelected={selectedSquare === square.squareName}
                    isValidMove={isValidMove(square.squareName)}
                    onClick={() => selectSquare(square.squareName as ChessSquareName)}
                />
            ))}

            {/* Chess pieces with persistent IDs for animations */}
            {pieceComponents.map((piece) => (
                <ChessPiece
                    key={piece.id}
                    type={piece.type}
                    color={piece.color}
                    position={piece.position}
                    onClick={() => selectSquare(piece.square as ChessSquareName)}
                />
            ))}
        </group>
    );
}
