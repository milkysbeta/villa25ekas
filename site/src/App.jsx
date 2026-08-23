import { useState } from 'react';

import { isPreviewPath, isUnlocked, unlock } from './lib/gate.js';
import { guessCurrency, rememberCurrency } from './lib/currency.js';
import { Currency } from './lib/context.js';

import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import ComingSoon from './pages/ComingSoon.jsx';

import Hero from './sections/Hero.jsx';
import Welcome from './sections/Welcome.jsx';
import Offerings from './sections/Offerings.jsx';
import Stay from './sections/Stay.jsx';
import Booking from './sections/Booking.jsx';
import Surf from './sections/Surf.jsx';
import OffGrid from './sections/OffGrid.jsx';
import Experiences from './sections/Experiences.jsx';
import Gallery from './sections/Gallery.jsx';
import Journey from './sections/Journey.jsx';
import Guide from './sections/Guide.jsx';
import Journal from './sections/Journal.jsx';
import Contact from './sections/Contact.jsx';

function Lock() {
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);

  return (
    <div className="flex min-h-svh items-center justify-center bg-(--color-ink) px-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (unlock(value)) window.location.reload();
          else setWrong(true);
        }}
        className="w-full max-w-sm text-center"
      >
        <p className="label mb-3 text-(--color-bronze-lit)">Villa 25 Ekas</p>
        <h1 className="mb-8 text-3xl">Work in progress</h1>

        <input
          type="password"
          value={value}
          autoFocus
          onChange={(e) => { setValue(e.target.value); setWrong(false); }}
          placeholder="Password"
          aria-label="Password"
          className="w-full rounded-xs border border-(--color-line-lit) bg-(--color-raise) px-4 py-3 text-center text-(--color-text) placeholder:text-(--color-text-mute)"
        />
        {wrong && (
          <p className="mt-3 text-sm text-(--color-alert)">That password is not right.</p>
        )}
        <button type="submit" className="label btn btn-solid mt-4 w-full">Enter</button>

        <p className="mt-8 text-[13px] text-(--color-text-mute)">
          Not finished, and not public. Photographs, prices and copy are all
          still being confirmed.
        </p>
      </form>
    </div>
  );
}

export default function App() {
  const [currency, setCurrency] = useState(guessCurrency);

  const onCurrency = (code) => {
    setCurrency(code);
    rememberCurrency(code);
  };

  /* The root is always the holding page — there is no way to unlock into the
     full site from it. The full site lives only at /test and /demo. */
  if (!isPreviewPath()) return <ComingSoon />;
  if (!isUnlocked()) return <Lock />;

  /* One page. Every section is an anchor target; nothing is a route.
     Order is the order a guest reads it in: what the place is, what you get,
     what it costs, then why you would come, then how you get here. */
  return (
    <Currency value={currency}>
      <div className="horizon fixed inset-x-0 top-0 z-60" />
      <Nav currency={currency} onCurrency={onCurrency} />
      <main>
        <Hero />
        <Welcome />
        <Offerings />
        <Stay />
        <Booking />
        <Surf />
        <OffGrid />
        <Experiences />
        <Gallery />
        <Guide />
        <Journey />
        <Journal />
        <Contact />
      </main>
      <Footer />
    </Currency>
  );
}
