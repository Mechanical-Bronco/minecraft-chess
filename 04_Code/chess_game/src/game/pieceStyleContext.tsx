'use client';

/**
 * Piece Style Context
 * Manages chess piece rendering mode (simple vs advanced) across the application
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

export enum PieceStyle {
    SIMPLE = 'simple',
    ADVANCED = 'advanced',
    DOGS = 'dogs',
}

interface PieceStyleContextType {
    style: PieceStyle;
    toggleStyle: () => void;
    setStyle: (style: PieceStyle) => void;
}

const PieceStyleContext = createContext<PieceStyleContextType | undefined>(undefined);

const STORAGE_KEY = 'minecraft-chess-piece-style';

export function PieceStyleProvider({ children }: { children: ReactNode }) {
    const [style, setStyleState] = useState<PieceStyle>(PieceStyle.SIMPLE);

    // Load saved preference on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === PieceStyle.SIMPLE || saved === PieceStyle.ADVANCED || saved === PieceStyle.DOGS) {
            setStyleState(saved);
        }
    }, []);

    const setStyle = useCallback((newStyle: PieceStyle) => {
        setStyleState(newStyle);
        localStorage.setItem(STORAGE_KEY, newStyle);
    }, []);

    const toggleStyle = useCallback(() => {
        setStyleState(prev => {
            // Cycle through: SIMPLE -> ADVANCED -> DOGS -> SIMPLE
            const styles = [PieceStyle.SIMPLE, PieceStyle.ADVANCED, PieceStyle.DOGS];
            const currentIndex = styles.indexOf(prev);
            const next = styles[(currentIndex + 1) % styles.length];
            localStorage.setItem(STORAGE_KEY, next);
            return next;
        });
    }, []);

    const contextValue = useMemo(() => ({
        style, toggleStyle, setStyle
    }), [style, toggleStyle, setStyle]);

    return (
        <PieceStyleContext.Provider value={contextValue}>
            {children}
        </PieceStyleContext.Provider>
    );
}

export function usePieceStyle() {
    const context = useContext(PieceStyleContext);
    if (!context) {
        throw new Error('usePieceStyle must be used within PieceStyleProvider');
    }
    return context;
}
