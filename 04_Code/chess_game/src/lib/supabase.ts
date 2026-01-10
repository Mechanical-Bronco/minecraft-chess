import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseInstance;
}

export const supabase = {
  from: (table: string) => {
    const client = getSupabase();
    if (!client) throw new Error('Supabase not configured');
    return client.from(table);
  },
  channel: (name: string) => {
    const client = getSupabase();
    if (!client) throw new Error('Supabase not configured');
    return client.channel(name);
  },
  removeChannel: (channel: ReturnType<SupabaseClient['channel']>) => {
    const client = getSupabase();
    if (!client) return;
    return client.removeChannel(channel);
  }
};

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

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
