import { useEffect, useMemo, useState } from 'react';
import {
  getBookings, buildCalendar, findGapNights,
  todayIso, addDays, nightsBetween,
} from '../lib/availability.js';
import { UNITS, PRICING, whatsappLink } from '../data/villa.js';
import Price from '../components/Price.jsx';

/* ============================================================================
   Booking calendar

   Two months side by side, pick a check-in then a check-out. Because there is
   no payment engine yet, this produces an ENQUIRY, not a booking — the wording
   says so throughout, so nobody arrives thinking they have a confirmed room.

   Nights sitting in a gap of three or fewer between two bookings are marked and
   discounted, which turns dead calendar into revenue (John's decision 26).
   ========================================================================= */

const MONTH_NAMES = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];
const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function monthGrid(year, month) {
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  // Monday-first, which is what everyone outside the US expects
  const lead = (first.getDay() + 6) % 7;
  const cells = Array(lead).fill(null);
  for (let d = 1; d <= days; d++) {
    cells.push(
      `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    );
  }
  return cells;
}

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [unitId, setUnitId] = useState('all');
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return { y: n.getFullYear(), m: n.getMonth() };
  });
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  useEffect(() => { getBookings().then(setBookings); }, []);

  const calendar = useMemo(
    () => buildCalendar(bookings, unitId === 'all' ? null : unitId),
    [bookings, unitId]
  );

  const horizon = useMemo(() => {
    const t = todayIso();
    return { from: t, to: addDays(t, 400) };
  }, []);

  const gaps = useMemo(
    () => findGapNights(calendar, horizon.from, horizon.to),
    [calendar, horizon]
  );

  const today = todayIso();

  const pick = (day) => {
    if (!from || (from && to)) { setFrom(day); setTo(null); return; }
    if (day <= from) { setFrom(day); return; }
    setTo(day);
  };

  const nights = from && to ? nightsBetween(from, to) : 0;
  const minNights = PRICING.minNights.standard;

  const nightly = useMemo(() => {
    if (unitId === 'all') return Math.min(...UNITS.map((u) => u.rate));
    return UNITS.find((u) => u.id === unitId)?.rate ?? 0;
  }, [unitId]);

  const inGap = from && to && [...Array(nights)].every((_, i) => gaps.has(addDays(from, i)));
  const rate = inGap ? Math.round(nightly * (1 - PRICING.gapFill.discount)) : nightly;
  const total = rate * nights;

  const label = (d) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-NZ', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

  const enquiry = () => {
    const unit = unitId === 'all'
      ? 'Villa 25 Ekas'
      : UNITS.find((u) => u.id === unitId)?.name;
    return whatsappLink(
      `Enquiry — ${unit}\nCheck in: ${label(from)}\nCheck out: ${label(to)}\n${nights} night${nights === 1 ? '' : 's'}`
    );
  };

  const months = [cursor, { y: cursor.m === 11 ? cursor.y + 1 : cursor.y, m: (cursor.m + 1) % 12 }];

  const step = (n) => setCursor((c) => {
    const d = new Date(c.y, c.m + n, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  return (
    <section id="booking" className="bg-(--color-shell) px-5 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label text-(--color-bronze-lit)">Availability</p>
            <h2 className="mt-6 max-w-2xl text-[clamp(2.1rem,4.4vw,3.6rem)]">
              Find your dates
            </h2>
          </div>
          <p className="max-w-sm text-(--color-text-soft)">
            Pick your nights and send them over. We confirm within a day — this
            reserves nothing until we have replied, so nobody loses a room to a
            form.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          {/* ---- calendar ---- */}
          <div className="border border-(--color-line) bg-(--color-ink) p-5 lg:p-8">
            {/* unit filter */}
            <div className="flex flex-wrap gap-2">
              {[{ id: 'all', name: 'Any room' }, ...UNITS].map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => { setUnitId(u.id); setFrom(null); setTo(null); }}
                  aria-pressed={unitId === u.id}
                  className={`label-sm rounded-xs border px-3.5 py-2 transition-colors ${
                    unitId === u.id
                      ? 'border-(--color-bronze) bg-(--color-bronze) font-semibold text-[#14110C]'
                      : 'border-(--color-line-lit) text-(--color-text-soft) hover:text-(--color-text)'
                  }`}
                >
                  {u.name}
                </button>
              ))}
            </div>

            {/* month nav */}
            <div className="mt-7 flex items-center justify-between">
              <button
                type="button"
                onClick={() => step(-1)}
                className="label-sm rounded-xs border border-(--color-line-lit) px-3 py-2 text-(--color-text-soft) hover:text-(--color-bronze-lit)"
                aria-label="Previous month"
              >
                ←
              </button>
              <p className="label text-(--color-text-mute)">
                {nights > 0 ? `${nights} night${nights === 1 ? '' : 's'} selected` : 'Select check-in'}
              </p>
              <button
                type="button"
                onClick={() => step(1)}
                className="label-sm rounded-xs border border-(--color-line-lit) px-3 py-2 text-(--color-text-soft) hover:text-(--color-bronze-lit)"
                aria-label="Next month"
              >
                →
              </button>
            </div>

            <div className="mt-7 grid gap-8 sm:grid-cols-2">
              {months.map(({ y, m }) => (
                <div key={`${y}-${m}`}>
                  <p className="font-(family-name:--font-display) text-lg">
                    {MONTH_NAMES[m]} <span className="text-(--color-text-mute)">{y}</span>
                  </p>

                  <div className="mt-4 grid grid-cols-7 gap-y-1">
                    {DOW.map((d, i) => (
                      <span
                        key={i}
                        className="pb-2 text-center text-[10px] uppercase tracking-[0.16em] text-(--color-text-mute)"
                      >
                        {d}
                      </span>
                    ))}

                    {monthGrid(y, m).map((day, i) => {
                      if (!day) return <span key={`e${i}`} />;

                      const past = day < today;
                      const state = calendar.get(day);
                      const full = state?.free === 0;
                      const partial = state && state.free > 0 && state.free < state.total;
                      const gap = gaps.has(day);

                      const selected = from && to && day >= from && day < to;
                      const isEdge = day === from || day === to;
                      const disabled = past || full;

                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={disabled}
                          onClick={() => pick(day)}
                          aria-label={`${label(day)}${full ? ' — fully booked' : gap ? ' — discounted' : ''}`}
                          className={[
                            'relative aspect-square text-[13px] tabular-nums transition-colors',
                            disabled && 'cursor-not-allowed text-(--color-text-mute)/35 line-through',
                            !disabled && !selected && !isEdge && 'text-(--color-text-soft) hover:bg-(--color-raise) hover:text-(--color-text)',
                            selected && !isEdge && 'bg-(--color-bronze)/22 text-(--color-text)',
                            isEdge && 'bg-(--color-bronze) font-semibold text-[#14110C]',
                          ].filter(Boolean).join(' ')}
                        >
                          {new Date(day + 'T00:00:00').getDate()}
                          {/* dots: gap night, or partly booked */}
                          {!disabled && gap && !isEdge && (
                            <span className="absolute inset-x-0 bottom-1 mx-auto block h-1 w-1 rounded-full bg-(--color-reef)" />
                          )}
                          {!disabled && partial && !gap && !isEdge && (
                            <span className="absolute inset-x-0 bottom-1 mx-auto block h-1 w-1 rounded-full bg-(--color-bronze)/60" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* key */}
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-(--color-line) pt-5">
              {[
                ['bg-(--color-bronze)', 'Your dates'],
                ['bg-(--color-reef)', 'Gap night — 20% off'],
                ['bg-(--color-bronze)/60', 'Some rooms left'],
                ['bg-(--color-text-mute)/35', 'Fully booked'],
              ].map(([dot, text]) => (
                <li key={text} className="flex items-center gap-2">
                  <span className={`block h-2 w-2 rounded-full ${dot}`} />
                  <span className="label-sm text-(--color-text-mute)">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ---- summary ---- */}
          <aside className="flex h-fit flex-col border border-(--color-line) bg-(--color-raise) p-7 lg:sticky lg:top-28 lg:p-8">
            <p className="label text-(--color-bronze-lit)">Your enquiry</p>

            <dl className="mt-6 flex flex-col">
              {[
                ['Check in', from ? label(from) : '—'],
                ['Check out', to ? label(to) : '—'],
                ['Nights', nights || '—'],
                ['Room', unitId === 'all' ? 'Any' : UNITS.find((u) => u.id === unitId)?.name],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-b border-(--color-line) py-3">
                  <dt className="label-sm text-(--color-text-mute)">{k}</dt>
                  <dd className="text-right text-[15px]">{v}</dd>
                </div>
              ))}
            </dl>

            {nights > 0 && (
              <div className="mt-6">
                {inGap && (
                  <p className="mb-4 border-l-2 border-(--color-reef) pl-3 text-[14px] text-(--color-text-soft)">
                    These nights sit in a gap between bookings, so they are{' '}
                    {Math.round(PRICING.gapFill.discount * 100)}% off.
                  </p>
                )}
                <div className="flex items-baseline justify-between gap-4">
                  <span className="label-sm text-(--color-text-mute)">
                    {nights} × {unitId === 'all' ? 'from' : ''}
                  </span>
                  <Price amount={rate} className="text-[15px]" />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-(--color-line-lit) pt-4">
                  <span className="label text-(--color-text)">Total</span>
                  <Price amount={total} className="font-(family-name:--font-display) text-2xl" />
                </div>
                <p className="label-sm mt-3 text-(--color-text-mute)">
                  {Math.round(PRICING.deposit * 100)}% deposit to confirm
                </p>
              </div>
            )}

            {nights > 0 && nights < minNights && (
              <p className="mt-5 text-[14px] text-(--color-alert)">
                Minimum stay is {minNights} nights — send it anyway and we will
                see what we can do.
              </p>
            )}

            <a
              href={from && to ? enquiry() : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!from || !to}
              className={`label btn mt-7 text-center ${
                from && to
                  ? 'btn-solid'
                  : 'btn-line pointer-events-none opacity-45'
              }`}
            >
              {from && to ? 'Send this enquiry' : 'Pick your dates'}
            </a>

            <p className="mt-4 text-[13px] leading-relaxed text-(--color-text-mute)">
              This sends a message on WhatsApp — it does not book anything.
              We will confirm availability and send payment details.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
