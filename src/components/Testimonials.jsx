// Testimonials.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useAnimation,
  useReducedMotion,
} from 'framer-motion';
import { Quote } from 'lucide-react';
import Tree, { TREE_CROP } from './Tree';

// --------------------------------------------------
// Data
// --------------------------------------------------
// Coordinates are in the Tree viewBox (1252×1252).
// Tuned to sit ON the tree canopy so the dots
// appear to grow from the branches themselves.
// offsetX pushes the card outward from the dot.
const TESTIMONIALS = [
  {
    id: 'sophia',
    quote:
      'LUXE transformed my daily routine into a ritual. The oils are pure, long-lasting, and simply divine.',
    author: 'Sophia M.',
    role: 'Wellness coach',
    x: 480,
    y: 430,
    offsetX: -190,
    flowerDelay: 0,
  },
  {
    id: 'elena',
    quote:
      'Finally, a brand that understands subtlety and power in fragrance. Every purchase feels like a discovery.',
    author: 'Elena V.',
    role: 'Fashion designer',
    x: 612,
    y: 430,
    offsetX: 190,
    flowerDelay: 0.15,
  },
  {
    id: 'amira',
    quote:
      'This is not just a perfume house. LUXE is an experience of feeling truly special. Every scent is crafted to perfection.',
    author: 'Amira K.',
    role: 'Returning customer',
    x: 458,
    y: 750,
    offsetX: -190,
    flowerDelay: 0.3,
  },
  {
    id: 'rami',
    quote:
      'The service and sophistication are world-class. Clean, modern, and deeply memorable fragrances.',
    author: 'Rami S.',
    role: 'Artist',
    x: 620,
    y: 750,
    offsetX: 190,
    flowerDelay: 0.45,
  },
];

// --------------------------------------------------
// Anchor marker — small gold dot with sparkle
// --------------------------------------------------
const FlowerBud = ({ delay = 0, active = false, size = 26 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="overflow-visible"
      aria-hidden="true"
    >
      <motion.circle
        cx="12"
        cy="12"
        r="1.9"
        fill="#8e6c2c"
        initial={{ scale: 0 }}
        animate={active ? { scale: 1 } : { scale: 0 }}
        transition={{
          delay: delay + 0.32,
          type: 'spring',
          stiffness: 400,
          damping: 20,
        }}
      />

      <motion.circle
        cx="12"
        cy="12"
        r="0.7"
        fill="#fbf3dc"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: [0, 1, 0.6] } : { opacity: 0 }}
        transition={{ delay: delay + 0.45, duration: 0.8 }}
      />
    </svg>
  );
};

// --------------------------------------------------
// Single testimonial card
// --------------------------------------------------
const TestimonialCard = ({ testimonial, align }) => (
  <motion.blockquote
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className={`group relative w-full rounded-2xl border border-gold/25 bg-gradient-to-br from-white/95 to-[#fbf3dc]/90 p-4 text-left shadow-[0_22px_60px_-26px_rgba(92,61,46,0.5)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_32px_70px_-26px_rgba(212,175,55,0.55)] sm:p-5 ${
      align === 'right' ? 'text-right' : ''
    }`}
  >
    <div
      className={`pointer-events-none absolute inset-0 rounded-2xl ${
        align === 'right'
          ? 'bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.10),transparent_55%)]'
          : 'bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.10),transparent_55%)]'
      }`}
    />

    {/* Opening quote — top corner */}
    <Quote
      size={16}
      className={`absolute -top-2 text-gold/80 ${
        align === 'right' ? '-right-2 scale-x-[-1]' : '-left-2'
      }`}
      strokeWidth={2.5}
      fill="currentColor"
      fillOpacity={0.2}
    />

    {/* Closing quote — bottom corner, flipped vertically */}
    <Quote
      size={16}
      className={`absolute -bottom-2 text-gold/80 ${
        align === 'right'
          ? '-right-2 scale-x-[-1] scale-y-[-1]'
          : '-left-2 scale-y-[-1]'
      }`}
      strokeWidth={2.5}
      fill="currentColor"
      fillOpacity={0.2}
    />

    <p className="relative font-display text-[13px] leading-relaxed text-stone-800 italic sm:text-[13.5px]">
      &ldquo;{testimonial.quote}&rdquo;
    </p>

    <footer
      className={`relative mt-3 flex items-center gap-2 sm:mt-4 ${
        align === 'right' ? 'justify-end' : 'justify-start'
      }`}
    >
      <span className="h-px w-5 bg-gold/50" aria-hidden />
      <cite className="not-italic">
        <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-stone-900 sm:text-[11px]">
          {testimonial.author}
        </span>
        <span className="block text-[9px] uppercase tracking-[0.2em] text-gold/80 sm:text-[10px]">
          {testimonial.role}
        </span>
      </cite>
    </footer>
  </motion.blockquote>
);

// --------------------------------------------------
// Main
// --------------------------------------------------
const Testimonials = () => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [flowersOpen, setFlowersOpen] = useState(false);
  const [treeKey, setTreeKey] = useState(0);
  const controls = useAnimation();
  const containerRef = useRef(null);
  const timersRef = useRef([]);
  const prefersReducedMotion = useReducedMotion();

  const runSequence = async () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    setVisibleCount(0);
    setFlowersOpen(false);
    setTreeKey((k) => k + 1);
    await controls.start('hidden');

    if (prefersReducedMotion) {
      await controls.start('visible');
      setFlowersOpen(true);
      setVisibleCount(TESTIMONIALS.length);
      return;
    }

    await controls.start('visible');

    TESTIMONIALS.forEach((_, i) => {
      const t = setTimeout(
        () => setVisibleCount((c) => Math.max(c, i + 1)),
        200 + i * 500
      );
      timersRef.current.push(t);
    });
  };

  useEffect(() => {
    runSequence();
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------
  // Map 1252-space coords → % of the cropped viewBox
  // --------------------------------------------------
  const toCropPercent = (x, y) => ({
    xPercent: ((x - TREE_CROP.x) / TREE_CROP.width) * 100,
    yPercent: ((y - TREE_CROP.y) / TREE_CROP.height) * 100,
  });

  return (
    <section
      className="relative overflow-hidden bg-[#faf7f2] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      aria-label="Customer testimonials"
    >
      {/* Top edge fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent sm:h-32" />
      {/* Bottom edge fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent sm:h-32" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Decorative divider */}
        <div className="mb-8 text-center sm:mb-12 lg:mb-16">
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="mx-auto h-px w-16 origin-center bg-gradient-to-r from-transparent via-gold/70 to-transparent sm:w-20"
          />
        </div>

        {/* ============================================== */}
        {/* Desktop (lg+) — tree with floating cards        */}
        {/* ============================================== */}
        <div className="relative mx-auto hidden max-w-5xl lg:block">
          <div
            ref={containerRef}
            className="relative aspect-square w-full"
          >
            <motion.div
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, scale: 0.96 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 1.2, ease: 'easeOut' },
                },
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative h-full w-full">
                <Tree
                  key={treeKey}
                  width="100%"
                  height="100%"
                  viewBox={TREE_CROP}
                  stroke="#5C3D2E"
                  strokeWidth={3}
                  animated
                  duration={3}
                  onComplete={() => setFlowersOpen(true)}
                />

                {/* ---------- Markers + cards ---------- */}
                {TESTIMONIALS.map((testimonial, index) => {
                  const isVisible = index < visibleCount;
                  const { xPercent, yPercent } = toCropPercent(
                    testimonial.x,
                    testimonial.y
                  );
                  const isRight = testimonial.offsetX > 0;

                  return (
                    <div
                      key={testimonial.id}
                      className="absolute"
                      style={{
                        left: `${xPercent}%`,
                        top: `${yPercent}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {/* Anchor marker — sits on the tree */}
                      <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{ zIndex: 5 }}
                      >
                        <FlowerBud
                          active={flowersOpen}
                          delay={testimonial.flowerDelay}
                          size={28}
                        />
                      </div>

                      {/* Card — emerges from behind the marker */}
                      <AnimatePresence>
                        {isVisible && (
                          <motion.div
                            initial={{
                              x: 0,
                              y: '-50%',
                              scale: 0.15,
                              opacity: 0,
                              rotate: isRight ? -10 : 10,
                            }}
                            animate={{
                              x: testimonial.offsetX,
                              y: '-50%',
                              scale: 1,
                              opacity: 1,
                              rotate: 0,
                            }}
                            exit={{
                              x: 0,
                              scale: 0.15,
                              opacity: 0,
                              rotate: isRight ? -10 : 10,
                            }}
                            transition={{
                              type: 'spring',
                              stiffness: 130,
                              damping: 20,
                              mass: 0.9,
                              delay: 0.25,
                            }}
                            className="absolute left-1/2 top-1/2"
                            style={{ width: 214, zIndex: 1 }}
                          >
                            <TestimonialCard
                              testimonial={testimonial}
                              align={isRight ? 'left' : 'right'}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ============================================== */}
        {/* Mobile / Tablet (< lg) — tree on top, cards below */}
        {/* ============================================== */}
        <div className="lg:hidden">
          <div className="relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-sm md:max-w-md">
            <motion.div
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, scale: 0.96 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 1.2, ease: 'easeOut' },
                },
              }}
              className="h-full w-full"
            >
              <Tree
                key={`m-${treeKey}`}
                width="100%"
                height="100%"
                viewBox={TREE_CROP}
                stroke="#5C3D2E"
                strokeWidth={3}
                animated
                duration={3}
              />
            </motion.div>
          </div>

          <div className="mx-auto mt-6 grid max-w-md gap-4 sm:mt-8 sm:gap-5">
            <AnimatePresence>
              {TESTIMONIALS.slice(0, visibleCount).map((t) => (
                <TestimonialCard
                  key={t.id}
                  testimonial={t}
                  align="left"
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;