import { Chess, Move } from 'chess.js';

/**
 * AI Difficulty Levels
 */
export type AiDifficulty = 'easy' | 'medium' | 'hard';

interface DifficultyConfig {
    depth: number;
    randomChance: number;  // Chance to make a random move
    blunderChance: number; // Chance to miss good captures
}

const DIFFICULTY_CONFIG: Record<AiDifficulty, DifficultyConfig> = {
    easy: {
        depth: 1,
        randomChance: 0.4,   // 40% random moves
        blunderChance: 0.3,  // 30% chance to miss captures
    },
    medium: {
        depth: 2,
        randomChance: 0.15,  // 15% random moves
        blunderChance: 0,
    },
    hard: {
        depth: 3,
        randomChance: 0,     // No random moves - always plays best
        blunderChance: 0,
    },
};

/**
 * Basic material values for chess pieces
 */
const MATERIAL_VALUES: Record<string, number> = {
    p: 10,
    n: 30,
    b: 30,
    r: 50,
    q: 90,
    k: 900,
};

/**
 * Evaluate a board position based on material balance.
 * Returns positive values for White advantage, negative for Black.
 */
export function evaluatePosition(game: Chess): number {
    let score = 0;
    const board = game.board();

    for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
            const piece = board[r][f];
            if (piece) {
                const val = MATERIAL_VALUES[piece.type] || 0;
                score += piece.color === 'w' ? val : -val;
            }
        }
    }

    // Add extra points for checkmate
    if (game.isCheckmate()) {
        score += game.turn() === 'w' ? -10000 : 10000;
    }

    return score;
}

/**
 * Minimax algorithm with Alpha-Beta pruning
 */
function minimax(
    game: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizingPlayer: boolean
): number {
    if (depth === 0 || game.isGameOver()) {
        return evaluatePosition(game);
    }

    const moves = game.moves();

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of moves) {
            game.move(move);
            const ev = minimax(game, depth - 1, alpha, beta, false);
            game.undo();
            maxEval = Math.max(maxEval, ev);
            alpha = Math.max(alpha, ev);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            game.move(move);
            const ev = minimax(game, depth - 1, alpha, beta, true);
            game.undo();
            minEval = Math.min(minEval, ev);
            beta = Math.min(beta, ev);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

/**
 * Best move search for the current player with difficulty settings
 */
export function findBestMove(game: Chess, difficulty: AiDifficulty = 'medium'): string | null {
    const possibleMoves = game.moves();
    if (possibleMoves.length === 0) return null;

    const config = DIFFICULTY_CONFIG[difficulty];
    let bestMove: string | null = null;
    const isWhite = game.turn() === 'w';

    // Random move chance - simulates beginner mistakes
    if (Math.random() < config.randomChance) {
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }

    // For easy mode: sometimes avoid captures (blunder)
    let movesToConsider = possibleMoves;
    if (config.blunderChance > 0 && Math.random() < config.blunderChance) {
        const nonCaptures = possibleMoves.filter(move => !move.includes('x'));
        if (nonCaptures.length > 0) {
            movesToConsider = nonCaptures;
        }
    }

    if (isWhite) {
        let maxEval = -Infinity;
        for (const move of movesToConsider) {
            game.move(move);
            const ev = minimax(game, config.depth - 1, -Infinity, Infinity, false);
            game.undo();
            if (ev > maxEval) {
                maxEval = ev;
                bestMove = move;
            }
        }
    } else {
        let minEval = Infinity;
        for (const move of movesToConsider) {
            game.move(move);
            const ev = minimax(game, config.depth - 1, -Infinity, Infinity, true);
            game.undo();
            if (ev < minEval) {
                minEval = ev;
                bestMove = move;
            }
        }
    }

    return bestMove;
}

/**
 * Asynchronous wrapper to prevent UI blocking
 */
export async function getAiMove(gameCopy: Chess, difficulty: AiDifficulty = 'medium'): Promise<string | null> {
    return new Promise((resolve) => {
        // Use setTimeout to allow the UI thread to breathe
        setTimeout(() => {
            const move = findBestMove(gameCopy, difficulty);
            resolve(move);
        }, 300); // Artificial delay for realism
    });
}
