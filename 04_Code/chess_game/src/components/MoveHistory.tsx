'use client';

import React, { useEffect, useRef } from 'react';
import { useGame } from '@/game/GameContext';
import styles from '@/styles/MoveHistory.module.css';

export default function MoveHistory() {
    const { moveHistory } = useGame();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new moves are added
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [moveHistory]);

    // Group moves into pairs (White, Black) for standard notation display
    const movePairs = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
        movePairs.push({
            number: Math.floor(i / 2) + 1,
            white: moveHistory[i],
            black: moveHistory[i + 1] || null
        });
    }

    if (movePairs.length === 0) return null;

    return (
        <div className={styles.container}>
            <div className={styles.title}>Move History</div>
            <div className={styles.scrollArea} ref={scrollRef}>
                {movePairs.map((pair) => (
                    <div key={pair.number} className={styles.moveRow}>
                        <span className={styles.moveNumber}>{pair.number}.</span>
                        <span className={styles.moveWhite}>{pair.white.san}</span>
                        <span className={styles.moveBlack}>{pair.black ? pair.black.san : ''}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
