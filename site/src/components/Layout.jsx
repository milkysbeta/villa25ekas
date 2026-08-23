import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Nav from './Nav.jsx';
import Footer from './Footer.jsx';
import { PAGES, BASENAME } from '../lib/routes.js';

/* Shared chrome for every page, plus the two things a client-side router has
   to do by hand that a server would have done for you: set the document title,
   and put the reader at the top of the new page rather than wherever they had
   scrolled to on the last one. */
export default function Layout({ currency, onCurrency }) {
  const { pathname } = useLocation();

  const slug = pathname.replace(BASENAME, '').replace(/^\/|\/$/g, '');
  const page = PAGES.find((p) => p.slug === slug) ?? PAGES[0];
  const isHome = page.slug === '';

  useEffect(() => { document.title = page.title; }, [page.title]);

  useEffect(() => {
    /* Not for in-page anchors — only when the page itself changes. */
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      <div className="horizon fixed inset-x-0 top-0 z-60" />
      <Nav currency={currency} onCurrency={onCurrency} />
      {/* The home page opens with a full-bleed hero that is meant to sit under
          the transparent header. Every other page starts with text, which is
          not. */}
      <main className={isHome ? '' : 'pt-20 lg:pt-24'}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
