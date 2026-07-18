import { supabase } from './supabase';

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}
