import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { IMAGES } from '../data/images.js';

/* The image hangs off the right edge of the page and dissolves into the ground
   on its left, so the text sits on darkness rather than on a hard photo edge.
   A mask does the fade — a gradient overlay would only work if the ground
   behind it never changed, and it will once the colour board lands. */
export default function Welcome() {
  const ref = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  /* The layer used to be exactly the height of the section while translating
     8 per cent of itself, so at each end of the scroll a 52 px strip of bare
     ground appeared above or below the photograph. It has to overhang, and by
     more than the travel: a CSS top/bottom percentage measures against the
     section, a transform percentage against the element, so overhanging makes
     the element taller and the travel longer with it. 0.08 / (1 - 0.16) is
     9.5 per cent; 12 leaves room. Same reasoning as Parallax. */
  const OVERHANG = '-12%';

  return (
    <section id="welcome" ref={ref} className="relative overflow-hidden bg-(--color-ink)">
      {/* the photograph, hung right */}
      <motion.div
        aria-hidden="true"
        style={{ y: still ? 0 : y, top: OVERHANG, bottom: OVERHANG }}
        className="pointer-events-none absolute right-0 w-full lg:w-[62%]"
      >
        <div
          className="h-full w-full bg-(--color-plate) bg-cover bg-center"
          style={{
            backgroundImage: `url(${IMAGES.welcome.src})`,
            maskImage:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,.35) 26%, rgba(0,0,0,.9) 62%, #000 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,.35) 26%, rgba(0,0,0,.9) 62%, #000 100%)',
          }}
        />
      </motion.div>

      {/* on narrow screens the photo sits behind the text, so it needs knocking
          back much harder than it does on desktop */}
      <div aria-hidden="true" className="absolute inset-0 bg-(--color-ink)/72 lg:hidden" />

      <div className="relative mx-auto max-w-[1500px] px-5 py-28 lg:px-10 lg:py-44">
        <div className="max-w-xl">
          <p className="label text-(--color-bronze-lit)">Welcome</p>

          <h2 className="mt-6 text-[clamp(2.1rem,4.6vw,3.9rem)]">
            Welcome to Villa 25 Ekas,
            <br />
            <span className="text-(--color-bronze-lit)">luxury surf resort</span>
          </h2>

          <p className="mt-8 text-lg text-(--color-text-soft)">
            A quiet corner of East Lombok, a long way past where the day
            trippers turn around. The bay breaks in front of the villa, the
            gardens are kept alive by the water the house gives back, and every
            light in the place is on because the sun came up.
          </p>

          <p className="mt-5 text-(--color-text-soft)">
            Five rooms in total. Take one, or take the lot.
          </p>

          <Link to="/stay" className="label btn btn-line mt-10 inline-block">
            The rooms
          </Link>
        </div>
      </div>
    </section>
  );
}
