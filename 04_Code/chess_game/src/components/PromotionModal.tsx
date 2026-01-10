'use client';

import React from 'react';
import { useGame } from '@/game/GameContext';
import styles from '@/styles/PromotionModal.module.css';

const PIECES = [
    { type: 'queen', label: 'Queen', icon: '👑' },
    { type: 'rook', label: 'Rook', icon: '🏰' },
    { type: 'bishop', label: 'Bishop', icon: '📜' },
    { type: 'knight', label: 'Knight', icon: '🐴' },
];

export default function PromotionModal() {
    const { pendingMove, promotePiece } = useGame();

    if (!pendingMove) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3 className={styles.title}>Promote Pawn</h3>
                <div className={styles.options}>
                    {PIECES.map((piece) => (
                        <div
                            key={piece.type}
                            className={styles.option}
                            onClick={() => promotePiece(piece.type)}
                        >
                            <span className={styles.icon}>{piece.icon}</span>
                            <span className={styles.pieceLabel}>{piece.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
