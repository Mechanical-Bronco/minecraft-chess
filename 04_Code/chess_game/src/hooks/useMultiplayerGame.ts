'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, GameSession } from '@/lib/supabase';

// Generate a random 6-character invite code
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing chars (0/O, 1/I)
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Get or create a persistent player ID
function getPlayerId(): string {
  if (typeof window === 'undefined') return '';

  let playerId = localStorage.getItem('chess_player_id');
  if (!playerId) {
    playerId = 'player_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('chess_player_id', playerId);
  }
  return playerId;
}

export type MultiplayerState =
  | { mode: 'idle' }
  | { mode: 'creating' }
  | { mode: 'joining' }
  | { mode: 'waiting'; session: GameSession; inviteCode: string }
  | { mode: 'playing'; session: GameSession; playerColor: 'w' | 'b' }
  | { mode: 'error'; message: string };

export function useMultiplayerGame() {
  const [state, setState] = useState<MultiplayerState>({ mode: 'idle' });
  const [playerId, setPlayerId] = useState<string>('');

  // Initialize player ID on mount
  useEffect(() => {
    setPlayerId(getPlayerId());
  }, []);

  // Create a new game session
  const createGame = useCallback(async () => {
    if (!playerId) return;

    setState({ mode: 'creating' });

    const inviteCode = generateInviteCode();
    const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    const { data, error } = await supabase
      .from('game_sessions')
      .insert({
        invite_code: inviteCode,
        white_player_id: playerId,
        fen: initialFen,
        status: 'waiting'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating game:', error);
      setState({ mode: 'error', message: 'Failed to create game. Please try again.' });
      return;
    }

    setState({ mode: 'waiting', session: data, inviteCode });
  }, [playerId]);

  // Join an existing game by invite code
  const joinGame = useCallback(async (inviteCode: string) => {
    if (!playerId) return;

    setState({ mode: 'joining' });

    const normalizedCode = inviteCode.toUpperCase().trim();

    // Find the game
    const { data: session, error: findError } = await supabase
      .from('game_sessions')
      .select()
      .eq('invite_code', normalizedCode)
      .single();

    if (findError || !session) {
      setState({ mode: 'error', message: 'Game not found. Check your invite code.' });
      return;
    }

    // Check if game is joinable
    if (session.status !== 'waiting') {
      setState({ mode: 'error', message: 'This game is no longer available.' });
      return;
    }

    // Check if this is the same player who created it
    if (session.white_player_id === playerId) {
      setState({ mode: 'error', message: "You can't join your own game!" });
      return;
    }

    // Join the game as black
    const { data: updatedSession, error: joinError } = await supabase
      .from('game_sessions')
      .update({
        black_player_id: playerId,
        status: 'active'
      })
      .eq('id', session.id)
      .select()
      .single();

    if (joinError) {
      console.error('Error joining game:', joinError);
      setState({ mode: 'error', message: 'Failed to join game. Please try again.' });
      return;
    }

    setState({ mode: 'playing', session: updatedSession, playerColor: 'b' });
  }, [playerId]);

  // Update game state (make a move)
  const updateGameFen = useCallback(async (newFen: string, newStatus?: GameSession['status']) => {
    if (state.mode !== 'playing') return;

    const updates: Partial<GameSession> = { fen: newFen };
    if (newStatus) updates.status = newStatus;

    const { error } = await supabase
      .from('game_sessions')
      .update(updates)
      .eq('id', state.session.id);

    if (error) {
      console.error('Error updating game:', error);
    }
  }, [state]);

  // Leave/abandon current game
  const leaveGame = useCallback(async () => {
    if (state.mode === 'waiting' || state.mode === 'playing') {
      await supabase
        .from('game_sessions')
        .update({ status: 'abandoned' })
        .eq('id', state.session.id);
    }
    setState({ mode: 'idle' });
  }, [state]);

  // Reset to idle state
  const resetMultiplayer = useCallback(() => {
    setState({ mode: 'idle' });
  }, []);

  // Subscribe to game changes when in waiting or playing mode
  useEffect(() => {
    if (state.mode !== 'waiting' && state.mode !== 'playing') return;

    const sessionId = state.session.id;

    const channel = supabase
      .channel(`game_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${sessionId}`
        },
        (payload) => {
          const updatedSession = payload.new as GameSession;

          // If we were waiting and game became active, we're now playing as white
          if (state.mode === 'waiting' && updatedSession.status === 'active') {
            setState({ mode: 'playing', session: updatedSession, playerColor: 'w' });
          }
          // If we're playing, update the session (opponent made a move)
          else if (state.mode === 'playing') {
            setState(prev => {
              if (prev.mode !== 'playing') return prev;
              return { ...prev, session: updatedSession };
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [state.mode, state.mode === 'waiting' || state.mode === 'playing' ? state.session.id : null]);

  return {
    state,
    playerId,
    createGame,
    joinGame,
    updateGameFen,
    leaveGame,
    resetMultiplayer,
    isMultiplayer: state.mode === 'playing',
    isMyTurn: state.mode === 'playing'
      ? (state.session.fen.split(' ')[1] === state.playerColor)
      : false,
    playerColor: state.mode === 'playing' ? state.playerColor : null,
  };
}
