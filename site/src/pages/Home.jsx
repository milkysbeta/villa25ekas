import { Link } from 'react-router-dom';
import CurrencyPicker from '../components/CurrencyPicker.jsx';
import Hero from '../sections/Hero.jsx';
import Welcome from '../sections/Welcome.jsx';
import Offerings from '../sections/Offerings.jsx';
import { UNITS, POWER } from '../data/villa.js';
import Price from '../components/Price.jsx';

/* The home page's job is to make someone want to look further, then hand them
   off. So it opens with the place, states the one fact nobody else can claim,
   and then offers three doors rather than trying to be the whole site. */
const DOORS = [
  { to: '/stay',        eyebrow: 'The rooms',   title: 'Five rooms,\ntwo pools' },
  { to: '/surf',        eyebrow: 'The surf',    title: 'It breaks in front\nof the villa' },
  { to: '/getting-here', eyebrow: 'Getting here', title: 'It takes\na bit of doing' },
];

export default function Home() {
  const cheapest = Math.min(...UNITS.map((u) => u.rate));

  return (
    <>
      <Hero />
      <Welcome />
      <Offerings />

      {/* the off-grid claim, in numbers, with a way through */}
      <section className="bg-(--color-ink) px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-[1500px] gap-12 border-t border-(--color-line) pt-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="label text-(--color-bronze-lit)">Off the grid</p>
            <h2 className="mt-4 text-3xl sm:text-4xl">The whole place runs on sunlight</h2>
            <p className="mt-6 max-w-md text-(--color-text-soft)">
              Not a panel on the roof and a card about towels. Enough battery to
              keep the air conditioning on until morning.
            </p>
            <Link to="/off-grid" className="label mt-8 inline-block border-b border-(--color-bronze-lit) pb-1 text-(--color-bronze-lit)">
              How it works
            </Link>
          </div>
          <dl className="grid grid-cols-2 gap-px self-start bg-(--color-line) sm:grid-cols-3">
            {[[`${POWER.panelKwTotal}`, 'kW of solar'], [`${POWER.batteryKwh}`, 'kWh of battery'], [`${POWER.inverterKw}`, 'kW inverter']].map(([v, l]) => (
              <div key={l} className="bg-(--color-ink) p-7">
                <dd className="font-(family-name:--font-display) text-5xl text-(--color-bronze-lit) tabular-nums">{v}</dd>
                <dt className="label mt-3 text-(--color-text-soft)">{l}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* three doors */}
      <section className="bg-(--color-shell) px-5 py-24 lg:px-10 lg:py-32">
        <ul className="mx-auto grid max-w-[1500px] gap-px bg-(--color-line) md:grid-cols-3">
          {DOORS.map((d) => (
            <li key={d.to} className="bg-(--color-shell)">
              <Link
                to={d.to}
                className="group flex h-full flex-col justify-between gap-10 p-8 transition-colors hover:bg-(--color-raise) lg:p-12"
              >
                <div>
                  <p className="label text-(--color-bronze)">{d.eyebrow}</p>
                  <h3 className="mt-4 whitespace-pre-line text-3xl">{d.title}</h3>
                </div>
                <span className="label text-(--color-text-mute) transition-colors group-hover:text-(--color-bronze-lit)">
                  Have a look →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-14 flex max-w-[1500px] flex-col gap-5 border-t border-(--color-line) pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-(--color-text-soft)">
            Rooms from <Price amount={cheapest} className="text-(--color-text)" /> a night.
          </p>
          <CurrencyPicker className="sm:ml-auto sm:mr-4" />
          <Link to="/availability" className="label btn btn-solid text-center">
            Check availability
          </Link>
        </div>
      </section>
    </>
  );
}
