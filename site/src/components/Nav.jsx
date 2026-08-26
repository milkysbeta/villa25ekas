import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { LOGO } from '../data/images.js';
import { whatsappLink } from '../data/villa.js';
import { CURRENCIES } from '../lib/currency.js';
import { NAV_PAGES, PRIMARY_PAGES, pageFor } from '../lib/routes.js';

export default function Nav({ currency, onCurrency }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { pathname } = useLocation();

  /* Transparent over a page that opens with a photograph, filled in everywhere
     else and once you scroll. A page opening with text needs the header solid
     from the first pixel or the two collide. */
  const overPhoto = pageFor(pathname).bleed === true;

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const filled = solid || open || !overPhoto;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        filled
          ? 'border-b border-(--color-line) bg-(--color-ink)/95 backdrop-blur'
          : 'bg-linear-to-b from-black/55 to-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center gap-6 px-5 py-2.5 lg:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Villa 25 Ekas, home">
          <img src={LOGO} alt="" width="64" height="64" className="h-16 w-auto object-contain" />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-(family-name:--font-brand) text-[15px] uppercase tracking-[0.34em] text-(--color-text)">
              Villa 25
            </span>
            <span className="label-sm mt-1 text-(--color-text-mute)">Ekas · Lombok</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-5 xl:flex 2xl:gap-7">
          {PRIMARY_PAGES.map((p) => (
            <NavLink
              key={p.slug}
              to={`/${p.slug}`}
              /* Without `end`, "/" is a prefix of every route and Home would
                 light up as the current page everywhere on the site. */
              end={p.slug === ''}
              className={({ isActive }) =>
                `text-[15px] uppercase tracking-[0.12em] transition-colors ${
                  isActive
                    ? 'text-(--color-bronze-lit)'
                    : 'text-(--color-text-soft) hover:text-(--color-text)'
                }`
              }
            >
              {p.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 xl:ml-0">
          <label className="sr-only" htmlFor="currency">Currency</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => onCurrency(e.target.value)}
            className="cursor-pointer rounded-xs border border-(--color-line-lit) bg-(--color-ink)/60 px-3 py-2.5 text-[14px] uppercase tracking-[0.1em] text-(--color-text-soft) hover:text-(--color-text)"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c} className="bg-(--color-ink)">{c}</option>
            ))}
          </select>


          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="rounded-xs border border-(--color-line-lit) px-4 py-2.5 text-[14px] uppercase tracking-[0.12em] text-(--color-text) xl:hidden"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {open && (
        <nav className="max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-(--color-line) bg-(--color-ink) px-5 pb-6 xl:hidden">
          <ul className="flex flex-col">
            {NAV_PAGES.map((p) => (
              <li key={p.slug}>
                <NavLink
                  to={`/${p.slug}`}
                  end={p.slug === ''}
                  className={({ isActive }) =>
                    `block border-b border-(--color-line) py-3.5 font-(family-name:--font-display) text-2xl ${
                      isActive ? 'text-(--color-bronze-lit)' : 'text-(--color-text)'
                    }`
                  }
                >
                  {p.label}
                </NavLink>
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
