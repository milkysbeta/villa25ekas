/* ============================================================================
   Friends codes

   A code knocks a percentage off the nightly rate. Kept here as a plain list
   for now; when Supabase goes in, only `lookup` changes — everything else works
   off the same shape, so the checkout never has to be touched.

   Codes are matched case-insensitively and ignore spaces, because people will
   type them off a napkin or a WhatsApp message.

   NOTE: this is a client-side check, so the code list ships to the browser and
   anyone curious can read it. That is fine for what this is — a courtesy
   discount for people you know, not a security boundary. The real protection is
   that you confirm every booking by hand before any money changes hands. Do not
   put anything here you would mind a stranger finding.
   ========================================================================= */

const CODES = [
  {
    code: 'FRIENDS',
    label: 'Friends of Villa 25',
    discount: 0.2,
    note: 'Friends and family rate',
  },
  {
    code: 'EKASLOCAL',
    label: 'Local rate',
    discount: 0.15,
    note: 'For our neighbours in Ekas',
  },
  {
    code: 'FIRSTWAVE',
    label: 'Opening season',
    discount: 0.25,
    note: 'Opening season rate, first guests only',
    // TODO confirm the real cut-off with John before this goes public
    expires: '2026-12-31',
  },
];

const tidy = (s) => (s || '').trim().toUpperCase().replace(/[\s-]/g, '');

/**
 * @returns {{ok:true, code, label, discount, note} | {ok:false, reason:string}}
 */
export function lookup(input) {
  const key = tidy(input);
  if (!key) return { ok: false, reason: '' };

  const hit = CODES.find((c) => tidy(c.code) === key);
  if (!hit) return { ok: false, reason: 'That code is not one of ours.' };

  if (hit.expires && new Date(hit.expires + 'T23:59:59') < new Date()) {
    return { ok: false, reason: 'That code has expired. Ask us and we will sort something out.' };
  }

  if (hit.minNights) {
    return { ok: true, ...hit };
  }
  return { ok: true, ...hit };
}
