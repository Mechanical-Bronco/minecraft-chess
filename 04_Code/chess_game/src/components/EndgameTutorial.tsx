'use client';

/**
 * EndgameTutorial Component
 * Teaches basic endgame principles with interactive examples
 */

import React, { useState, useMemo } from 'react';
import styles from '@/styles/OpeningTutorial.module.css';

// Unicode chess pieces
const PIECE_SYMBOLS: Record<string, string> = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
};

interface Endgame {
    id: string;
    title: string;
    description: string;
    keyPoint: string;
    position: {
        fen: string;
        highlights: string[];
        explanation: string;
    };
}

const ENDGAMES: Endgame[] = [
    {
        id: 'kq-mate',
        title: 'Queen Checkmate',
        description: 'King and Queen vs lone King is the easiest checkmate to learn. The queen can control many squares, so use it to push the enemy king to the edge of the board, then bring your king close to deliver mate.',
        keyPoint: 'Push the king to the edge, then bring your king to help.',
        position: {
            fen: '7k/5Q2/6K1/8/8/8/8/8 w - - 0 1',
            highlights: ['f7', 'g6', 'h8'],
            explanation: 'Qg7# is checkmate! The queen covers all escape squares while the king guards g7.'
        }
    },
    {
        id: 'kr-mate',
        title: 'Rook Checkmate',
        description: 'King and Rook vs lone King requires more precision. Use your king to cut off squares and push the enemy king to the edge. The rook then delivers mate on the back rank.',
        keyPoint: 'Use your king actively - the rook alone cannot force mate.',
        position: {
            fen: '6k1/R7/6K1/8/8/8/8/8 w - - 0 1',
            highlights: ['a7', 'g6', 'g8'],
            explanation: 'Ra8# is checkmate! The rook controls the back rank, the king prevents escape via f7/g7.'
        }
    },
    {
        id: 'opposition',
        title: 'The Opposition',
        description: 'Opposition is when kings face each other with one square between them. The player NOT to move has the opposition and can force the other king to give way. This is crucial in king and pawn endgames!',
        keyPoint: 'The player who must move loses the opposition.',
        position: {
            fen: '8/8/8/3k4/8/3K4/3P4/8 w - - 0 1',
            highlights: ['d3', 'd5', 'd2'],
            explanation: 'White plays Ke3! After Ke5, White plays Kd3 taking the opposition. This wins the pawn race.'
        }
    },
    {
        id: 'passed-pawn',
        title: 'Passed Pawns',
        description: 'A passed pawn has no enemy pawns blocking or attacking its path to promotion. Passed pawns are extremely valuable in endgames - they tie down enemy pieces and threaten to become a queen!',
        keyPoint: 'Passed pawns must be pushed! They grow stronger as they advance.',
        position: {
            fen: '8/5k2/8/3P4/8/8/8/4K3 w - - 0 1',
            highlights: ['d5', 'd6', 'd7', 'd8'],
            explanation: 'The d-pawn is passed - no black pawns can stop it. White plays d6, d7, d8=Q!'
        }
    },
    {
        id: 'king-activity',
        title: 'King Activity',
        description: 'In the endgame, the king transforms from a piece to protect into a powerful attacker! With fewer pieces on the board, the king can safely march up and help attack pawns, support passed pawns, or deliver checkmate.',
        keyPoint: 'Activate your king early in the endgame - it\'s worth about 4 pawns!',
        position: {
            fen: '8/8/4k3/8/3K4/8/4P3/8 w - - 0 1',
            highlights: ['d4', 'e6', 'e2'],
            explanation: 'White\'s active king on d4 supports the e-pawn. Ke5! fights for space and prepares to escort the pawn.'
        }
    },
];

/**
 * Parse FEN string to get board position
 */
function parseFen(fen: string): (string | null)[][] {
    const board: (string | null)[][] = [];
    const ranks = fen.split(' ')[0].split('/');

    for (const rank of ranks) {
        const row: (string | null)[] = [];
        for (const char of rank) {
            if (/\d/.test(char)) {
                for (let i = 0; i < parseInt(char); i++) {
                    row.push(null);
                }
            } else {
                row.push(char);
            }
        }
        board.push(row);
    }

    return board;
}

interface MiniBoardProps {
    fen: string;
    highlights: string[];
}

/**
 * Mini chess board visualization
 */
function MiniBoard({ fen, highlights }: MiniBoardProps) {
    const board = useMemo(() => parseFen(fen), [fen]);
    const highlightSet = useMemo(() => new Set(highlights), [highlights]);

    const isHighlighted = (rank: number, file: number): boolean => {
        const square = String.fromCharCode('a'.charCodeAt(0) + file) + (8 - rank);
        return highlightSet.has(square);
    };

    const isLightSquare = (rank: number, file: number): boolean => {
        return (rank + file) % 2 === 1;
    };

    return (
        <div className={styles.miniBoard}>
            {board.map((row, rank) => (
                <div key={rank} className={styles.boardRow}>
                    {row.map((piece, file) => {
                        const light = isLightSquare(rank, file);
                        const highlighted = isHighlighted(rank, file);

                        return (
                            <div
                                key={file}
                                className={`
                                    ${styles.square}
                                    ${light ? styles.lightSquare : styles.darkSquare}
                                    ${highlighted ? styles.goodHighlight : ''}
                                `}
                            >
                                {piece && (
                                    <span className={styles.piece}>
                                        {PIECE_SYMBOLS[piece] || piece}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

interface EndgameTutorialProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function EndgameTutorial({ isOpen, onClose }: EndgameTutorialProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!isOpen) return null;

    const endgame = ENDGAMES[currentIndex];

    const handlePrev = () => {
        setCurrentIndex(i => Math.max(0, i - 1));
    };

    const handleNext = () => {
        setCurrentIndex(i => Math.min(ENDGAMES.length - 1, i + 1));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
    };

    return (
        <div className={styles.overlay} onClick={onClose} onKeyDown={handleKeyDown} tabIndex={0}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Endgame Basics</h2>
                    <button className={styles.closeButton} onClick={onClose}>X</button>
                </div>

                {/* Progress */}
                <div className={styles.progress}>
                    {ENDGAMES.map((_, i) => (
                        <button
                            key={i}
                            className={`${styles.dot} ${i === currentIndex ? styles.activeDot : ''}`}
                            onClick={() => setCurrentIndex(i)}
                        />
                    ))}
                </div>

                {/* Main Content - Side by Side */}
                <div className={styles.mainContent}>
                    {/* Left side - Text content */}
                    <div className={styles.content}>
                        <h3 className={styles.principleTitle}>
                            {currentIndex + 1}. {endgame.title}
                        </h3>
                        <p className={styles.description}>{endgame.description}</p>

                        <div className={styles.tips}>
                            <h4>Key Point:</h4>
                            <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>{endgame.keyPoint}</p>
                        </div>
                    </div>

                    {/* Right side - Board */}
                    <div className={styles.boardSection}>
                        <MiniBoard fen={endgame.position.fen} highlights={endgame.position.highlights} />
                        <p className={`${styles.caption} ${styles.goodCaption}`}>
                            {endgame.position.explanation}
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <div className={styles.navigation}>
                    <button
                        className={styles.navButton}
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                    >
                        Previous
                    </button>
                    <span className={styles.pageInfo}>
                        {currentIndex + 1} / {ENDGAMES.length}
                    </span>
                    <button
                        className={styles.navButton}
                        onClick={handleNext}
                        disabled={currentIndex === ENDGAMES.length - 1}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
