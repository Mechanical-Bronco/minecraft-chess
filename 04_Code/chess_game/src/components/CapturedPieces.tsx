'use client';

/**
 * CapturedPieces Component
 * Displays captured pieces for each player in a 2D HUD overlay
 */

import React, { useMemo } from 'react';
import { useGame } from '@/game/GameContext';
import styles from '@/styles/CapturedPieces.module.css';

// Unicode chess symbols
const PIECE_SYMBOLS: Record<string, { white: string; black: string }> = {
    p: { white: '\u2659', black: '\u265F' }, // Pawn
    n: { white: '\u2658', black: '\u265E' }, // Knight
    b: { white: '\u2657', black: '\u265D' }, // Bishop
    r: { white: '\u2656', black: '\u265C' }, // Rook
    q: { white: '\u2655', black: '\u265B' }, // Queen
};

// Piece values for sorting (display higher value pieces first)
const PIECE_VALUES: Record<string, number> = {
    q: 9, r: 5, b: 3, n: 3, p: 1
};

interface CapturedPiecesProps {
    player: 'white' | 'black';
}

export default function CapturedPieces({ player }: CapturedPiecesProps) {
    const { moveHistory } = useGame();

    // Derive captured pieces from move history
    const capturedPieces = useMemo(() => {
        const captures: string[] = [];

        moveHistory.forEach(move => {
            if (move.captured) {
                // If white moved and captured, white captured a black piece
                // If black moved and captured, black captured a white piece
                const capturedByWhite = move.color === 'w';
                if ((player === 'white' && capturedByWhite) ||
                    (player === 'black' && !capturedByWhite)) {
                    captures.push(move.captured);
                }
            }
        });

        // Sort by piece value (descending) for better display
        return captures.sort((a, b) => PIECE_VALUES[b] - PIECE_VALUES[a]);
    }, [moveHistory, player]);

    // Calculate material advantage
    const materialValue = useMemo(() => {
        return capturedPieces.reduce((sum, piece) => sum + (PIECE_VALUES[piece] || 0), 0);
    }, [capturedPieces]);

    if (capturedPieces.length === 0) return null;

    // Captured pieces are the opponent's color (what the player took)
    const capturedColor = player === 'white' ? 'black' : 'white';

    return (
        <div className={`${styles.container} ${styles[player]}`}>
            <div className={styles.pieces}>
                {capturedPieces.map((piece, index) => (
                    <span key={index} className={styles.piece}>
                        {PIECE_SYMBOLS[piece]?.[capturedColor] || piece}
                    </span>
                ))}
            </div>
            {materialValue > 0 && (
                <span className={styles.advantage}>+{materialValue}</span>
            )}
        </div>
    );
}
