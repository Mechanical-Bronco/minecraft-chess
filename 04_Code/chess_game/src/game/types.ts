/**
 * TypeScript Type Definitions
 * Type safety for chess game components
 */

import { Vector3 } from 'three';

// 3D position type
export type Position3D = {
    x: number;
    y: number;
    z: number;
};

// Chess square representation
export type ChessSquare = {
    file: string; // a-h
    rank: number; // 1-8
    color: 'light' | 'dark';
    position3D: Position3D;
};

// Piece colors
export type PieceColor = 'white' | 'black';

// Piece types
export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

// Chess piece representation
export type ChessPiece = {
    type: PieceType;
    color: PieceColor;
    square: string; // e.g., 'e4'
};

// Board state
export type BoardState = {
    pieces: ChessPiece[];
    selectedSquare: string | null;
    validMoves: string[];
};

// Helper to convert array to Vector3
export const toVector3 = (arr: [number, number, number]): Vector3 => {
    return new Vector3(arr[0], arr[1], arr[2]);
};

// Helper to get square index from file and rank
export const getSquareIndex = (file: string, rank: number): number => {
    const fileIndex = file.charCodeAt(0) - 'a'.charCodeAt(0);
    return (rank - 1) * 8 + fileIndex;
};

// Helper to get file and rank from square name
export const parseSquare = (square: string): { file: string; rank: number } => {
    return {
        file: square[0],
        rank: parseInt(square[1], 10),
    };
};
// Helper to get square name from indices (0-7)
export const indexToSquare = (file: number, rank: number): string => {
    const fileChar = String.fromCharCode('a'.charCodeAt(0) + file);
    const rankChar = (rank + 1).toString();
    return fileChar + rankChar;
};
// Piece instance for persistent animation tracking
export interface PieceInstance {
    id: string;
    type: PieceType | string; // chess.js uses single letters often
    color: 'w' | 'b' | string;
    square: string;
}
