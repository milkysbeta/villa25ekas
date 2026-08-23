/* ============================================================================
   Availability

   Reads from a plain module for now. When Supabase goes in, only `getBookings`
   changes — everything else works off the same shape, so the calendar itself
   never has to be touched.

   Statuses:
     booked  — paid and confirmed, nobody else can have it
     held    — an enquiry has a provisional hold (72 hours by default) while a
               transfer clears. Still shown as unavailable, but flagged
               differently in the admin portal so a second enquiry can be taken
               as a backup rather than turned away.
     owners  — the upstairs apartment while John and Alison are on site
   ========================================================================= */

import { PRICING, UNITS } from '../data/villa.js';

/* Format from LOCAL date parts, never toISOString().

   toISOString() converts to UTC first. A Date built at local midnight in a
   UTC+ timezone is still the previous day in UTC, so `addDays(x, 1)` returned
   x unchanged — and every loop that advances a cursor by calling it spun
   forever, hung the renderer and killed the tab. It only showed up east of
   Greenwich, which is where the owners are.

   Calendar dates here are civil dates — "the night of the 3rd" — not instants.
   They must never touch a timezone conversion. */
const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const todayIso = () => iso(new Date());

export function addDays(dateIso, n) {
  const d = new Date(dateIso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return iso(d);
}

export function nightsBetween(a, b) {
  return Math.round(
    (new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86_400_000
  );
}

/* Placeholder data so the calendar can be reviewed before the database exists.
   Dates are generated relative to today, so it never looks stale.
   TODO: replace with a Supabase query once the project is created. */
export async function getBookings() {
  const t = todayIso();
  return [
    { unitId: 'two-bedroom',        from: addDays(t, 9),  to: addDays(t, 14), status: 'booked' },
    { unitId: 'garden-rooms',       from: addDays(t, 3),  to: addDays(t, 6),  status: 'booked' },
    { unitId: 'garden-rooms',       from: addDays(t, 21), to: addDays(t, 25), status: 'held' },
    { unitId: 'upstairs-apartment', from: addDays(t, 2),  to: addDays(t, 30), status: 'owners' },
  ];
}

/* Belt and braces: a date cursor that fails to advance used to spin forever
   and take the page down with it. This throws instead, so the same class of
   bug shows up as a visible error rather than a frozen browser. */
function* eachDay(from, to, cap = 1000) {
  let d = from;
  for (let i = 0; d < to; i += 1) {
    if (i > cap) throw new Error(`eachDay: cursor stuck at ${d} (from ${from} to ${to})`);
    yield d;
    const next = addDays(d, 1);
    if (next <= d) throw new Error(`eachDay: addDays did not advance past ${d}`);
    d = next;
  }
}

/** Every date in [from, to) — checkout day is free for the next guest. */
function expand(from, to) {
  return [...eachDay(from, to)];
}

/**
 * Day-by-day state for one unit, or for the whole property.
 * @returns {Map<string, {status:string, free:number, total:number}>}
 */
export function buildCalendar(bookings, unitId = null) {
  const units = unitId ? UNITS.filter((u) => u.id === unitId) : UNITS;
  const capacity = units.reduce((n, u) => n + u.count, 0);
  const map = new Map();

  for (const b of bookings) {
    const unit = units.find((u) => u.id === b.unitId);
    if (!unit) continue;
    for (const day of expand(b.from, b.to)) {
      const cur = map.get(day) ?? { taken: 0, status: 'open' };
      cur.taken += 1;
      // a hard booking always wins over a soft hold in what we display
      if (b.status === 'booked' || cur.status === 'open') cur.status = b.status;
      if (b.status === 'booked') cur.status = 'booked';
      map.set(day, cur);
    }
  }

  const out = new Map();
  for (const [day, v] of map) {
    const free = Math.max(0, capacity - v.taken);
    out.set(day, {
      status: free === 0 ? v.status : 'partial',
      free,
      total: capacity,
    });
  }
  return out;
}

/** Gaps of three nights or fewer between bookings, offered at a discount. */
export function findGapNights(calendar, from, to) {
  const gaps = new Set();
  let run = [];
  for (const d of eachDay(from, to, 2000)) {
    const busy = calendar.get(d)?.free === 0;
    if (busy) {
      if (run.length && run.length <= PRICING.gapFill.maxGapNights) {
        run.forEach((x) => gaps.add(x));
      }
      run = [];
    } else {
      run.push(d);
    }
  }
  return gaps;
}
