import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { IMAGES } from '../data/images.js';

export default function Hero() {
  const ref = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  /* The photograph drifts down slower than the page and dims as it goes, so
     the headline lifts away from it rather than scrolling off with it. */
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const fade = useTransform(scrollYProgress, [0, 1], [1, 0.35]);
  const lift = useTransform(scrollYProgress, [0, 0.7], ['0px', '-70px']);

  return (
    <section id="top" ref={ref} className="relative h-svh min-h-[620px] overflow-hidden">
      <motion.div
        aria-hidden="true"
        style={{
          y: still ? 0 : y,
          opacity: still ? 1 : fade,
          backgroundImage: `url(${IMAGES.hero.src})`,
        }}
        className="absolute -inset-y-[12%] inset-x-0 bg-(--color-plate) bg-cover bg-center"
      />

      {/* Two overlays: a flat wash so the type always has something to sit on,
          and a heavy bottom gradient carrying it into the next section. */}
      <div aria-hidden="true" className="absolute inset-0 bg-(--color-ink)/45" />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, var(--color-ink) 0%, rgba(16,14,11,.72) 22%, rgba(16,14,11,.05) 62%, rgba(16,14,11,.5) 100%)',
        }}
      />

      <motion.div
        style={{ y: still ? 0 : lift }}
        className="relative mx-auto flex h-full max-w-[1500px] flex-col justify-end px-5 pb-24 lg:px-10 lg:pb-32"
      >
        <p className="label text-(--color-bronze-lit)">Ekas Bay · Lombok · Indonesia</p>

        <h1 className="mt-6 max-w-4xl text-[clamp(2.6rem,7vw,6rem)] text-(--color-text)">
          Luxury Surf Villas
          <br />
          <span className="text-(--color-bronze-lit)">in Ekas Bay</span>
        </h1>

        {/* "timber cut up the road" was John's call to cut, 25 Aug 2026 —
            "sounds cheap and cheesy". He is right: the hardwood is the luxury
            argument, and that phrasing made it sound like a saving. */}
        <p className="mt-8 max-w-lg text-lg text-(--color-text-soft)">
          Five rooms above the bay, run entirely on sunlight and built from
          locally sourced hardwood. Four minutes from the sand.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href="#stay" className="label btn btn-solid">Explore the villas</a>
          <a href="#surf" className="label btn btn-line">See the swell</a>
        </div>
      </motion.div>

      <a
        href="#welcome"
        aria-label="Scroll to welcome"
        className="label absolute bottom-7 left-1/2 hidden -translate-x-1/2 text-(--color-text-mute) transition-colors hover:text-(--color-bronze-lit) lg:block"
      >
        Scroll
      </a>
    </section>
  );
}
