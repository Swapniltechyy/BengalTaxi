import { supabase } from './supabase';

const SESSION_ACTIVE_KEY = 'bt_admin_session_active';
const JUST_LOGGED_IN_KEY = 'bt_admin_just_logged_in';
const LAST_ACTIVITY_KEY = 'bt_admin_last_activity';
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes of inactivity

/**
 * On initial page load:
 * If the page load was NOT a user-initiated reload (F5 / Refresh),
 * and the user did NOT just complete login, purge any stored session tokens.
 * This guarantees that:
 * 1. Closing the browser or tab and reopening forces re-login.
 * 2. Redirecting to another website from the same tab and returning forces re-login.
 * 3. Only an in-page F5 refresh or in-app SPA navigation retains the session.
 */
if (typeof window !== 'undefined') {
  try {
    // Always wipe legacy localStorage tokens
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sb-') || key.includes('supabase.auth.token') || key.includes('supabase'))) {
        localStorage.removeItem(key);
      }
    }

    const justLoggedIn = sessionStorage.getItem(JUST_LOGGED_IN_KEY) === 'true';

    if (typeof performance !== 'undefined' && performance.getEntriesByType) {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        const nav = navEntries[0] as PerformanceNavigationTiming;
        // If not a reload and not just logged in, wipe session immediately
        if (nav.type !== 'reload' && !justLoggedIn) {
          sessionStorage.removeItem(SESSION_ACTIVE_KEY);
          sessionStorage.removeItem(LAST_ACTIVITY_KEY);
          for (let i = sessionStorage.length - 1; i >= 0; i--) {
            const key = sessionStorage.key(i);
            if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
              sessionStorage.removeItem(key);
            }
          }
        }
      }
    }
  } catch (e) {
    console.error('Session guard initialization error:', e);
  }
}

export function markAdminLoggedIn() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(SESSION_ACTIVE_KEY, 'true');
    sessionStorage.setItem(JUST_LOGGED_IN_KEY, 'true');
    sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  } catch (e) {
    console.error('Failed to set admin session marker', e);
  }
}

export function recordAdminActivity() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  } catch {
    // ignore
  }
}

export async function validateAdminSession(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // 1. Must have active session marker
  const isActive = sessionStorage.getItem(SESSION_ACTIVE_KEY) === 'true';
  if (!isActive) {
    await signOut();
    return false;
  }

  // 2. Check inactivity timeout (15 minutes)
  const lastActivity = Number(sessionStorage.getItem(LAST_ACTIVITY_KEY) || 0);
  if (lastActivity && Date.now() - lastActivity > INACTIVITY_TIMEOUT_MS) {
    console.warn('Admin session expired due to inactivity');
    await signOut();
    return false;
  }

  // 3. Clear just-logged-in flag after initial consumption
  if (sessionStorage.getItem(JUST_LOGGED_IN_KEY) === 'true') {
    sessionStorage.removeItem(JUST_LOGGED_IN_KEY);
  }

  // 4. Verify Supabase session in sessionStorage
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session || !session.user) {
      await signOut();
      return false;
    }

    if (session.expires_at && session.expires_at * 1000 < Date.now()) {
      await signOut();
      return false;
    }
  } catch {
    await signOut();
    return false;
  }

  recordAdminActivity();
  return true;
}

export async function isAuthenticated(): Promise<boolean> {
  return validateAdminSession();
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

export async function signOut() {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Sign out error:', err);
  }

  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem(SESSION_ACTIVE_KEY);
      sessionStorage.removeItem(JUST_LOGGED_IN_KEY);
      sessionStorage.removeItem(LAST_ACTIVITY_KEY);
      sessionStorage.clear();

      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      console.error('Storage clear error:', e);
    }
  }

  return { error: null };
}


