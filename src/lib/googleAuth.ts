import supabase from './supabase';

// Detect mobile devices for appropriate OAuth flow
const isMobile = (): boolean => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Build Google OAuth URL with state parameter containing app context
function buildGoogleUrl(appName: string): string | null {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_AUTH_PROXY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!clientId || !redirectUri) {
    console.warn('[google-auth] Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID or NEXT_PUBLIC_GOOGLE_AUTH_PROXY');
    return null;
  }

  // Encode app context in state for OAuth callback
  const state = btoa(
    JSON.stringify({
      origin: window.location.origin,
      appName,
      supabaseUrl,
      supabaseAnonKey,
    })
  );

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
    state: state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// Initiate Google sign-in flow
export function signInWithGoogle(appName: string = 'Komputeks Blog'): void {
  const url = buildGoogleUrl(appName);
  if (!url) return;

  // Use popup for desktop, full page for mobile
  window.open(url, 'google-auth', isMobile() ? '' : 'width=500,height=600');

  // Listen for OAuth callback via postMessage
  const handler = async (event: MessageEvent) => {
    if (event.data?.type === 'google-auth-denied') {
      window.removeEventListener('message', handler);
      return;
    }

    if (event.data?.type !== 'google-auth-success') return;
    window.removeEventListener('message', handler);

    // Handle token exchange
    if (event.data.access_token && event.data.refresh_token) {
      const { error } = await supabase.auth.setSession({
        access_token: event.data.access_token,
        refresh_token: event.data.refresh_token,
      });
      if (error) console.error('[google-auth] setSession failed:', error.message);
    } else if (event.data.id_token) {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: event.data.id_token,
      });
      if (error) console.error('[google-auth] signInWithIdToken failed:', error.message);
    }
  };

  window.addEventListener('message', handler);
}

// Handle redirect fallback for OAuth flow
export async function handleGoogleRedirect(): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('google_id_token');

  if (!token) return;

  // Remove token from URL
  window.history.replaceState({}, '', window.location.pathname);

  const { error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token,
  });

  if (error) {
    console.error('[google-auth] signInWithIdToken failed:', error.message);
    return;
  }

  // Close popup window after successful auth
  try {
    window.close();
  } catch {
    // Window may not be closable (e.g., not a popup)
  }
}
