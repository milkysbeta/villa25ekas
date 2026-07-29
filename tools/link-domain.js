#!/usr/bin/env node
/* ----------------------------------------------------------------------------
   Point villa25ekas.com at the GitHub Pages site.

     node tools/link-domain.js            check DNS, report, change nothing
     node tools/link-domain.js --go       do it

   Everything on the GitHub side is here. The one thing this cannot do is add
   the DNS records at Porkbun — that is the registrar account, and it has to be
   done by hand.

   Order matters. Setting the custom domain before DNS resolves takes the site
   offline at BOTH addresses: github.io starts redirecting to a domain that
   does not answer yet. So --go refuses to run until DNS actually points here.
   ------------------------------------------------------------------------- */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DOMAIN = 'villa25ekas.com';
const REPO = 'milkysbeta/villa25ekas';
const ROOT = path.join(__dirname, '..');

const PAGES_IPS = [
  '185.199.108.153', '185.199.109.153',
  '185.199.110.153', '185.199.111.153',
];

const go = process.argv.includes('--go');
const httpsOnly = process.argv.includes('--https');

const sh = (cmd, opts = {}) =>
  execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe', ...opts }).trim();

function token() {
  const out = sh('printf "protocol=https\\nhost=github.com\\n\\n" | git credential fill');
  const m = out.match(/^password=(.*)$/m);
  if (!m) throw new Error('No GitHub credential found in the credential manager.');
  return m[1];
}

async function api(method, urlPath, body) {
  const res = await fetch(`https://api.github.com${urlPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, json: text ? JSON.parse(text) : null };
}

/* Resolved over HTTPS rather than through the system resolver. This machine
   blocks outbound DNS on port 53 — even long-established domains fail to
   resolve locally — so dns.resolve4 reports NXDOMAIN for names that are
   perfectly live. DNS-over-HTTPS goes out over 443 and tells the truth. */
async function lookup(name, type) {
  const res = await fetch(
    `https://cloudflare-dns.com/dns-query?name=${name}&type=${type}`,
    { headers: { accept: 'application/dns-json' } }
  );
  if (!res.ok) throw new Error(`DoH HTTP ${res.status}`);
  const j = await res.json();
  return (j.Answer || []).map((a) => a.data.replace(/\.$/, ''));
}

async function checkDns() {
  const report = { apex: [], www: null, ok: false };
  try {
    report.apex = await lookup(DOMAIN, 'A');
  } catch { /* not there yet */ }
  try {
    report.www = (await lookup(`www.${DOMAIN}`, 'CNAME'))[0] ?? null;
  } catch { /* optional */ }

  const hit = report.apex.filter((ip) => PAGES_IPS.includes(ip));
  report.matched = hit;
  report.ok = hit.length >= 2;   // at least two of the four is enough to serve
  return report;
}

(async () => {
  console.log(`\nDomain : ${DOMAIN}\nRepo   : ${REPO}\n`);

  /* --https is a separate, later step: GitHub can only enforce HTTPS once it
     has finished issuing the certificate, which takes a while after the domain
     is first attached. */
  if (httpsOnly) {
    const cur = await api('GET', `/repos/${REPO}/pages`);
    console.log(`  custom domain : ${cur.json?.cname || '(none)'}`);
    console.log(`  cert state    : ${cur.json?.https_certificate?.state || 'unknown'}`);
    if (cur.json?.https_certificate?.state !== 'approved') {
      console.log('\n  Certificate is not ready yet. Try again in ten minutes.\n');
      process.exit(1);
    }
    const r = await api('PUT', `/repos/${REPO}/pages`, { https_enforced: true });
    console.log(`\n  Enforce HTTPS enabled (HTTP ${r.status}).\n`);
    process.exit(0);
  }

  const d = await checkDns();
  console.log('DNS');
  console.log(`  apex A records : ${d.apex.length ? d.apex.join(', ') : '(none yet)'}`);
  console.log(`  matching Pages : ${d.matched.length} of 4`);
  console.log(`  www CNAME      : ${d.www || '(none yet)'}`);

  if (!d.ok) {
    console.log(`\n  DNS is not pointing at GitHub Pages yet.`);
    console.log(`  Add these A records at Porkbun with an EMPTY host field:`);
    PAGES_IPS.forEach((ip) => console.log(`    A      ${ip}`));
    console.log(`    CNAME  www  ->  milkysbeta.github.io`);
    console.log(`\n  Then run this again. Nothing has been changed.\n`);
    process.exit(1);
  }

  console.log('\n  DNS looks right.\n');

  if (!go) {
    console.log('Dry run — pass --go to apply. Would do:');
    console.log('  1. write site/public/CNAME');
    console.log('  2. set VITE_BASE to / in the deploy workflow');
    console.log('  3. set the custom domain on GitHub Pages');
    console.log('  4. commit, push, then enable Enforce HTTPS once the cert issues\n');
    process.exit(0);
  }

  /* 1. CNAME file. Required with the Actions deploy method — without it in the
        published artifact, GitHub drops the custom domain on the next push. */
  const cnamePath = path.join(ROOT, 'site', 'public', 'CNAME');
  fs.writeFileSync(cnamePath, DOMAIN + '\n');
  console.log('  wrote site/public/CNAME');

  /* 2. The site now lives at the root of its own domain, so the subpath base
        that Pages needed is no longer correct. */
  const wf = path.join(ROOT, '.github', 'workflows', 'deploy.yml');
  let y = fs.readFileSync(wf, 'utf8');
  y = y.replace(/VITE_BASE: \/villa25ekas\/\n/, 'VITE_BASE: /\n');
  fs.writeFileSync(wf, y);
  console.log('  set VITE_BASE to /');

  /* 3. Tell GitHub about the domain. */
  const r = await api('PUT', `/repos/${REPO}/pages`, { cname: DOMAIN, https_enforced: false });
  console.log(`  set custom domain (HTTP ${r.status})`);

  /* 4. Ship it. */
  sh('git add -A');
  sh(`git -c user.name="Milky" -c user.email="milkysbeta@gmail.com" commit -q -m "Serve the site from villa25ekas.com

CNAME file is required with the Actions deploy method or GitHub drops the
custom domain on every push. Base moves from /villa25ekas/ to / now that
the site sits at a domain root."`);
  sh('git push -q origin main');
  console.log('  committed and pushed');

  console.log(`
Done. GitHub is now issuing a Let's Encrypt certificate, which usually takes
15–45 minutes. Once it has, run:

  node tools/link-domain.js --https

to turn on Enforce HTTPS. Until then http://${DOMAIN} works and https:// may
warn.
`);
})().catch((e) => {
  console.error('\nFailed:', e.message, '\n');
  process.exit(1);
});
