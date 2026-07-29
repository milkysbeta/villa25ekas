import { useEffect, useState } from 'react';
import { LOGO } from '../data/images.js';
import { whatsappLink } from '../data/villa.js';
import { CURRENCIES } from '../lib/currency.js';
import { SECTIONS } from '../lib/context.js';


export default function Nav({ currency, onCurrency }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState('');

  /* The header is transparent over the hero and fills in once you leave it —
     the same behaviour as both reference sites, and it keeps the logo legible
     against a bright sky. */
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const targets = SECTIONS
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid || open
          ? 'border-b border-(--color-line) bg-(--color-ink)/95 backdrop-blur'
          : 'bg-linear-to-b from-black/55 to-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center gap-6 px-5 py-3.5 lg:px-10">
        <a href="#top" className="flex shrink-0 items-center gap-3" aria-label="Villa 25 Ekas — top">
          <img
            src={LOGO}
            alt="Villa 25 Ekas"
            width="44"
            height="44"
            className="h-11 w-auto object-contain"
          />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-(family-name:--font-display) text-[15px] uppercase tracking-[0.34em] text-(--color-text)">
              Villa 25
            </span>
            <span className="label-sm mt-1 text-(--color-text-mute)">Ekas · Lombok</span>
          </span>
        </a>

        <nav className="ml-auto hidden items-center gap-7 xl:flex">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`label transition-colors ${
                active === s.id
                  ? 'text-(--color-bronze-lit)'
                  : 'text-(--color-text-soft) hover:text-(--color-text)'
              }`}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 xl:ml-0">
          <label className="sr-only" htmlFor="currency">Currency</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => onCurrency(e.target.value)}
            className="label cursor-pointer rounded-xs border border-(--color-line-lit) bg-(--color-ink)/60 px-2.5 py-2 text-(--color-text-soft) hover:text-(--color-text)"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c} className="bg-(--color-ink)">{c}</option>
            ))}
          </select>

          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="label btn btn-solid hidden !py-2.5 !px-6 sm:inline-block"
          >
            Enquire
          </a>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="label rounded-xs border border-(--color-line-lit) px-3.5 py-2.5 text-(--color-text) xl:hidden"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-(--color-line) bg-(--color-ink) px-5 pb-6 xl:hidden">
          <ul className="flex flex-col">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  className="block border-b border-(--color-line) py-4 font-(family-name:--font-display) text-2xl text-(--color-text)"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="label btn btn-solid mt-6 w-full text-center"
          >
            Enquire on WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
