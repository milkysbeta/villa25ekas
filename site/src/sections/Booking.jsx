import { useEffect, useMemo, useState } from 'react';
import CurrencyPicker from '../components/CurrencyPicker.jsx';
import {
  getBookings, buildCalendar, findGapNights,
  todayIso, addDays, nightsBetween,
} from '../lib/availability.js';
import { lookup } from '../lib/promo.js';
import { UNITS, PRICING, CONTACT, whatsappLink } from '../data/villa.js';
import Price from '../components/Price.jsx';
import Parallax from '../components/Parallax.jsx';
import { IMAGES } from '../data/images.js';
import { formatIdr } from '../lib/currency.js';

/* ============================================================================
   Availability, estimate and enquiry

   Pick dates, apply a friends code if you have one, see what it comes to, then
   send it. Because there is no payment engine yet, this produces an ENQUIRY
   rather than a booking — the wording says so at every step, so nobody leaves
   thinking they have a confirmed room.

   The enquiry posts to FormSubmit, which emails it straight through and sends
   the guest an automatic acknowledgement. No backend, no account, and it works
   from a static host.
   ========================================================================= */

const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];
const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function monthGrid(year, month) {
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7;         // Monday-first
  const cells = Array(lead).fill(null);
  for (let d = 1; d <= days; d++) {
    cells.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  }
  return cells;
}

const pretty = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-NZ',
    { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [unitId, setUnitId] = useState('all');
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return { y: n.getFullYear(), m: n.getMonth() };
  });
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [guests, setGuests] = useState(2);

  const [codeInput, setCodeInput] = useState('');
  const [promo, setPromo] = useState(null);      // {label, discount, note}
  const [codeError, setCodeError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(
    () => new URLSearchParams(window.location.search).get('sent') === '1'
  );

  useEffect(() => { getBookings().then(setBookings); }, []);

  const calendar = useMemo(
    () => buildCalendar(bookings, unitId === 'all' ? null : unitId),
    [bookings, unitId]
  );

  const today = todayIso();
  const gaps = useMemo(
    () => findGapNights(calendar, today, addDays(today, 400)),
    [calendar, today]
  );

  const pick = (day) => {
    if (!from || (from && to)) { setFrom(day); setTo(null); return; }
    if (day <= from) { setFrom(day); return; }
    setTo(day);
  };

  const nights = from && to ? nightsBetween(from, to) : 0;
  const unit = unitId === 'all' ? null : UNITS.find((u) => u.id === unitId);
  const baseRate = unit ? unit.rate : Math.min(...UNITS.map((u) => u.rate));

  /* Gap nights and friends codes both discount the nightly rate. They stack,
     because a friend filling an awkward two-night hole is doing you a favour
     twice over. */
  const inGap = PRICING.gapFill.enabled
    && nights > 0
    && [...Array(nights)].every((_, i) => gaps.has(addDays(from, i)));
  const gapCut = inGap && PRICING.gapFill.enabled ? PRICING.gapFill.discount : 0;
  const codeCut = promo ? promo.discount : 0;

  const nightly = Math.round(baseRate * (1 - gapCut) * (1 - codeCut));
  const subtotal = baseRate * nights;
  const total = nightly * nights;
  const saved = subtotal - total;
  const deposit = Math.round(total * PRICING.deposit);

  const applyCode = (e) => {
    e.preventDefault();
    const res = lookup(codeInput);
    if (res.ok) { setPromo(res); setCodeError(''); }
    else { setPromo(null); setCodeError(res.reason); }
  };

  const clearCode = () => { setPromo(null); setCodeInput(''); setCodeError(''); };

  const months = [cursor, { y: cursor.m === 11 ? cursor.y + 1 : cursor.y, m: (cursor.m + 1) % 12 }];
  const step = (n) => setCursor((c) => {
    const d = new Date(c.y, c.m + n, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  const minNights = PRICING.minNights.standard;
  const tooShort = nights > 0 && nights < minNights;

  /* Everything the enquiry email needs, assembled once so the hidden form and
     the WhatsApp fallback cannot drift apart. */
  const summaryText = () => [
    `Room: ${unit ? unit.name : 'Any room, happy to be advised'}`,
    `Check in: ${from ? pretty(from) : '–'}`,
    `Check out: ${to ? pretty(to) : '–'}`,
    `Nights: ${nights}`,
    `Guests: ${guests}`,
    promo ? `Friends code: ${promo.code}, ${promo.label} (${Math.round(promo.discount * 100)}% off)` : null,
    inGap ? `Gap nights: yes (${Math.round(gapCut * 100)}% off)` : null,
    '',
    `Nightly: ${formatIdr(nightly)}`,
    `Estimated total: ${formatIdr(total)}`,
    PRICING.deposit > 0
      ? `Deposit to confirm (${Math.round(PRICING.deposit * 100)}%): ${formatIdr(deposit)}`
      : `No deposit. Free cancellation until ${PRICING.freeCancellationDays} days before arrival, `
        + 'paid in full after that.',
  ].filter(Boolean).join('\n');

  const nextUrl = `${window.location.origin}${import.meta.env.BASE_URL}?sent=1#booking`;

  return (
    <Parallax
      src={IMAGES.availability.src}
      alt={IMAGES.availability.alt}
      /* Same treatment as the surf page: the whole frame at full width, top
         aligned, dissolving into the page. See Parallax for why this mode does
         not translate. */
      fit="width"
      ratio="1672 / 941"
      /* Opened up now the calendar and the enquiry panel are frosted glass
         rather than text sitting straight on the photograph. The panes carry
         the contrast, so the wash behind them can halve and let the water
         through. Measured against the blurred backdrop with a 45 per cent pane
         over it: body text 4.61:1. */
      overlay="linear-gradient(to bottom, rgba(16,14,11,.48) 0%, rgba(16,14,11,.54) 30%, rgba(16,14,11,.82) 62%, rgba(16,14,11,.96) 100%)"
    >
      <section
        id="booking"
        className="px-5 py-28 lg:px-10 lg:py-40"
        style={{ textShadow: '0 1px 2px rgba(16,14,11,.85), 0 0 14px rgba(16,14,11,.55)' }}
      >
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label text-(--color-bronze-lit)">Availability</p>
            <h2 className="mt-6 max-w-2xl text-[clamp(2.1rem,4.4vw,3.6rem)]">Find your dates</h2>
          </div>
          <p className="max-w-sm text-(--color-text-soft)">
            Pick your nights and send them over. We answer within a day. Nothing
            is charged and nothing is held until we have written back.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-14">

          {/* ------------------------------- calendar ------------------------------ */}
          <div className="rounded-xs border border-(--color-line-lit) bg-(--color-ink)/45 backdrop-blur-lg p-5 lg:p-8">
            <div className="flex flex-wrap gap-2">
              {[{ id: 'all', name: 'Any room' }, ...UNITS].map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => { setUnitId(u.id); setFrom(null); setTo(null); }}
                  aria-pressed={unitId === u.id}
                  className={`rounded-xs border px-4 py-2.5 text-[13px] uppercase tracking-[0.12em] transition-colors ${
                    unitId === u.id
                      ? 'border-(--color-bronze) bg-(--color-bronze) font-semibold text-[#14110C]'
                      : 'border-(--color-line-lit) text-(--color-text-soft) hover:text-(--color-text)'
                  }`}
                >
                  {u.name}
                </button>
              ))}
            </div>

            <div className="mt-7 flex items-center justify-between">
              <button type="button" onClick={() => step(-1)} aria-label="Previous month"
                className="rounded-xs border border-(--color-line-lit) px-4 py-2.5 text-[16px] text-(--color-text-soft) hover:text-(--color-bronze-lit)">←</button>
              <p className="text-[14px] uppercase tracking-[0.16em] text-(--color-text-soft)">
                {nights > 0
                  ? `${nights} night${nights === 1 ? '' : 's'}`
                  : from ? 'Now pick your check-out' : 'Pick your check-in'}
              </p>
              <button type="button" onClick={() => step(1)} aria-label="Next month"
                className="rounded-xs border border-(--color-line-lit) px-4 py-2.5 text-[16px] text-(--color-text-soft) hover:text-(--color-bronze-lit)">→</button>
            </div>

            <div className="mt-7 grid gap-8 sm:grid-cols-2">
              {months.map(({ y, m }) => (
                <div key={`${y}-${m}`}>
                  <p className="font-(family-name:--font-display) text-xl">
                    {MONTHS[m]} <span className="text-(--color-text-mute)">{y}</span>
                  </p>
                  <div className="mt-4 grid grid-cols-7 gap-y-1">
                    {DOW.map((d, i) => (
                      <span key={i} className="pb-3 text-center text-[13px] uppercase tracking-[0.14em] text-(--color-text-soft)">{d}</span>
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
                          aria-label={`${pretty(day)}${full ? ', fully booked' : gap ? ', discounted' : ''}`}
                          className={[
                            'relative aspect-square text-[17px] tabular-nums transition-colors',
                            disabled && 'cursor-not-allowed text-(--color-text-mute)/35 line-through',
                            !disabled && !selected && !isEdge && 'text-(--color-text-soft) hover:bg-(--color-raise) hover:text-(--color-text)',
                            selected && !isEdge && 'bg-(--color-bronze)/22 text-(--color-text)',
                            isEdge && 'bg-(--color-bronze) font-semibold text-[#14110C]',
                          ].filter(Boolean).join(' ')}
                        >
                          {new Date(day + 'T00:00:00').getDate()}
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

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-(--color-line) pt-5">
              {[
                ['bg-(--color-bronze)', 'Your dates'],
                ...(PRICING.gapFill.enabled
                  ? [['bg-(--color-reef)', `Gap night, ${Math.round(PRICING.gapFill.discount * 100)}% off`]]
                  : []),
                ['bg-(--color-bronze)/60', 'Some rooms left'],
                ['bg-(--color-text-mute)/35', 'Fully booked'],
              ].map(([dot, text]) => (
                <li key={text} className="flex items-center gap-2">
                  <span className={`block h-2 w-2 rounded-full ${dot}`} />
                  <span className="text-[13px] text-(--color-text-soft)">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ------------------------------- summary ------------------------------- */}
          <aside className="flex h-fit flex-col rounded-xs border border-(--color-line-lit) bg-(--color-ink)/45 backdrop-blur-lg p-7 lg:sticky lg:top-28 lg:p-8">

            {sent ? (
              <div>
                <p className="label text-(--color-bronze-lit)">Enquiry sent</p>
                <h3 className="mt-4 text-2xl">Thank you, we have it</h3>
                <p className="mt-4 text-(--color-text-soft)">
                  We will come back to you within a day, usually sooner, with
                  confirmation and how to pay the deposit. Check your junk folder
                  if nothing has arrived by tomorrow.
                </p>
                <button
                  type="button"
                  onClick={() => { setSent(false); setShowForm(false); setFrom(null); setTo(null); }}
                  className="label btn btn-line mt-7"
                >
                  Make another enquiry
                </button>
              </div>
            ) : (
              <>
                <p className="label text-(--color-bronze-lit)">Your stay</p>
                <CurrencyPicker className="mt-5" label="Prices in" />

                <dl className="mt-6 flex flex-col">
                  {[
                    ['Check in', from ? pretty(from) : '–'],
                    ['Check out', to ? pretty(to) : '–'],
                    ['Nights', nights || '–'],
                    ['Room', unit ? unit.name : 'Any'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 border-b border-(--color-line) py-3">
                      <dt className="text-[14px] text-(--color-text-soft)">{k}</dt>
                      <dd className="text-right text-[16px]">{v}</dd>
                    </div>
                  ))}
                  <div className="flex items-center justify-between gap-4 border-b border-(--color-line) py-3">
                    <dt className="text-[14px] text-(--color-text-soft)">Guests</dt>
                    <dd className="flex items-center gap-2">
                      <button type="button" aria-label="Fewer guests"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="h-11 w-11 rounded-xs border border-(--color-line-lit) text-[18px] text-(--color-text-soft) hover:border-(--color-bronze) hover:text-(--color-bronze-lit)">−</button>
                      <span className="w-8 text-center text-[17px] tabular-nums">{guests}</span>
                      <button type="button" aria-label="More guests"
                        onClick={() => setGuests((g) => Math.min(14, g + 1))}
                        className="h-11 w-11 rounded-xs border border-(--color-line-lit) text-[18px] text-(--color-text-soft) hover:border-(--color-bronze) hover:text-(--color-bronze-lit)">+</button>
                    </dd>
                  </div>
                </dl>

                {/* friends code */}
                <div className="mt-6">
                  {promo ? (
                    <div className="flex items-start justify-between gap-3 border-l-2 border-(--color-reef) pl-3">
                      <div>
                        <p className="text-[16px] text-(--color-text)">{promo.label}</p>
                        <p className="text-[14px] text-(--color-text-soft)">
                          {Math.round(promo.discount * 100)}% off · {promo.note}
                        </p>
                      </div>
                      <button type="button" onClick={clearCode}
                        className="shrink-0 text-[14px] text-(--color-text-soft) hover:text-(--color-text)">Remove</button>
                    </div>
                  ) : (
                    <form onSubmit={applyCode} className="flex gap-2">
                      <input
                        type="text"
                        value={codeInput}
                        onChange={(e) => { setCodeInput(e.target.value); setCodeError(''); }}
                        placeholder="Friends code"
                        aria-label="Friends code"
                        className="min-w-0 flex-1 rounded-xs border border-(--color-line-lit) bg-(--color-ink) px-3.5 py-3 text-[16px] uppercase tracking-[0.1em] text-(--color-text) placeholder:normal-case placeholder:tracking-normal placeholder:text-(--color-text-mute)"
                      />
                      <button type="submit"
                        className="shrink-0 rounded-xs border border-(--color-line-lit) px-4 text-[14px] text-(--color-text-soft) hover:border-(--color-bronze) hover:text-(--color-bronze-lit)">Apply</button>
                    </form>
                  )}
                  {codeError && <p className="mt-2 text-[14px] text-(--color-alert)">{codeError}</p>}
                </div>

                {/* estimate */}
                {nights > 0 && (
                  <div className="mt-7 border-t border-(--color-line) pt-5">
                    <div className="flex items-baseline justify-between gap-4 py-1">
                      <span className="text-[15px] text-(--color-text-soft)">
                        {nights} night{nights === 1 ? '' : 's'} × {unit ? '' : 'from '}
                      </span>
                      <Price amount={baseRate} className="text-[15px] text-(--color-text-soft)" />
                    </div>

                    {inGap && (
                      <div className="flex items-baseline justify-between gap-4 py-1">
                        <span className="text-[15px] text-(--color-reef)">
                          Gap nights −{Math.round(gapCut * 100)}%
                        </span>
                      </div>
                    )}
                    {promo && (
                      <div className="flex items-baseline justify-between gap-4 py-1">
                        <span className="text-[15px] text-(--color-reef)">
                          {promo.label} −{Math.round(codeCut * 100)}%
                        </span>
                      </div>
                    )}
                    {saved > 0 && (
                      <div className="flex items-baseline justify-between gap-4 py-1">
                        <span className="text-[15px] text-(--color-text-soft)">You save</span>
                        <Price amount={saved} className="text-[15px] text-(--color-reef)" />
                      </div>
                    )}

                    <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-(--color-line-lit) pt-4">
                      <span className="label text-(--color-text)">Estimate</span>
                      <Price amount={total} className="font-(family-name:--font-display) text-2xl" />
                    </div>
                    <p className="mt-2 text-[14px] text-(--color-text-soft)">
                      {PRICING.deposit > 0
                        ? `${Math.round(PRICING.deposit * 100)}% deposit of ${formatIdr(deposit)}`
                        : `No deposit. Free cancellation until ${PRICING.freeCancellationDays} days before arrival.`}
                    </p>
                    {!unit && (
                      <p className="mt-3 text-[14px] text-(--color-text-soft)">
                        Based on the lowest nightly rate. We will confirm the exact
                        figure with the room.
                      </p>
                    )}
                  </div>
                )}

                {tooShort && (
                  <p className="mt-5 text-[15px] text-(--color-alert)">
                    Minimum stay is {minNights} nights. Send it anyway and we will
                    see what we can do.
                  </p>
                )}

                {/* ---- checkout ---- */}
                {!showForm ? (
                  <button
                    type="button"
                    disabled={!from || !to}
                    onClick={() => setShowForm(true)}
                    className={`label btn mt-7 text-center ${
                      from && to ? 'btn-solid' : 'btn-line cursor-not-allowed opacity-45'
                    }`}
                  >
                    {from && to ? 'Request these dates' : 'Pick your dates'}
                  </button>
                ) : (
                  <form
                    action={`https://formsubmit.co/${CONTACT.email}`}
                    method="POST"
                    className="mt-7 border-t border-(--color-line) pt-6"
                  >
                    <input type="hidden" name="_subject"
                      value={`Booking enquiry, ${from ? pretty(from) : ''} · ${nights} nights`} />
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_template" value="box" />
                    <input type="hidden" name="_next" value={nextUrl} />
                    <input type="hidden" name="Stay" value={summaryText()} />
                    <input
                      type="hidden"
                      name="_autoresponse"
                      value={
                        `Thank you for your enquiry about Villa 25 Ekas.\n\n` +
                        `${summaryText()}\n\n` +
                        `This is an automatic acknowledgement. It does not confirm your ` +
                        `booking. We will write back within a day with availability and ` +
                        `how to pay the deposit.\n\n` +
                        `Villa 25 Ekas · Ekas Bay, Lombok\n${CONTACT.phoneShow}`
                      }
                    />

                    <p className="label mb-4 text-(--color-bronze-lit)">Your details</p>

                    <div className="flex flex-col gap-3">
                      <input required type="text" name="Name" placeholder="Your name" aria-label="Your name"
                        className="w-full rounded-xs border border-(--color-line-lit) bg-(--color-ink) px-3.5 py-3 text-[16px] text-(--color-text) placeholder:text-(--color-text-mute)" />
                      <input required type="email" name="Email" placeholder="Email" aria-label="Email"
                        className="w-full rounded-xs border border-(--color-line-lit) bg-(--color-ink) px-3.5 py-3 text-[16px] text-(--color-text) placeholder:text-(--color-text-mute)" />
                      <input type="tel" name="Phone" placeholder="Phone or WhatsApp (optional)" aria-label="Phone"
                        className="w-full rounded-xs border border-(--color-line-lit) bg-(--color-ink) px-3.5 py-3 text-[16px] text-(--color-text) placeholder:text-(--color-text-mute)" />
                      <textarea name="Message" rows="3" placeholder="Anything we should know? Flights, surf ability, dietary needs…"
                        aria-label="Message"
                        className="w-full resize-y rounded-xs border border-(--color-line-lit) bg-(--color-ink) px-3.5 py-3 text-[16px] text-(--color-text) placeholder:text-(--color-text-mute)" />
                    </div>

                    <button type="submit" className="label btn btn-solid mt-5 w-full text-center">
                      Send enquiry
                    </button>

                    <p className="mt-4 text-[14px] leading-relaxed text-(--color-text-soft)">
                      This sends us your dates. It does not book or charge anything.
                      We confirm by email, then send deposit details.
                    </p>

                    <p className="mt-4 text-center text-[14px] text-(--color-text-soft)">
                      Rather message?{' '}
                      <a
                        href={whatsappLink(`Villa 25 Ekas enquiry\n\n${summaryText()}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-(--color-bronze-lit) underline underline-offset-4"
                      >
                        Send this on WhatsApp
                      </a>
                    </p>
                  </form>
                )}
              </>
            )}
          </aside>
        </div>
      </div>
      </section>
    </Parallax>
  );
}
