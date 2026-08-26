import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Nav from './Nav.jsx';
import Footer from './Footer.jsx';
import { pageFor } from '../lib/routes.js';

/* Shared chrome for every page, plus the two things a client-side router has
   to do by hand that a server would have done for you: set the document title,
   and put the reader at the top of the new page rather than wherever they had
   scrolled to on the last one. */
export default function Layout() {
  const { pathname } = useLocation();

  const page = pageFor(pathname);

  useEffect(() => { document.title = page.title; }, [page.title]);

  useEffect(() => {
    /* Not for in-page anchors — only when the page itself changes. */
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      <div className="horizon fixed inset-x-0 top-0 z-60" />
      <Nav />
      {/* A `bleed` page opens with a full-bleed photograph meant to sit under
          the transparent header. Everything else starts with text, which needs
          the header's height clearing first. */}
      <main className={page.bleed ? '' : 'pt-20 lg:pt-24'}>
        <Outlet />
      </main>
      <Footer page={page} />
    </>
  );
}
