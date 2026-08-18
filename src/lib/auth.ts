import { supabase } from './supabase';

export async function isAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) return true;
  
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}
