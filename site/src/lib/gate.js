/* ============================================================================
   Preview gate

   While the site is in coming-soon mode the public sees only the holding page.
   Anyone with the preview password sees the whole site, on the same domain,
   so it can be shown to friends and clients before launch.

   This is a soft gate, not security. The built JavaScript is public, so anyone
   determined can read the password out of it. That is an acceptable trade for
   "stop the site being indexed and gawped at before it is ready" — but nothing
   private must ever sit behind it. Real authentication (Supabase) guards the
   admin portal, which is a different thing entirely.
   ========================================================================= */

const KEY = 'v25-preview';

export const COMING_SOON =
  (import.meta.env.VITE_COMING_SOON ?? 'true') !== 'false';

const PASSWORD = import.meta.env.VITE_PREVIEW_PASSWORD ?? 'ekasadmin123';

export function isUnlocked() {
  if (!COMING_SOON) return true;
  try {
    if (localStorage.getItem(KEY) === PASSWORD) return true;
  } catch { /* private browsing */ }
  // ?preview=… lets a link be shared without anyone typing anything
  const fromUrl = new URLSearchParams(window.location.search).get('preview');
  if (fromUrl && fromUrl === PASSWORD) {
    unlock(fromUrl);
    return true;
  }
  return false;
}

export function unlock(attempt) {
  if (attempt !== PASSWORD) return false;
  try { localStorage.setItem(KEY, attempt); } catch { /* ignore */ }
  return true;
}

export function lock() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
