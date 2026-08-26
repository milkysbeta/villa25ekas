import { IMAGES } from '../data/images.js';

/* ============================================================================
   Warming the next page's background image.

   WHY NOT JUST PRELOAD THEM ALL. `rel="preload"` is a high-priority,
   competes-with-everything-else fetch. Eight backgrounds is about 1.6 MB, and
   preloading the lot would have every visitor download seven photographs they
   may never look at, in a queue ahead of the one they are looking at now. That
   makes the page they are actually on slower to settle, which is the opposite
   of the point. On a phone on Indonesian mobile data it is worse than
   pointless.

   So: `rel="prefetch"`, which browsers treat as idle-priority and will
   deprioritise or drop under pressure, and only for a page the visitor has
   shown some intent to open — a pointer resting on a nav link, a keyboard
   focus landing on one, a finger touching it. By the time the click lands the
   image is usually there, and nothing was fetched speculatively for somebody
   who never went.

   Two people get nothing: anyone who has asked their browser to save data, and
   anyone on a 2g-class connection. Both are exactly the people a speculative
   megabyte hurts most.
   ========================================================================= */

/** Which photograph each page opens with. Pages not listed have no background. */
const PAGE_IMAGE = {
  '': ['hero', 'welcome'],
  stay: ['stay'],
  availability: ['availability'],
  surf: ['surf'],
  'off-grid': ['offgrid'],
  'getting-here': ['journey'],
  contact: ['closing'],
};

const done = new Set();

function thrifty() {
  const c = navigator.connection;
  if (!c) return false;
  return c.saveData === true || /(^|-)2g$/.test(c.effectiveType ?? '');
}

/** Ask the browser to fetch one image when it has nothing better to do. */
function warmOne(src) {
  if (!src || done.has(src)) return;
  done.add(src);
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
}

/**
 * Warm the background image(s) for a page slug. Safe to call repeatedly and on
 * every pointer move — each source is only ever requested once.
 */
export function warmPage(slug) {
  if (thrifty()) return;
  (PAGE_IMAGE[slug] ?? []).forEach((key) => warmOne(IMAGES[key]?.src));
}

/**
 * After the current page has finished and the browser is idle, warm the two
 * pages someone deciding to book actually walks through. Deliberately not all
 * of them: this is the path from "I like it" to "what does it cost and can I
 * have those dates", and it is two images rather than seven.
 */
export function warmLikelyPages() {
  if (thrifty()) return;
  const go = () => ['stay', 'availability'].forEach(warmPage);
  if ('requestIdleCallback' in window) window.requestIdleCallback(go, { timeout: 4000 });
  else setTimeout(go, 2500);
}
