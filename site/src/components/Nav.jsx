import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { LOGO } from '../data/images.js';
import { whatsappLink } from '../data/villa.js';
import { NAV_PAGES, PRIMARY_PAGES } from '../lib/routes.js';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  /* The bar looks the same everywhere and at every scroll position. It used to
     start transparent over a page that opened with a photograph and fill in once
     you scrolled, which meant the same bar had two appearances on one page and
     changed under you as you read. One appearance is easier to trust. */

  /* The bar gets out of the way going down the page and comes back the moment
     you scroll up, which is where someone reaches for navigation anyway.

     Three guards, each for a real case. It never hides in the first 140 px, or
     it would flicker away while you are still reading the top of a page. It
     ignores movements under 6 px, because trackpad and touch scrolling jitter
     either side of a direction change and the bar would strobe. And it never
     hides while the mobile menu is open, which would take the Close button
     with it. */
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - last;
      if (Math.abs(dy) > 6) {
        setHidden(dy > 0 && y > 140);
        last = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Anything that puts the reader somewhere new should show the bar again. */
  useEffect(() => { setHidden(false); }, [pathname]);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header
      /* The hide distance is an inline style rather than a Tailwind arbitrary
         value. It needs `calc(100% + 1.75rem)`, and CSS requires the spaces
         around the `+` — which Tailwind expects written as underscores. Easy to
         get wrong, silently produces no rule at all, and this is clearer.

         The distance matters: translating by 100% moves the bar up by its own
         height, but the logo deliberately hangs about 22 px below the bar, so a
         plain full-height translate leaves the mark stranded on the page with
         nothing behind it. The extra 1.75rem takes the overhang with it. */
      style={{
        translate: hidden && !open ? '0 calc(-100% - 1.75rem)' : '0 0',
        /* Colour and blur are inline for the same reason as the translate. The
           bar wants a tinted, blurred glass rather than a solid slab, and the
           Tailwind form of that (`bg-(--color-ink)/45`) is not being emitted
           here — the utility simply does not appear in the built stylesheet, so
           the bar rendered fully transparent with its border falling back to
           currentColor. An inline value cannot be dropped by a scanner. */
        /* 58 per cent. Measured against the top of the lightest photo page
           (off-grid, whose wash only starts at 34) with the bar's own 24 px
           blur: nav links hold 6.5:1 and the active link 6.7. There is room to
           go further — even 42 per cent keeps 5.2 — so this is a look, not a
           limit. */
        backgroundColor: 'color-mix(in oklab, var(--color-ink) 58%, transparent)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--color-line-lit)',
      }}
      className="fixed inset-x-0 top-0 z-50 transition-[translate,background-color] duration-500 ease-out"
    >
      {/* The bar itself is thin. The logo is bigger than the bar and hangs
          below it, which is why the row is not `overflow-hidden` and the mark
          gets a negative bottom margin: the margin stops the oversized image
          pushing the bar back open, so the bar keeps the height of the text
          beside it and the logo simply overhangs. */}
      <div className="mx-auto flex max-w-[1500px] items-center gap-6 px-5 py-1.5 lg:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Villa 25 Ekas, home">
          <img
            src={LOGO}
            alt=""
            width="72"
            height="72"
            className="-mb-6 h-14 w-auto object-contain sm:-mb-7 sm:h-18"
          />
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
