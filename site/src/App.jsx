import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { isPreviewPath, isUnlocked, unlock } from './lib/gate.js';
import { guessCurrency, rememberCurrency } from './lib/currency.js';
import { Currency, CurrencySet } from './lib/context.js';
import { BASENAME } from './lib/routes.js';

import Layout from './components/Layout.jsx';
import ComingSoon from './pages/ComingSoon.jsx';

import Home from './pages/Home.jsx';
import Stay from './pages/Stay.jsx';
import Availability from './pages/Availability.jsx';
import Surf from './pages/Surf.jsx';
import OffGridPage from './pages/OffGridPage.jsx';
import Experiences from './pages/Experiences.jsx';
import Gallery from './pages/Gallery.jsx';
import Guide from './pages/Guide.jsx';
import GettingHere from './pages/GettingHere.jsx';
import Journal from './pages/Journal.jsx';
import Contact from './pages/Contact.jsx';

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
        {wrong && <p className="mt-3 text-sm text-(--color-alert)">That password is not right.</p>}
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

  /* The root is always the holding page — there is no route into the full site
     from it. The full site lives under /demo, behind the password. */
  if (!isPreviewPath()) return <ComingSoon />;
  if (!isUnlocked()) return <Lock />;

  return (
    <Currency value={currency}>
      <CurrencySet value={onCurrency}>
        <BrowserRouter basename={BASENAME}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="stay" element={<Stay />} />
            <Route path="availability" element={<Availability />} />
            <Route path="surf" element={<Surf />} />
            <Route path="off-grid" element={<OffGridPage />} />
            <Route path="experiences" element={<Experiences />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="guide" element={<Guide />} />
            <Route path="getting-here" element={<GettingHere />} />
            <Route path="journal" element={<Journal />} />
            <Route path="contact" element={<Contact />} />
            {/* anything unknown goes home rather than showing nothing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </CurrencySet>
    </Currency>
  );
}
