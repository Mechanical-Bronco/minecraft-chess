'use client';

import React from 'react';
import { useGame } from '@/game/GameContext';
import styles from '@/styles/GameOverModal.module.css';

export default function GameOverModal() {
    const { isGameOver, isCheckmate, isDraw, turn, resetGame, undoMove } = useGame();

    if (!isGameOver) return null;

    let title = "Game Over";
    let subtitle = "The game has ended.";

    if (isCheckmate) {
        title = turn === 'w' ? "You Lost!" : "You Won!";
        subtitle = turn === 'w' ? "Black detected a checkmate." : "White checkmated Black.";
    } else if (isDraw) {
        title = "Draw";
        subtitle = "Stalemate or insufficient material.";
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.subtitle}>{subtitle}</p>

                <div className={styles.actions}>
                    <button
                        className={styles.button}
                        onClick={() => undoMove()}
                    >
                        ↩️ Undo Last Move
                    </button>
                    <button
                        className={`${styles.button} ${styles.buttonPrimary}`}
                        onClick={resetGame}
                    >
                        ✨ New Game
                    </button>
                </div>
            </div>
        </div>
    );
}
