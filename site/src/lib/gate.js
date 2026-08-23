/* ============================================================================
   Where the two sites live

     /        the holding page. Public, always. This is what a guest, a client
              or a search engine sees.
     /demo    the full site, behind a password. What you show people while it
              is still being built.

   /demo is served by a copy of index.html that the deploy places there — see
   .github/workflows/deploy.yml. GitHub Pages has no server-side routing, so a
   path only exists if a file exists at it.

   The password is a KEEP-OUT SIGN, NOT SECURITY. The built JavaScript is
   public, so anyone who opens the developer tools can read it. That is an
   acceptable trade for "do not gawp at this before it is ready" — but nothing
   private may ever sit behind it. Real authentication (Supabase) will guard
   the admin portal, which is a different thing entirely.
   ========================================================================= */

const KEY = 'v25-demo';

const PASSWORD = import.meta.env.VITE_DEMO_PASSWORD ?? 'acid1234';

/** True at /demo and anywhere beneath it — /demo/stay, /demo/contact, and so
    on. Matching the exact path only meant every sub-page silently fell through
    to the holding page, which looked like the site had simply gone blank. */
export function isPreviewPath() {
  const p = window.location.pathname.replace(/\/+$/, '');
  return p.endsWith('/demo') || p.includes('/demo/');
}

export function isUnlocked() {
  try {
    if (localStorage.getItem(KEY) === PASSWORD) return true;
  } catch { /* private browsing */ }

  /* ?key=… lets a link be shared without anyone having to type anything. */
  const fromUrl = new URLSearchParams(window.location.search).get('key');
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
