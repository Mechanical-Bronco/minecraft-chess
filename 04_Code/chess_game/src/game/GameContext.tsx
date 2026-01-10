'use client';

/**
 * Game Context
 * Unified state management for the chess game to ensure consistent state across all components
 */

import { createContext, useContext, ReactNode } from 'react';
import { useChessGame } from '@/hooks/useChessGame';

type GameContextType = ReturnType<typeof useChessGame>;

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const gameValue = useChessGame();

    return (
        <GameContext.Provider value={gameValue}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}
