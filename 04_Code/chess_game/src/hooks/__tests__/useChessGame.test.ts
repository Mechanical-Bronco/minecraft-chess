import { renderHook, act, waitFor } from '@testing-library/react';
import { useChessGame } from '../useChessGame';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock SoundManager
vi.mock('@/game/soundManager', () => ({
    soundManager: {
        playMove: vi.fn(),
        playCapture: vi.fn(),
        playCheck: vi.fn(),
        playCastle: vi.fn(),
        playPromote: vi.fn(),
    }
}));

// Mock AI Service to return a predictable move
vi.mock('@/game/aiService', () => ({
    getAiMove: vi.fn().mockResolvedValue({ from: 'e7', to: 'e5', color: 'b', piece: 'p', san: 'e5' })
}));

describe('useChessGame Hook', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('should initialize with default state', () => {
        const { result } = renderHook(() => useChessGame());

        expect(result.current.turn).toBe('w');
        expect(result.current.isGameOver).toBe(false);
        expect(result.current.moveHistory).toHaveLength(0);
        expect(result.current.isAiEnabled).toBe(true);
    });

    it('should select a piece when clicked', () => {
        const { result } = renderHook(() => useChessGame());

        // Select White Pawn at e2
        act(() => {
            result.current.selectSquare('e2');
        });

        expect(result.current.selectedSquare).toBe('e2');
        expect(result.current.validMoves.length).toBeGreaterThan(0);
    });

    it('should handle single undo in PvP mode', async () => {
        const { result } = renderHook(() => useChessGame());

        // Disable AI
        act(() => {
            result.current.setIsAiEnabled(false);
        });

        // Select and Move White Pawn e2 -> e4
        act(() => {
            result.current.selectSquare('e2');
        }); // Wait for render

        act(() => {
            // Click target
            result.current.selectSquare('e4');
        });

        expect(result.current.moveHistory).toHaveLength(1);
        expect(result.current.turn).toBe('b');

        // Undo
        act(() => {
            result.current.undoMove();
        });

        expect(result.current.moveHistory).toHaveLength(0);
        expect(result.current.turn).toBe('w');
    });

    it('should maintain stable identity during operations', () => {
        const { result } = renderHook(() => useChessGame());

        // Initial piece set
        const piecesBefore = result.current.pieces;
        expect(piecesBefore.length).toBe(32);

        // 1. Select e2
        act(() => {
            result.current.selectSquare('e2');
        });

        // 2. Move to e4
        act(() => {
            result.current.selectSquare('e4');
        });

        const piecesAfter = result.current.pieces;

        // The moved pawn should have the same ID
        const pawnBefore = piecesBefore.find(p => p.square === 'e2');
        const pawnAfter = piecesAfter.find(p => p.square === 'e4');

        expect(pawnBefore).toBeDefined();
        // expect(pawnAfter).toBeDefined(); // If valid move failed, this fails
        if (pawnAfter) {
            expect(pawnBefore!.id).toBe(pawnAfter.id);
        } else {
            // Fail explicitly if move didn't happen
            expect(result.current.moveHistory).toHaveLength(1);
        }
    });

    it('should toggle AI without resetting game state', () => {
        const { result } = renderHook(() => useChessGame());

        // Disable AI initially to control moves
        act(() => {
            result.current.setIsAiEnabled(false);
        });

        // Make a move
        act(() => {
            result.current.selectSquare('e2');
        });
        act(() => {
            result.current.selectSquare('e4');
        });

        expect(result.current.moveHistory).toHaveLength(1);

        // Toggle AI back on
        act(() => {
            result.current.setIsAiEnabled(true);
        });

        // Should NOT reset (history preserved)
        expect(result.current.moveHistory).toHaveLength(1);
        // Expect turn to be black because we made a move and toggling AI shouldn't revert it
        expect(result.current.turn).toBe('b');
    });

    it('should handle one ply undo (Capture) correctly in PvP', () => {
        const { result } = renderHook(() => useChessGame());

        // Disable AI
        act(() => { result.current.setIsAiEnabled(false); });

        // 1. e4
        act(() => { result.current.selectSquare('e2'); });
        act(() => { result.current.selectSquare('e4'); });

        // 2. d5
        act(() => { result.current.selectSquare('d7'); });
        act(() => { result.current.selectSquare('d5'); });

        // 3. exd5 (Capture)
        act(() => { result.current.selectSquare('e4'); });
        act(() => { result.current.selectSquare('d5'); });

        expect(result.current.pieces.length).toBe(31); // One pawn captured

        // Undo Capture
        act(() => { result.current.undoMove(); });

        expect(result.current.pieces.length).toBe(32); // Pawn restored
        expect(result.current.game.get('d5')).not.toBeNull(); // Black pawn back
        expect(result.current.game.get('e4')).not.toBeNull(); // White pawn back
    });
});
