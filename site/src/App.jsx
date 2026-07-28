import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { COMING_SOON, isUnlocked, unlock } from './lib/gate.js';
import Layout from './components/Layout.jsx';
import ComingSoon from './pages/ComingSoon.jsx';
import Home from './pages/Home.jsx';
import Stay from './pages/Stay.jsx';
import Surf from './pages/Surf.jsx';
import Sustainability from './pages/Sustainability.jsx';
import GettingHere from './pages/GettingHere.jsx';
import Placeholder from './pages/Placeholder.jsx';
import Contact from './pages/Contact.jsx';

/* Discreet unlock: three quick clicks on the year in the footer of the holding
   page, or ?preview=… on the URL. Deliberately not a visible "staff login" —
   that only invites people to try. */
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
    <div className="flex min-h-dvh items-center justify-center bg-(--color-ink) px-6">
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
          className="w-full rounded-xs border border-(--color-ink-line) bg-(--color-ink-soft) px-4 py-3 text-(--color-text-inv) placeholder:text-(--color-text-inv-s)"
        />
        {wrong && (
          <p className="mt-3 text-sm text-(--color-alert)">
            That password is not right.
          </p>
        )}
        <button
          type="submit"
          className="label mt-4 w-full rounded-xs bg-(--color-bronze) py-3.5 font-semibold text-white transition-colors hover:bg-(--color-bronze-dim)"
        >
          Enter
        </button>
      </form>
    </div>
  );
}

export default function App() {
  if (COMING_SOON && !isUnlocked()) return <Gate />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="stay" element={<Stay />} />
          <Route path="surf" element={<Surf />} />
          <Route path="off-grid" element={<Sustainability />} />
          <Route path="getting-here" element={<GettingHere />} />
          <Route path="experiences" element={<Placeholder title="Experiences" />} />
          <Route path="gallery" element={<Placeholder title="Gallery" />} />
          <Route path="journal" element={<Placeholder title="Journal" />} />
          <Route path="guide" element={<Placeholder title="Ekas Guide" />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Placeholder title="Not found" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
