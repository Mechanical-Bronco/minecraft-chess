'use client';

/**
 * Scene Component
 * Sets up the Three.js canvas with camera, lighting, and controls
 */

import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { CAMERA, LIGHTING } from '@/game/constants';
import ChessBoard from './ChessBoard';
import PromotionModal from './PromotionModal';
import GameOverModal from './GameOverModal';
import MoveHistory from './MoveHistory';
import CapturedPieces from './CapturedPieces';
import { PieceStyleProvider, usePieceStyle, PieceStyle } from '@/game/pieceStyleContext';
import styles from '@/styles/Board.module.css';
import { useEffect, useState } from 'react';
import { GameProvider, useGame } from '@/game/GameContext';
import OpeningTutorial from './OpeningTutorial';
import TacticsTutorial from './TacticsTutorial';
import EndgameTutorial from './EndgameTutorial';

/**
 * HUD Component to display game status and turn info
 */
function HUD() {
    const {
        turn, isCheck, isCheckmate, isDraw, isGameOver, resetGame, undoMove,
        isAiEnabled, isAiThinking, setIsAiEnabled, aiDifficulty, setAiDifficulty
    } = useGame();
    const { style, toggleStyle } = usePieceStyle();

    const toggleDifficulty = () => {
        const levels: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
        const currentIndex = levels.indexOf(aiDifficulty);
        const nextIndex = (currentIndex + 1) % levels.length;
        setAiDifficulty(levels[nextIndex]);
    };

    const getDifficultyLabel = () => {
        switch (aiDifficulty) {
            case 'easy': return '🌱 Easy';
            case 'medium': return '⚔️ Medium';
            case 'hard': return '🔥 Hard';
        }
    };

    const getStatusMessage = () => {
        if (isAiThinking) return "🤖 AI is thinking...";
        if (isCheckmate) return `CHECKMATE! ${turn === 'w' ? 'Black' : 'White'} Wins!`;
        if (isDraw) return "Draw Game!";
        if (isGameOver) return "Game Over!";
        if (isCheck) return "⚠️ CHECK!";
        return null;
    };

    const statusMessage = getStatusMessage();

    // Unified keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (key === 'p') toggleStyle();
            if ((e.metaKey || e.ctrlKey) && key === 'z') {
                e.preventDefault();
                undoMove();
            }
            if (key === 'r') resetGame();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleStyle, undoMove, resetGame]);

    return (
        <>
            <div className={styles.status}>
                <h2 className={styles.title}>Minecraft Chess</h2>
                <div className={styles.gameInfo}>
                    <p className={turn === 'w' ? styles.activeTurn : ''}>
                        White: <strong>You (Grass)</strong>
                    </p>
                    <p className={turn === 'b' ? styles.activeTurn : ''}>
                        Black: <strong>{isAiEnabled ? 'AI (Dirt)' : 'Human (Dirt)'}</strong>
                    </p>
                    {statusMessage && (
                        <p className={isCheckmate || isCheck || isAiThinking ? styles.checkWarning : styles.gameOver}>
                            {statusMessage}
                        </p>
                    )}
                </div>
                <hr className={styles.divider} />
                <p className={styles.controls}>🎮 Drag to rotate | Scroll to zoom</p>
                <p className={styles.controls}>⌨️ P: Style | Click to Move | Z: Undo</p>
            </div>

            <div className={styles.actions}>
                <button
                    className={`${styles.actionButton} ${isAiEnabled ? styles.aiActive : ''}`}
                    onClick={() => setIsAiEnabled(!isAiEnabled)}
                >
                    {isAiEnabled ? '🤖 AI: ON' : '👤 AI: OFF'}
                </button>
                {isAiEnabled && (
                    <button
                        className={styles.actionButton}
                        onClick={toggleDifficulty}
                        title="Toggle AI difficulty"
                    >
                        {getDifficultyLabel()}
                    </button>
                )}
                <button className={styles.actionButton} onClick={() => undoMove()} title="Undo last turn (Player + AI if active)">
                    ↩️ Undo
                </button>
                <button
                    className={`${styles.actionButton} ${isGameOver ? styles.newGameButton : ''}`}
                    onClick={resetGame}
                    title="Reset game (R)"
                >
                    {isGameOver ? '✨ New Game' : '🔄 Reset'}
                </button>
                <button className={styles.actionButton} onClick={toggleStyle}>
                    {style === PieceStyle.SIMPLE ? '🎨 Simple' : '🎮 Advanced'}
                </button>
            </div>
        </>
    );
}

/**
 * Rendering content within the canvas
 */
function SceneContent() {
    const [tutorialOpen, setTutorialOpen] = useState(false);
    const [tacticsOpen, setTacticsOpen] = useState(false);
    const [endgameOpen, setEndgameOpen] = useState(false);

    return (
        <div className={styles.container}>
            <Canvas
                className={styles.canvas}
                shadows
                gl={{ antialias: true, powerPreference: 'high-performance' }}
                dpr={[1, 2]}
            >
                <OrthographicCamera
                    makeDefault
                    position={CAMERA.POSITION}
                    zoom={CAMERA.ORTHO_ZOOM}
                    near={CAMERA.NEAR}
                    far={CAMERA.FAR}
                />

                <ambientLight intensity={LIGHTING.AMBIENT_INTENSITY} />
                <directionalLight
                    position={[10, 20, 10]}
                    intensity={LIGHTING.DIRECTIONAL_INTENSITY}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                    shadow-camera-left={-10}
                    shadow-camera-right={10}
                    shadow-camera-top={10}
                    shadow-camera-bottom={-10}
                />

                <ChessBoard />

                <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={5}
                    maxDistance={100}
                    maxPolarAngle={Math.PI / 2.1}
                    target={[0, 0, 0]}
                    enableZoom={true}
                />

                <color attach="background" args={['#87ceeb']} />
            </Canvas>

            <HUD />
            <CapturedPieces player="white" />
            <CapturedPieces player="black" />
            <MoveHistory />

            {/* Tutorial Buttons */}
            <div className={styles.tutorials}>
                <button
                    className={styles.tutorialButton}
                    onClick={() => setTutorialOpen(true)}
                    title="Learn opening principles"
                >
                    📖 Openings
                </button>
                <button
                    className={styles.tutorialButton}
                    onClick={() => setTacticsOpen(true)}
                    title="Learn basic tactics"
                >
                    ⚔️ Tactics
                </button>
                <button
                    className={styles.tutorialButton}
                    onClick={() => setEndgameOpen(true)}
                    title="Learn endgame basics"
                >
                    👑 Endgame
                </button>
            </div>

            <PromotionModal />
            <GameOverModal />
            <OpeningTutorial isOpen={tutorialOpen} onClose={() => setTutorialOpen(false)} />
            <TacticsTutorial isOpen={tacticsOpen} onClose={() => setTacticsOpen(false)} />
            <EndgameTutorial isOpen={endgameOpen} onClose={() => setEndgameOpen(false)} />
        </div>
    );
}

/**
 * Main Scene with providers
 */
export default function Scene() {
    return (
        <PieceStyleProvider>
            <GameProvider>
                <SceneContent />
            </GameProvider>
        </PieceStyleProvider>
    );
}
