'use client';

import { useState } from 'react';
import { MultiplayerState } from '@/hooks/useMultiplayerGame';
import styles from '@/styles/Lobby.module.css';

interface LobbyProps {
  state: MultiplayerState;
  onCreateGame: () => void;
  onJoinGame: (code: string) => void;
  onLeaveGame: () => void;
  onPlayLocal: () => void;
  onReset: () => void;
}

export default function Lobby({
  state,
  onCreateGame,
  onJoinGame,
  onLeaveGame,
  onPlayLocal,
  onReset,
}: LobbyProps) {
  const [joinCode, setJoinCode] = useState('');

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim()) {
      onJoinGame(joinCode);
    }
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  // Already playing - don't show lobby
  if (state.mode === 'playing') {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <h1 className={styles.title}>Minecraft Chess</h1>
        <p className={styles.subtitle}>Play chess with Minecraft-style pieces</p>

        {/* Error Message */}
        {state.mode === 'error' && (
          <div className={styles.error}>
            {state.message}
            <button
              className={`${styles.button}`}
              onClick={onReset}
              style={{ marginTop: '12px' }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Idle State - Main Menu */}
        {state.mode === 'idle' && (
          <>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Online Multiplayer</h2>
              <button
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={onCreateGame}
              >
                Create Game
              </button>

              <form onSubmit={handleJoinSubmit} className={styles.inputGroup}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="CODE"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                />
                <button
                  type="submit"
                  className={`${styles.button} ${styles.joinButton}`}
                  disabled={joinCode.length < 6}
                >
                  Join
                </button>
              </form>
            </div>

            <div className={styles.localPlaySection}>
              <p className={styles.localPlayHint}>Or play on this device</p>
              <button
                className={styles.button}
                onClick={onPlayLocal}
              >
                Play vs AI
              </button>
            </div>
          </>
        )}

        {/* Creating State */}
        {state.mode === 'creating' && (
          <div className={styles.waitingScreen}>
            <p className={styles.waitingMessage}>Creating game...</p>
          </div>
        )}

        {/* Joining State */}
        {state.mode === 'joining' && (
          <div className={styles.waitingScreen}>
            <p className={styles.waitingMessage}>Joining game...</p>
          </div>
        )}

        {/* Waiting for Opponent */}
        {state.mode === 'waiting' && (
          <div className={styles.waitingScreen}>
            <h2 className={styles.sectionTitle}>Share this code with a friend</h2>

            <div
              className={styles.inviteCode}
              onClick={() => copyInviteCode(state.inviteCode)}
              style={{ cursor: 'pointer' }}
              title="Click to copy"
            >
              <p className={styles.inviteCodeLabel}>Invite Code</p>
              <p className={styles.inviteCodeValue}>{state.inviteCode}</p>
            </div>

            <p className={styles.copyHint}>Click the code to copy it</p>

            <p className={styles.waitingMessage}>
              Waiting for opponent to join<span className={styles.waitingDots}>...</span>
            </p>

            <button
              className={styles.button}
              onClick={onLeaveGame}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
