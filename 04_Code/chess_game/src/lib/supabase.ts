import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create client only if we have the required env vars
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null!;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Database types for game_sessions table
export interface GameSession {
  id: string;
  invite_code: string;
  white_player_id: string;
  black_player_id: string | null;
  fen: string;
  status: 'waiting' | 'active' | 'checkmate' | 'stalemate' | 'draw' | 'abandoned';
  created_at: string;
  updated_at: string;
}
