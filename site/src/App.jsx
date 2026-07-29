import { useState } from 'react';

import { COMING_SOON, isUnlocked, unlock } from './lib/gate.js';
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
import Journey from './sections/Journey.jsx';
import Contact from './sections/Contact.jsx';

/* Discreet unlock: three clicks in the bottom-right corner of the holding page,
   or ?preview=… on the URL. Deliberately not a visible "staff login" — that
   only invites people to try it. */
function Gate() {
  const [tries, setTries] = useState(0);
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);

  if (tries < 3) {
    return (
      <>
        <ComingSoon />
        <button
          type="button"
          onClick={() => setTries((n) => n + 1)}
          aria-label="Preview access"
          className="fixed bottom-0 right-0 h-12 w-12 cursor-default opacity-0"
        />
      </>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-(--color-ink) px-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (unlock(value)) window.location.reload();
          else setWrong(true);
        }}
        className="w-full max-w-sm"
      >
        <p className="label mb-4 text-(--color-bronze-lit)">Preview access</p>
        <input
          type="password"
          value={value}
          autoFocus
          onChange={(e) => { setValue(e.target.value); setWrong(false); }}
          placeholder="Password"
          aria-label="Preview password"
          className="w-full rounded-xs border border-(--color-line-lit) bg-(--color-raise) px-4 py-3 text-(--color-text) placeholder:text-(--color-text-mute)"
        />
        {wrong && <p className="mt-3 text-sm text-(--color-alert)">That password is not right.</p>}
        <button type="submit" className="label btn btn-solid mt-4 w-full">Enter</button>
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

  if (COMING_SOON && !isUnlocked()) return <Gate />;

  /* One page. Every section is an anchor target; nothing is a route. */
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
        <Journey />
        <Contact />
      </main>
      <Footer />
    </Currency>
  );
}

