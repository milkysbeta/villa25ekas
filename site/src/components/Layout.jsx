import { useEffect, useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Logo from './Logo.jsx';
import { CONTACT, whatsappLink } from '../data/villa.js';
import { CURRENCIES, guessCurrency, rememberCurrency } from '../lib/currency.js';

const LINKS = [
  ['/stay', 'nav.stay'],
  ['/surf', 'nav.surf'],
  ['/off-grid', 'nav.sustainability'],
  ['/experiences', 'nav.experiences'],
  ['/getting-here', 'nav.gettingHere'],
  ['/gallery', 'nav.gallery'],
  ['/journal', 'nav.journal'],
];

export default function Layout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState(guessCurrency);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const onCurrency = (code) => { setCurrency(code); rememberCurrency(code); };

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="horizon" />

      <header className="sticky top-0 z-40 border-b border-(--color-ink-line) bg-(--color-ink)/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-4 lg:px-8">
          <Link to="/" className="shrink-0" aria-label="Villa 25 Ekas — home">
            <Logo stacked={false} />
          </Link>

          <nav className="ml-auto hidden items-center gap-6 lg:flex">
            {LINKS.map(([to, key]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `label transition-colors ${
                    isActive
                      ? 'text-(--color-bronze-lit)'
                      : 'text-(--color-text-inv-s) hover:text-(--color-text-inv)'
                  }`
                }
              >
                {t(key)}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            <label className="sr-only" htmlFor="currency">Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => onCurrency(e.target.value)}
              className="label cursor-pointer rounded-xs border border-(--color-ink-line) bg-transparent px-2.5 py-2 text-(--color-text-inv-s) hover:text-(--color-text-inv)"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c} className="bg-(--color-ink)">{c}</option>
              ))}
            </select>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="label hidden rounded-xs bg-(--color-bronze) px-5 py-2.5 font-semibold text-white transition-colors hover:bg-(--color-bronze-dim) sm:inline-block"
            >
              {t('nav.enquire')}
            </a>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="label rounded-xs border border-(--color-ink-line) px-3 py-2 text-(--color-text-inv) lg:hidden"
            >
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-(--color-ink-line) bg-(--color-ink) px-5 py-4 lg:hidden">
            <ul className="flex flex-col">
              {[...LINKS, ['/contact', 'nav.contact']].map(([to, key]) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `block border-b border-(--color-ink-line) py-3.5 font-(family-name:--font-display) text-2xl ${
                        isActive ? 'text-(--color-bronze-lit)' : 'text-(--color-text-inv)'
                      }`
                    }
                  >
                    {t(key)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet context={{ currency }} />
      </main>

      <footer className="border-t border-(--color-ink-line) bg-(--color-ink) px-5 py-14 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Logo stacked={false} />
            <p className="label mt-4 text-(--color-text-inv-s)">{t('footer.builtBy')}</p>
          </div>

          <ul className="flex flex-col gap-2.5">
            {[['/stay', 'nav.stay'], ['/surf', 'nav.surf'], ['/off-grid', 'nav.sustainability'],
              ['/guide', 'nav.guide'], ['/contact', 'nav.contact']].map(([to, key]) => (
              <li key={to}>
                <Link to={to} className="label text-(--color-text-inv-s) transition-colors hover:text-(--color-bronze-lit)">
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="flex flex-col gap-2.5">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"
                 className="label text-(--color-text-inv-s) transition-colors hover:text-(--color-bronze-lit)">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`}
                 className="label text-(--color-text-inv-s) transition-colors hover:text-(--color-bronze-lit)">
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a href={`https://instagram.com/${CONTACT.instagram}`} target="_blank" rel="noopener noreferrer"
                 className="label text-(--color-text-inv-s) transition-colors hover:text-(--color-bronze-lit)">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
