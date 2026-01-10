'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Chess, Move, Square } from 'chess.js';
import { indexToSquare, PieceInstance } from '@/game/types';
import { getAiMove, AiDifficulty } from '@/game/aiService';
import { soundManager } from '@/game/soundManager';

/**
 * Custom hook to manage the chess game state and logic
 */
export function useChessGame() {
    const [game, setGame] = useState(new Chess());
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
    const [pendingMove, setPendingMove] = useState<Move | null>(null);
    const [moveHistory, setMoveHistory] = useState<Move[]>([]);
    const [isAiEnabled, setIsAiEnabled] = useState(true);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [aiDifficulty, setAiDifficulty] = useState<AiDifficulty>('easy');

    // Persistent piece state for animations
    const [pieces, setPieces] = useState<PieceInstance[]>(() => {
        const initialGame = new Chess();
        const initialBoard = initialGame.board();
        const initialPieces: PieceInstance[] = [];
        let idCounter = 0;

        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                const p = initialBoard[r][f];
                if (p) {
                    initialPieces.push({
                        id: `piece-${idCounter++}`,
                        type: p.type,
                        color: p.color,
                        square: indexToSquare(f, 7 - r) as Square
                    });
                }
            }
        }
        return initialPieces;
    });

    // Get current board state from chess.js (for validation/UI fallback)
    const board = useMemo(() => game.board(), [game]);

    // Get valid moves for the selected square
    const validMoves = useMemo(() => {
        if (!selectedSquare) return [];
        return game.moves({ square: selectedSquare, verbose: true });
    }, [game, selectedSquare]);

    /**
     * Perform a move and update persistent piece positions
     */
    const makeMove = useCallback((move: Move | { from: string; to: string; promotion?: string }) => {
        // Create new game and make move
        const nextGame = new Chess(game.fen());
        let result: Move | null = null;

        try {
            result = nextGame.move(move);
        } catch (e) {
            console.error('Invalid move', e);
            return false;
        }

        if (!result) return false;

        // Update game state
        console.log('Move Successful:', result);
        setGame(nextGame);
        setMoveHistory(h => [...h, result!]);
        setPendingMove(null);
        setSelectedSquare(null);

        // Play Sounds
        if (nextGame.inCheck()) {
            soundManager.playCheck();
        } else if (result.flags.includes('p')) { // Promotion
            soundManager.playPromote();
        } else if (result.captured) {
            soundManager.playCapture();
        } else if (result.flags.includes('k') || result.flags.includes('q')) {
            soundManager.playCastle();
        } else {
            soundManager.playMove();
        }

        // Update persistent pieces for animation
        console.log('Prev Pieces:', pieces.length);
        setPieces(prevPieces => {
            let next = [...prevPieces];
            const moveResult = result!;

            // 1. Remove captured piece if any
            if (moveResult.captured) {
                let captureSquare: string = moveResult.to;
                // Special case: En Passant
                if (moveResult.flags.includes('e')) {
                    const rank = parseInt(moveResult.from[1]);
                    captureSquare = moveResult.to[0] + rank;
                }
                console.log('Removing captured piece at:', captureSquare);
                const countBefore = next.length;
                next = next.filter(p => p.square !== captureSquare);
                console.log('Pieces after filter:', next.length, 'Removed:', countBefore - next.length);
            }

            // 2. Move the piece and handle special cases
            let found = false;
            next = next.map(p => {
                // Move the main piece
                if (p.square === moveResult.from) {
                    found = true;
                    console.log('Moving piece from', moveResult.from, 'to', moveResult.to);
                    return {
                        ...p,
                        square: moveResult.to as Square,
                        type: moveResult.promotion || p.type // Handle promotion
                    };
                }

                // 3. Handle Castling (move the Rook too)
                if (moveResult.flags.includes('k') || moveResult.flags.includes('q')) {
                    const isWhite = moveResult.color === 'w';
                    const rank = isWhite ? '1' : '8';

                    // King side castle
                    if (moveResult.flags.includes('k')) {
                        const rookFrom = 'h' + rank;
                        const rookTo = 'f' + rank;
                        if (p.square === rookFrom) return { ...p, square: rookTo as Square };
                    }
                    // Queen side castle
                    if (moveResult.flags.includes('q')) {
                        const rookFrom = 'a' + rank;
                        const rookTo = 'd' + rank;
                        if (p.square === rookFrom) return { ...p, square: rookTo as Square };
                    }
                }

                return p;
            });

            if (!found) {
                console.warn('COULD NOT FIND MOVING PIECE AT', moveResult.from);
            }
            console.log('Final Pieces count:', next.length);
            return next;
        });

        return true;
    }, [game, pieces.length]); // Added pieces.length to dependencies for console.log

    // AI Move Effect
    useEffect(() => {
        if (isAiEnabled && game.turn() === 'b' && !game.isGameOver() && !pendingMove) {
            const triggerAi = async () => {
                setIsAiThinking(true);
                try {
                    const move = await getAiMove(new Chess(game.fen()), aiDifficulty);
                    if (move) {
                        makeMove(move as any);
                    }
                } catch (error) {
                    console.error("AI Error:", error);
                } finally {
                    setIsAiThinking(false);
                }
            };
            // artificial "thinking" delay
            const timer = setTimeout(triggerAi, 600);
            return () => clearTimeout(timer);
        }
    }, [isAiEnabled, game, pendingMove, makeMove, aiDifficulty]);

    /**
     * Select a square on the board
     */
    const selectSquare = useCallback((square: Square) => {
        if (pendingMove || isAiThinking) return;

        const piece = game.get(square);

        if (selectedSquare === square) {
            setSelectedSquare(null);
            return;
        }

        const move = validMoves.find(m => m.to === square);
        if (move) {
            if (move.flags.includes('p')) {
                setPendingMove(move);
                return;
            }
            makeMove(move);
            return;
        }

        if (piece && piece.color === game.turn()) {
            setSelectedSquare(square);
        } else {
            setSelectedSquare(null);
        }
    }, [game, selectedSquare, validMoves, pendingMove, makeMove, isAiThinking]);

    /**
     * Complete a pending promotion move
     */
    const promotePiece = useCallback((pieceType: string) => {
        if (!pendingMove) return;

        const type = pieceType[0].toLowerCase();
        makeMove({
            from: pendingMove.from,
            to: pendingMove.to,
            promotion: type
        });
    }, [pendingMove, makeMove]);

    /**
     * Sync pieces for undo/reset
     */
    const syncPieces = useCallback((currentBoard: any[][]) => {
        setPieces(prev => {
            const next: PieceInstance[] = [];
            let pClone = [...prev];

            for (let r = 0; r < 8; r++) {
                for (let f = 0; f < 8; f++) {
                    const p = currentBoard[r][f];
                    if (p) {
                        const sq = indexToSquare(f, 7 - r) as Square;
                        const existing = pClone.find(x => x.color === p.color && x.type === p.type);
                        if (existing) {
                            next.push({ ...existing, square: sq });
                            pClone = pClone.filter(x => x.id !== existing.id);
                        } else {
                            next.push({
                                id: `piece-sync-${Math.random()}`,
                                type: p.type,
                                color: p.color,
                                square: sq
                            });
                        }
                    }
                }
            }
            return next;
        });
    }, []);

    /**
     * Reset the game
     */
    const resetGame = useCallback(() => {
        const newGame = new Chess();
        setGame(newGame);
        setSelectedSquare(null);
        setMoveHistory([]);
        setPendingMove(null);
        syncPieces(newGame.board());
    }, [syncPieces]);

    /**
     * Undo the last move (Context-aware)
     * If AI is enabled: Undoes 2 plies (User + AI) -> returns to User's turn
     * If AI is disabled: Undoes 1 ply -> returns to opponent's turn
     */
    const undoMove = useCallback(() => {
        if (isAiThinking) return;

        // Use functional state updates to avoid stale closure issues
        setMoveHistory(prevHistory => {
            // 1. Determine how many plies to undo
            let pliesToUndo = 1;
            if (isAiEnabled) {
                pliesToUndo = prevHistory.length >= 2 ? 2 : 1;
            }

            // 2. Calculate new history
            const newHistory = prevHistory.slice(0, -pliesToUndo);

            // 3. Rebuild game state from new history
            setGame(() => {
                const nextGame = new Chess();
                for (const move of newHistory) {
                    try {
                        nextGame.move(move);
                    } catch (e) {
                        console.error('Error replaying move during undo:', move, e);
                    }
                }

                // 4. Update UI state
                setSelectedSquare(null);
                setPendingMove(null);

                // 5. Sync the 3D pieces to the new board state
                syncPieces(nextGame.board());

                return nextGame;
            });

            return newHistory;
        });
    }, [isAiEnabled, isAiThinking, syncPieces]);

    return {
        game,
        board,
        pieces, // Use this for persistent pieces
        selectedSquare,
        validMoves,
        moveHistory,
        pendingMove,
        isAiEnabled,
        isAiThinking,
        aiDifficulty,
        setIsAiEnabled,
        setAiDifficulty,
        promotePiece,
        selectSquare,
        resetGame,
        undoMove,
        turn: game.turn(),
        isCheck: game.inCheck(),
        isCheckmate: game.isCheckmate(),
        isDraw: game.isDraw(),
        isGameOver: game.isGameOver(),
    };
}
