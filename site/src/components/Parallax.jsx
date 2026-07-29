import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/* ============================================================================
   Parallax image layer

   Transform-based rather than `background-attachment: fixed`, which stutters
   badly on iOS and is ignored outright on some Android browsers.

   The layer is oversized by the travel distance so no gap ever appears at the
   edges. Anyone who has asked their system not to animate gets a still image —
   the design has to read without the movement, and it does.
   ========================================================================= */
export default function Parallax({
  src,
  alt = '',
  speed = 0.18,
  className = '',
  overlay = 'linear-gradient(to bottom, rgba(15,13,10,.55), rgba(15,13,10,.82))',
  children,
  position = 'center',
}) {
  const ref = useRef(null);
  const still = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const travel = `${speed * 100}%`;
  const y = useTransform(scrollYProgress, [0, 1], [`-${travel}`, travel]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        aria-hidden="true"
        style={{
          y: still ? 0 : y,
          backgroundImage: `url(${src})`,
          backgroundPosition: position,
          top: `-${speed * 100}%`,
          bottom: `-${speed * 100}%`,
        }}
        className="absolute inset-x-0 bg-(--color-plate) bg-cover"
      />
      {alt && <span className="sr-only">{alt}</span>}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: overlay }} />
      <div className="relative">{children}</div>
    </div>
  );
}
