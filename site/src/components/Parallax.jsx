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
  /* 'cover'  fills the section, cropping whatever does not fit. Right for a
                calm backdrop where no part of the frame matters.
       'width'  shows the WHOLE width of the photograph and lets its own aspect
                ratio decide its height, then dissolves it into the ground.

     'width' exists because a tall section crops brutally: the surf section runs
     over 2,000 px, so `cover` scaled that photograph 2.2x and showed 35 per
     cent of its width — the sea stack and most of the wave were simply gone.
     The layer takes the image's aspect ratio so the fade lands in the same
     place at every viewport width, rather than being a guessed percentage of
     a section whose height changes with its content. */
  fit = 'cover',
  ratio,
}) {
  const ref = useRef(null);
  const still = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const travel = `${speed * 100}%`;
  const y = useTransform(scrollYProgress, [0, 1], [`-${travel}`, travel]);

  /* How far the layer has to overhang the section so the translate never drags
     an edge into view.

     It is not `speed`, which is what this used to use, and the difference is
     why a strip of bare ground appeared above or below the photograph at the
     ends of the scroll. The two percentages resolve against different boxes:
     a CSS top/bottom percentage is measured against the containing block —
     the section — while a transform percentage is measured against the element
     itself. Overhanging by `speed` makes the element taller, which makes the
     travel longer, which outruns the overhang that allowed it.

     Solving `speed x (1 + 2p) <= p` for the overhang gives p = speed / (1 - 2 x
     speed). A little over that for safety. At the 0.18 default that is 30 per
     cent rather than 18. */
  const overhang = Math.min(60, (speed / (1 - 2 * speed)) * 100 * 1.06);

  const byWidth = fit === 'width';

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        aria-hidden="true"
        style={
          byWidth
            ? {
              /* Pinned to the top and NOT translated, which is the one place
                 this differs from 'cover'.

                 The offset the cover path uses is `top: -speed%`, and a CSS
                 top percentage resolves against the CONTAINING BLOCK — the
                 whole section. The transform that pairs with it resolves
                 against the ELEMENT. When the layer filled the section those
                 were the same number; here the layer is only as tall as the
                 photograph, so -6% of a 2,053 px section pushed 166 px of sky
                 and rock up out of view — a quarter of the image, which is
                 exactly what showing the full frame was meant to stop.

                 Any translate reintroduces the problem at one end of the
                 scroll or the other: up crops the top, down opens a gap above.
                 A full-width photograph dissolving into the page does not need
                 to move to do its job. */
              backgroundImage: `url(${src})`,
              backgroundPosition: 'top center',
              backgroundSize: '100% auto',
              backgroundRepeat: 'no-repeat',
              aspectRatio: ratio,
              /* dissolves into the section rather than ending on a hard
                 horizontal edge partway down the page */
              maskImage: 'linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%)',
              top: 0,
            }
            : {
              y: still ? 0 : y,
              backgroundImage: `url(${src})`,
              backgroundPosition: position,
              top: `-${overhang}%`,
              bottom: `-${overhang}%`,
            }
        }
        className={`absolute inset-x-0 ${byWidth ? '' : 'bg-(--color-plate) bg-cover'}`}
      />
      {alt && <span className="sr-only">{alt}</span>}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: overlay }} />
      <div className="relative">{children}</div>
    </div>
  );
}
