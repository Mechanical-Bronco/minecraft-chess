'use client';

/**
 * OpeningTutorial Component
 * Teaches chess opening principles with interactive examples
 */

import React, { useState, useMemo } from 'react';
import styles from '@/styles/OpeningTutorial.module.css';

// Unicode chess pieces
const PIECE_SYMBOLS: Record<string, string> = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
};

interface Example {
    fen: string;
    highlights: string[];
    caption: string;
}

interface Principle {
    id: string;
    title: string;
    description: string;
    tips: string[];
    goodExample: Example;
    badExample: Example;
}

const PRINCIPLES: Principle[] = [
    {
        id: 'center',
        title: 'Control the Center',
        description: 'The central squares (e4, d4, e5, d5) are the most powerful positions on the board. Pieces placed in or controlling the center can reach more squares and influence more of the game.',
        tips: [
            'Open with 1.e4 or 1.d4 to claim central space',
            'Develop pieces toward the center',
            'Avoid moving pawns on the edge early (a/h files)',
        ],
        goodExample: {
            fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
            highlights: ['e4', 'e5', 'f3', 'c6'],
            caption: 'Both sides control the center with pawns and develop knights toward it'
        },
        badExample: {
            fen: 'rnbqkbnr/pppppppp/8/8/7P/8/PPPPPPP1/RNBQKBNR b KQkq - 0 1',
            highlights: ['h4'],
            caption: '1.h4 wastes a move - it doesn\'t help control the center at all'
        }
    },
    {
        id: 'develop',
        title: 'Develop Your Pieces',
        description: 'Get your knights and bishops into the game quickly! Each piece that stays on its starting square is a piece not helping you. Knights before bishops is often a good rule.',
        tips: [
            'Knights to f3/c3 (or f6/c6 for Black)',
            'Bishops to active diagonals',
            'Don\'t move the same piece twice in the opening',
            'Connect development with center control',
        ],
        goodExample: {
            fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
            highlights: ['f3', 'c4', 'f6', 'c6', 'c5'],
            caption: 'Italian Game - both sides developed knights and bishops actively'
        },
        badExample: {
            fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
            highlights: ['e1', 'b1', 'g1', 'c1', 'f1'],
            caption: 'After 1.e4 e5, White\'s pieces are still sleeping on the back rank'
        }
    },
    {
        id: 'castle',
        title: 'Castle Early',
        description: 'Castling protects your king by tucking it away in the corner and brings your rook toward the center. Try to castle within the first 10 moves!',
        tips: [
            'Castle kingside (O-O) is usually safest',
            'Don\'t move the pawns in front of your castled king',
            'Castle before your opponent can attack your king',
            'Castling also activates your rook!',
        ],
        goodExample: {
            fen: 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 w - - 6 5',
            highlights: ['g1', 'f1', 'g8', 'f8'],
            caption: 'Both kings are safe after castling, rooks are connected'
        },
        badExample: {
            fen: 'r1bqk2r/pppp1Qpp/2n2n2/2b1p3/2B1P3/8/PPPP1PPP/RNB1K2R b KQkq - 0 5',
            highlights: ['e8', 'f7'],
            caption: 'Black didn\'t castle - now the queen attacks f7 (Scholar\'s Mate threat!)'
        }
    },
    {
        id: 'queen',
        title: 'Don\'t Bring Queen Out Early',
        description: 'The queen is your most powerful piece, but bringing her out too early makes her a target. Your opponent will attack her while developing their pieces for free!',
        tips: [
            'Develop minor pieces (knights, bishops) first',
            'The queen usually comes out after castling',
            'Avoid "Queen raids" that waste time',
            'Exception: Scholar\'s Mate attempts (but they\'re easily defended)',
        ],
        goodExample: {
            fen: 'r2qkb1r/ppp2ppp/2n1bn2/3pp3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5',
            highlights: ['d1'],
            caption: 'The queen stays home while minor pieces develop first'
        },
        badExample: {
            fen: 'rnb1kbnr/pppp1ppp/8/4p3/4P2q/8/PPPP1PPP/RNBQKBNR w KQkq - 1 3',
            highlights: ['h4'],
            caption: 'Black\'s queen on h4 will be chased around, losing time: 3.Nc3, 3.Nf3'
        }
    },
    {
        id: 'rooks',
        title: 'Connect Your Rooks',
        description: 'When all minor pieces are developed and you\'ve castled, your rooks should "see" each other with no pieces between them. This means your development is complete!',
        tips: [
            'Rooks belong on open files (no pawns)',
            'Double rooks on the same file for power',
            'Connected rooks defend each other',
            'The back rank should be clear of minor pieces',
        ],
        goodExample: {
            fen: 'r4rk1/ppp2ppp/2n1bn2/3p4/3NP3/2N1B3/PPP2PPP/R2Q1RK1 w - - 0 10',
            highlights: ['a1', 'f1', 'a8', 'f8'],
            caption: 'Both sides have connected rooks - development complete!'
        },
        badExample: {
            fen: 'r3kb1r/ppp2ppp/2n1bn2/3p4/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 8',
            highlights: ['a1', 'h1', 'e1', 'f1'],
            caption: 'White hasn\'t castled - rooks are stuck and can\'t help'
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
                // Empty squares
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

/**
 * Convert square name to indices
 */
function squareToIndices(square: string): [number, number] {
    const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = 8 - parseInt(square[1]);
    return [rank, file];
}

interface MiniBoardProps {
    fen: string;
    highlights: string[];
    isGood: boolean;
}

/**
 * Mini chess board visualization
 */
function MiniBoard({ fen, highlights, isGood }: MiniBoardProps) {
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
                                    ${highlighted ? (isGood ? styles.goodHighlight : styles.badHighlight) : ''}
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

interface OpeningTutorialProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function OpeningTutorial({ isOpen, onClose }: OpeningTutorialProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showGood, setShowGood] = useState(true);

    if (!isOpen) return null;

    const principle = PRINCIPLES[currentIndex];
    const example = showGood ? principle.goodExample : principle.badExample;

    const handlePrev = () => {
        setCurrentIndex(i => Math.max(0, i - 1));
        setShowGood(true);
    };

    const handleNext = () => {
        setCurrentIndex(i => Math.min(PRINCIPLES.length - 1, i + 1));
        setShowGood(true);
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
                    <h2 className={styles.title}>Opening Principles</h2>
                    <button className={styles.closeButton} onClick={onClose}>X</button>
                </div>

                {/* Progress */}
                <div className={styles.progress}>
                    {PRINCIPLES.map((_, i) => (
                        <button
                            key={i}
                            className={`${styles.dot} ${i === currentIndex ? styles.activeDot : ''}`}
                            onClick={() => { setCurrentIndex(i); setShowGood(true); }}
                        />
                    ))}
                </div>

                {/* Main Content - Side by Side */}
                <div className={styles.mainContent}>
                    {/* Left side - Text content */}
                    <div className={styles.content}>
                        <h3 className={styles.principleTitle}>
                            {currentIndex + 1}. {principle.title}
                        </h3>
                        <p className={styles.description}>{principle.description}</p>

                        <div className={styles.tips}>
                            <h4>Tips:</h4>
                            <ul>
                                {principle.tips.map((tip, i) => (
                                    <li key={i}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right side - Board */}
                    <div className={styles.boardSection}>
                        <div className={styles.exampleToggle}>
                            <button
                                className={`${styles.toggleButton} ${showGood ? styles.activeToggle : ''}`}
                                onClick={() => setShowGood(true)}
                            >
                                Good
                            </button>
                            <button
                                className={`${styles.toggleButton} ${!showGood ? styles.activeToggle : ''}`}
                                onClick={() => setShowGood(false)}
                            >
                                Bad
                            </button>
                        </div>
                        <MiniBoard fen={example.fen} highlights={example.highlights} isGood={showGood} />
                        <p className={`${styles.caption} ${showGood ? styles.goodCaption : styles.badCaption}`}>
                            {example.caption}
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
                        {currentIndex + 1} / {PRINCIPLES.length}
                    </span>
                    <button
                        className={styles.navButton}
                        onClick={handleNext}
                        disabled={currentIndex === PRINCIPLES.length - 1}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
