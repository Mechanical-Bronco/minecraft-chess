'use client';

/**
 * TacticsTutorial Component
 * Teaches basic chess tactics with interactive examples
 */

import React, { useState, useMemo } from 'react';
import styles from '@/styles/OpeningTutorial.module.css';

// Unicode chess pieces
const PIECE_SYMBOLS: Record<string, string> = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
};

interface Tactic {
    id: string;
    title: string;
    description: string;
    hint: string;
    position: {
        fen: string;
        highlights: string[];
        solution: string;
    };
}

const TACTICS: Tactic[] = [
    {
        id: 'fork',
        title: 'The Fork',
        description: 'A fork is when one piece attacks two or more enemy pieces at the same time. The opponent can only save one piece, so you win material! Knights are especially good at forking because they jump over pieces.',
        hint: 'Look for squares where your piece can attack multiple targets at once.',
        position: {
            fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
            highlights: ['h5', 'f7', 'e5'],
            solution: 'Qxf7# is checkmate! But even Qxe5+ would fork the king and rook after Black blocks.'
        }
    },
    {
        id: 'pin',
        title: 'The Pin',
        description: 'A pin occurs when a piece cannot move (or shouldn\'t move) because doing so would expose a more valuable piece behind it to capture. Absolute pins (to the king) are illegal to break!',
        hint: 'Bishops, rooks, and queens can create pins along lines and diagonals.',
        position: {
            fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
            highlights: ['c4', 'e4', 'f7'],
            solution: 'The knight on e4 is pinned to the king by the bishop on c4. Black cannot move the knight!'
        }
    },
    {
        id: 'skewer',
        title: 'The Skewer',
        description: 'A skewer is like a reverse pin. A valuable piece (often the king) is attacked and must move, exposing a piece behind it to capture. The attacker wins the piece that was "hiding" behind.',
        hint: 'Force the valuable piece to move, then capture what\'s behind it.',
        position: {
            fen: '4r1k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
            highlights: ['a1', 'e8', 'g8'],
            solution: 'Ra8! skewers the king - after Kf8/Kh8, White wins the rook with Rxe8.'
        }
    },
    {
        id: 'discovered',
        title: 'Discovered Attack',
        description: 'A discovered attack happens when you move one piece and reveal an attack from another piece behind it. Discovered checks are especially powerful because the moved piece can cause havoc while the opponent deals with check!',
        hint: 'Look for pieces that are "blocked" by your own pieces - moving the blocker reveals the attack.',
        position: {
            fen: 'r1bqkb1r/pppp1ppp/2n5/4N3/2B1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 5',
            highlights: ['e5', 'c4', 'f7'],
            solution: 'Nxf7! is a discovered attack - the knight takes f7 while the bishop reveals an attack on e4 (after king moves).'
        }
    },
    {
        id: 'backrank',
        title: 'Back Rank Mate',
        description: 'A back rank mate occurs when a rook or queen delivers checkmate on the opponent\'s back rank (1st or 8th) because the king is trapped by its own pawns. Always watch for this pattern!',
        hint: 'Create a "luft" (escape square) for your king by pushing a pawn. Attack if your opponent hasn\'t!',
        position: {
            fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
            highlights: ['a1', 'g8', 'f7', 'g7', 'h7'],
            solution: 'Ra8# is checkmate! The king is trapped by its own pawns on f7, g7, h7.'
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

interface TacticsTutorialProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TacticsTutorial({ isOpen, onClose }: TacticsTutorialProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showSolution, setShowSolution] = useState(false);

    if (!isOpen) return null;

    const tactic = TACTICS[currentIndex];

    const handlePrev = () => {
        setCurrentIndex(i => Math.max(0, i - 1));
        setShowSolution(false);
    };

    const handleNext = () => {
        setCurrentIndex(i => Math.min(TACTICS.length - 1, i + 1));
        setShowSolution(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === ' ') {
            e.preventDefault();
            setShowSolution(s => !s);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose} onKeyDown={handleKeyDown} tabIndex={0}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Basic Tactics</h2>
                    <button className={styles.closeButton} onClick={onClose}>X</button>
                </div>

                {/* Progress */}
                <div className={styles.progress}>
                    {TACTICS.map((_, i) => (
                        <button
                            key={i}
                            className={`${styles.dot} ${i === currentIndex ? styles.activeDot : ''}`}
                            onClick={() => { setCurrentIndex(i); setShowSolution(false); }}
                        />
                    ))}
                </div>

                {/* Main Content - Side by Side */}
                <div className={styles.mainContent}>
                    {/* Left side - Text content */}
                    <div className={styles.content}>
                        <h3 className={styles.principleTitle}>
                            {currentIndex + 1}. {tactic.title}
                        </h3>
                        <p className={styles.description}>{tactic.description}</p>

                        <div className={styles.tips}>
                            <h4>Hint:</h4>
                            <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>{tactic.hint}</p>
                        </div>
                    </div>

                    {/* Right side - Board */}
                    <div className={styles.boardSection}>
                        <div className={styles.exampleToggle}>
                            <button
                                className={`${styles.toggleButton} ${!showSolution ? styles.activeToggle : ''}`}
                                onClick={() => setShowSolution(false)}
                            >
                                Puzzle
                            </button>
                            <button
                                className={`${styles.toggleButton} ${showSolution ? styles.activeToggle : ''}`}
                                onClick={() => setShowSolution(true)}
                            >
                                Solution
                            </button>
                        </div>
                        <MiniBoard fen={tactic.position.fen} highlights={tactic.position.highlights} />
                        <p className={`${styles.caption} ${showSolution ? styles.goodCaption : ''}`}>
                            {showSolution ? tactic.position.solution : 'White to move - find the tactic!'}
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
                        {currentIndex + 1} / {TACTICS.length}
                    </span>
                    <button
                        className={styles.navButton}
                        onClick={handleNext}
                        disabled={currentIndex === TACTICS.length - 1}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
