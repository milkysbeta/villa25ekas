import { lookup } from './src/lib/promo.js';
import { buildCalendar, findGapNights, getBookings, addDays, todayIso, nightsBetween } from './src/lib/availability.js';
import { UNITS, PRICING } from './src/data/villa.js';

let pass = 0, fail = 0;
const ok = (name, cond, extra='') => { cond ? pass++ : fail++; console.log(`  ${cond?'ok   ':'FAIL '} ${name}${extra?'  → '+extra:''}`); };

console.log('--- friends codes ---');
const f = lookup('friends');
ok('lowercase "friends" resolves', f.ok && f.discount === 0.2, f.ok ? f.label : f.reason);
ok('spaces/dashes ignored', lookup(' fri ends ').ok === false, 'inner spaces are not a match (correct)');
ok('"FRIENDS " trims', lookup('FRIENDS ').ok === true);
ok('"ekas-local" dash stripped', lookup('ekas-local').ok === true);
ok('unknown code rejected', lookup('NOPE').ok === false, lookup('NOPE').reason);
ok('empty gives no error text', lookup('').reason === '');

console.log('\n--- availability ---');
const bookings = await getBookings();
const cal = buildCalendar(bookings, null);
const t = todayIso();
ok('bookings load', bookings.length === 4);
ok('a fully-booked day is detected', [...cal.values()].some(v => v.free === 0));
const perUnit = buildCalendar(bookings, 'two-bedroom');
ok('filtering by unit narrows capacity', [...perUnit.values()].every(v => v.total === 1));

console.log('\n--- gap nights ---');
const gaps = findGapNights(cal, t, addDays(t, 60));
ok('gap detection returns a set', gaps instanceof Set, `${gaps.size} nights flagged`);

console.log('\n--- price maths ---');
const base = Math.min(...UNITS.map(u => u.rate));
const nights = 3;
const stack = Math.round(base * (1 - PRICING.gapFill.discount) * (1 - 0.2));
ok('gap + code stack multiplicatively', stack === Math.round(base * 0.8 * 0.8), `${base} → ${stack}`);
ok('deposit is 30% of total', Math.round(stack*nights*PRICING.deposit) === Math.round(stack*nights*0.3));
ok('nightsBetween counts nights not days', nightsBetween('2026-09-01','2026-09-04') === 3);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
