/* ============================================================================
   Visitor counting

   Cookieless by design. Two reasons that matters here rather than being a
   nicety: Germany and France are target markets, and cookie-based analytics
   (Google Analytics among them) legally require a consent banner for EU
   visitors. A cookie banner on the first screen of a luxury villa site is a
   miserable first impression, and a meaningful share of people bounce off one.

   Cloudflare Web Analytics needs no cookies, stores no personal data, and
   reports what you actually asked for — how many visits, and which countries
   they came from — plus referrers and which pages get read.

   To switch it on:
     1. dash.cloudflare.com → Analytics & Logs → Web Analytics → Add a site
     2. Enter the site's hostname; it hands you a token
     3. Put it in site/.env.local as VITE_CF_ANALYTICS_TOKEN=...
        and as a repository variable of the same name for the Pages build
     4. Redeploy

   With no token set, nothing loads and no request is made. That is deliberate:
   there is no point counting our own visits while the site is unfinished.
   ========================================================================= */

const TOKEN = import.meta.env.VITE_CF_ANALYTICS_TOKEN;

export function startAnalytics() {
  if (!TOKEN) return;
  if (document.querySelector('script[data-cf-beacon]')) return;

  const s = document.createElement('script');
  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', JSON.stringify({ token: TOKEN }));
  document.head.appendChild(s);
}
