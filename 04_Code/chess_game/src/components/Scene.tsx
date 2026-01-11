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
import Lobby from './Lobby';
import { PieceStyleProvider, usePieceStyle, PieceStyle } from '@/game/pieceStyleContext';
import styles from '@/styles/Board.module.css';
import { useEffect, useState, useRef } from 'react';
import { GameProvider, useGame } from '@/game/GameContext';
import { useMultiplayerGame } from '@/hooks/useMultiplayerGame';
import OpeningTutorial from './OpeningTutorial';
import TacticsTutorial from './TacticsTutorial';
import EndgameTutorial from './EndgameTutorial';

interface HUDProps {
    isMultiplayer?: boolean;
    playerColor?: 'w' | 'b' | null;
    isMyTurn?: boolean;
    onLeaveGame?: () => void;
    inviteCode?: string;
}

/**
 * HUD Component to display game status and turn info
 */
function HUD({ isMultiplayer, playerColor, isMyTurn, onLeaveGame, inviteCode }: HUDProps) {
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
        if (isMultiplayer && !isMyTurn && !isGameOver) return "Waiting for opponent...";
        if (isAiThinking) return "🤖 AI is thinking...";
        if (isCheckmate) return `CHECKMATE! ${turn === 'w' ? 'Black' : 'White'} Wins!`;
        if (isDraw) return "Draw Game!";
        if (isGameOver) return "Game Over!";
        if (isCheck) return "⚠️ CHECK!";
        if (isMultiplayer && isMyTurn) return "Your turn!";
        return null;
    };

    const statusMessage = getStatusMessage();

    // Unified keyboard shortcuts (disabled in multiplayer for undo/reset)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (key === 'p') toggleStyle();
            if (!isMultiplayer) {
                if ((e.metaKey || e.ctrlKey) && key === 'z') {
                    e.preventDefault();
                    undoMove();
                }
                if (key === 'r') resetGame();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleStyle, undoMove, resetGame, isMultiplayer]);

    const getWhiteLabel = () => {
        if (isMultiplayer) {
            return playerColor === 'w' ? 'You (Grass)' : 'Opponent (Grass)';
        }
        return 'You (Grass)';
    };

    const getBlackLabel = () => {
        if (isMultiplayer) {
            return playerColor === 'b' ? 'You (Dirt)' : 'Opponent (Dirt)';
        }
        return isAiEnabled ? 'AI (Dirt)' : 'Human (Dirt)';
    };

    return (
        <>
            <div className={styles.status}>
                <h2 className={styles.title}>Minecraft Chess</h2>
                {isMultiplayer && (
                    <p style={{ color: '#5b8dd9', fontSize: '12px', margin: '0 0 8px 0' }}>
                        🌐 Online Game {inviteCode && <span style={{ color: '#ffcc00', marginLeft: '8px' }}>Code: {inviteCode}</span>}
                    </p>
                )}
                <div className={styles.gameInfo}>
                    <p className={turn === 'w' ? styles.activeTurn : ''}>
                        White: <strong>{getWhiteLabel()}</strong>
                    </p>
                    <p className={turn === 'b' ? styles.activeTurn : ''}>
                        Black: <strong>{getBlackLabel()}</strong>
                    </p>
                    {statusMessage && (
                        <p className={isCheckmate || isCheck || isAiThinking || (isMultiplayer && !isMyTurn) ? styles.checkWarning : styles.gameOver}>
                            {statusMessage}
                        </p>
                    )}
                </div>
                <hr className={styles.divider} />
                <p className={styles.controls}>🎮 Drag to rotate | Scroll to zoom</p>
                <p className={styles.controls}>⌨️ P: Style | Click to Move{!isMultiplayer && ' | Z: Undo'}</p>
            </div>

            <div className={styles.actions}>
                {!isMultiplayer && (
                    <>
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
                    </>
                )}
                {isMultiplayer && onLeaveGame && (
                    <button
                        className={styles.actionButton}
                        onClick={onLeaveGame}
                        title="Leave game"
                    >
                        🚪 Leave Game
                    </button>
                )}
                <button className={styles.actionButton} onClick={toggleStyle}>
                    {style === PieceStyle.SIMPLE ? '🎨 Simple' : style === PieceStyle.ADVANCED ? '🎮 Advanced' : '🐕 vs 🐈'}
                </button>
            </div>
        </>
    );
}

interface SceneContentProps {
    isMultiplayer: boolean;
    playerColor: 'w' | 'b' | null;
    isMyTurn: boolean;
    onLeaveGame: () => void;
    inviteCode?: string;
}

/**
 * Rendering content within the canvas
 */
function SceneContent({ isMultiplayer, playerColor, isMyTurn, onLeaveGame, inviteCode }: SceneContentProps) {
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

                <ChessBoard
                    disableMoves={isMultiplayer && !isMyTurn}
                />

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

            <HUD
                isMultiplayer={isMultiplayer}
                playerColor={playerColor}
                isMyTurn={isMyTurn}
                onLeaveGame={onLeaveGame}
                inviteCode={inviteCode}
            />
            <CapturedPieces player="white" />
            <CapturedPieces player="black" />
            <MoveHistory />

            {/* Tutorial Buttons - hidden in multiplayer */}
            {!isMultiplayer && (
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
            )}

            <PromotionModal />
            <GameOverModal />
            <OpeningTutorial isOpen={tutorialOpen} onClose={() => setTutorialOpen(false)} />
            <TacticsTutorial isOpen={tacticsOpen} onClose={() => setTacticsOpen(false)} />
            <EndgameTutorial isOpen={endgameOpen} onClose={() => setEndgameOpen(false)} />
        </div>
    );
}

/**
 * Multiplayer coordinator component
 * Syncs between multiplayer state and local game state
 */
function MultiplayerCoordinator() {
    const { fen, loadFen, setIsAiEnabled, isGameOver, isCheckmate, isDraw } = useGame();
    const multiplayer = useMultiplayerGame();
    const [showLobby, setShowLobby] = useState(true);
    const lastFenRef = useRef<string>('');

    // When multiplayer game starts, load the FEN and disable AI
    useEffect(() => {
        if (multiplayer.state.mode === 'playing') {
            setIsAiEnabled(false);
            loadFen(multiplayer.state.session.fen);
            lastFenRef.current = multiplayer.state.session.fen;
        }
    }, [multiplayer.state.mode === 'playing']);

    // Sync FEN from database when opponent makes a move
    useEffect(() => {
        if (multiplayer.state.mode === 'playing') {
            const sessionFen = multiplayer.state.session.fen;
            // Only update if FEN changed and it wasn't our move
            if (sessionFen !== lastFenRef.current && sessionFen !== fen) {
                loadFen(sessionFen);
                lastFenRef.current = sessionFen;
            }
        }
    }, [multiplayer.state.mode === 'playing' ? multiplayer.state.session.fen : null]);

    // Push local FEN to database when we make a move
    useEffect(() => {
        if (multiplayer.state.mode === 'playing' && fen !== lastFenRef.current) {
            // Determine game status
            let status: 'active' | 'checkmate' | 'stalemate' | 'draw' = 'active';
            if (isCheckmate) status = 'checkmate';
            else if (isDraw) status = 'draw';
            else if (isGameOver) status = 'stalemate';

            multiplayer.updateGameFen(fen, status);
            lastFenRef.current = fen;
        }
    }, [fen, multiplayer.state.mode === 'playing', isGameOver, isCheckmate, isDraw]);

    const handlePlayLocal = () => {
        setShowLobby(false);
    };

    const handleLeaveGame = () => {
        multiplayer.leaveGame();
        setShowLobby(true);
    };

    // Show lobby when in idle, creating, joining, waiting, or error state
    if (showLobby && multiplayer.state.mode !== 'playing') {
        return (
            <Lobby
                state={multiplayer.state}
                onCreateGame={multiplayer.createGame}
                onJoinGame={multiplayer.joinGame}
                onLeaveGame={multiplayer.leaveGame}
                onPlayLocal={handlePlayLocal}
                onReset={multiplayer.resetMultiplayer}
            />
        );
    }

    // Get invite code from session when playing
    const inviteCode = multiplayer.state.mode === 'playing'
        ? multiplayer.state.session.invite_code
        : undefined;

    return (
        <SceneContent
            isMultiplayer={multiplayer.isMultiplayer}
            playerColor={multiplayer.playerColor}
            isMyTurn={multiplayer.isMyTurn}
            onLeaveGame={handleLeaveGame}
            inviteCode={inviteCode}
        />
    );
}

/**
 * Main Scene with providers
 */
export default function Scene() {
    return (
        <PieceStyleProvider>
            <GameProvider>
                <MultiplayerCoordinator />
            </GameProvider>
        </PieceStyleProvider>
    );
}
