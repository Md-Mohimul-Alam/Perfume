import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

const Testimonials = () => {
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [seedPhase, setSeedPhase] = useState('grow');
  const controls = useAnimation();
  const containerRef = useRef(null);

  const testimonials = [
    {
      quote: "This is not just a perfume house. LUXE is an experience of feeling truly special. Every scent is crafted to perfection.",
      author: "Amira K., Returning Customer",
      branch: 'left-lower'
    },
    {
      quote: "The service and sophistication are world-class. Clean, modern, and deeply memorable fragrances.",
      author: "Rami S., Artist",
      branch: 'right-lower'
    },
    {
      quote: "LUXE transformed my daily routine into a ritual. The oils are pure, long-lasting, and simply divine.",
      author: "Sophia M., Wellness Coach",
      branch: 'left-upper'
    },
    {
      quote: "Finally, a brand that understands subtlety and power in fragrance. Every purchase feels like a discovery.",
      author: "Elena V., Fashion Designer",
      branch: 'right-upper'
    }
  ];

  // Branch endpoints for testimonial cards (adjusted for oak tree)
  const branchEndpoints = {
    'left-lower': { x: 130, y: 540, textAlign: 'right', offsetX: -20 },
    'right-lower': { x: 470, y: 540, textAlign: 'left', offsetX: 20 },
    'left-upper': { x: 70, y: 290, textAlign: 'right', offsetX: -20 },
    'right-upper': { x: 530, y: 290, textAlign: 'left', offsetX: 20 },
  };

  // Oak tree paths – thick trunk, wide canopy, hand-drawn style
  const treePaths = [
    // Thick trunk
    { id: 'trunk', d: 'M310,780 L310,380 Q310,360 300,350 Q290,360 290,380 L290,780' },
    // Main lower branches
    { id: 'left-lower', d: 'M295,560 Q230,530 130,540' },
    { id: 'right-lower', d: 'M305,560 Q370,530 470,540' },
    // Main upper branches
    { id: 'left-upper', d: 'M295,430 Q180,360 70,290' },
    { id: 'right-upper', d: 'M305,430 Q420,360 530,290' },
    // Canopy outline – left side
    { id: 'canopy-left-1', d: 'M130,540 Q80,490 60,410 Q50,350 70,290' },
    { id: 'canopy-left-2', d: 'M70,290 Q60,230 100,190 Q140,160 190,170' },
    { id: 'canopy-left-3', d: 'M190,170 Q240,140 300,150' },
    // Canopy outline – right side
    { id: 'canopy-right-1', d: 'M470,540 Q520,490 540,410 Q550,350 530,290' },
    { id: 'canopy-right-2', d: 'M530,290 Q540,230 500,190 Q460,160 410,170' },
    { id: 'canopy-right-3', d: 'M410,170 Q360,140 300,150' },
    // Canopy top
    { id: 'canopy-top', d: 'M190,170 Q250,120 300,150 Q350,120 410,170' },
    // Inner canopy details (texture)
    { id: 'inner-1', d: 'M220,230 Q280,200 340,230' },
    { id: 'inner-2', d: 'M180,310 Q250,260 320,290' },
    { id: 'inner-3', d: 'M280,290 Q300,240 320,290' },
    // Additional smaller branches for realism
    { id: 'small-left', d: 'M180,370 Q140,340 110,380' },
    { id: 'small-right', d: 'M420,370 Q460,340 490,380' },
    { id: 'small-top-left', d: 'M230,210 Q200,180 170,220' },
    { id: 'small-top-right', d: 'M370,210 Q400,180 430,220' },
  ];

  // Order of branch animations (for testimonial timing)
  const branchIds = ['left-lower', 'right-lower', 'left-upper', 'right-upper'];

  const branchToIndex = {
    'left-lower': 0,
    'right-lower': 1,
    'left-upper': 2,
    'right-upper': 3,
  };

  // Start tree animation on mount
  useEffect(() => {
    const animateTree = async () => {
      setSeedPhase('grow');
      await new Promise(resolve => setTimeout(resolve, 800));
      setSeedPhase('fade');

      // Grow trunk
      await controls.start('trunk');

      // Grow main branches sequentially and show testimonials
      for (const id of branchIds) {
        await controls.start(id);
        const idx = branchToIndex[id];
        if (idx !== undefined) {
          setVisibleIndex(idx);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Grow canopy and inner details
      const canopyIds = [
        'canopy-left-1', 'canopy-left-2', 'canopy-left-3',
        'canopy-right-1', 'canopy-right-2', 'canopy-right-3',
        'canopy-top',
        'inner-1', 'inner-2', 'inner-3',
        'small-left', 'small-right', 'small-top-left', 'small-top-right'
      ];
      for (const id of canopyIds) {
        await controls.start(id);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    };
    animateTree();
  }, [controls]);

  // Animation variants for each path
  const pathVariants = {
    trunk: {
      pathLength: 1,
      transition: { duration: 1.2, ease: 'easeInOut' }
    },
    'left-lower': {
      pathLength: 1,
      transition: { duration: 0.8, ease: 'easeOut' }
    },
    'right-lower': {
      pathLength: 1,
      transition: { duration: 0.8, ease: 'easeOut' }
    },
    'left-upper': {
      pathLength: 1,
      transition: { duration: 0.8, ease: 'easeOut' }
    },
    'right-upper': {
      pathLength: 1,
      transition: { duration: 0.8, ease: 'easeOut' }
    },
    'canopy-left-1': {
      pathLength: 1,
      transition: { duration: 0.7, ease: 'easeOut' }
    },
    'canopy-left-2': {
      pathLength: 1,
      transition: { duration: 0.7, ease: 'easeOut' }
    },
    'canopy-left-3': {
      pathLength: 1,
      transition: { duration: 0.7, ease: 'easeOut' }
    },
    'canopy-right-1': {
      pathLength: 1,
      transition: { duration: 0.7, ease: 'easeOut' }
    },
    'canopy-right-2': {
      pathLength: 1,
      transition: { duration: 0.7, ease: 'easeOut' }
    },
    'canopy-right-3': {
      pathLength: 1,
      transition: { duration: 0.7, ease: 'easeOut' }
    },
    'canopy-top': {
      pathLength: 1,
      transition: { duration: 0.7, ease: 'easeOut' }
    },
    'inner-1': {
      pathLength: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    'inner-2': {
      pathLength: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    'inner-3': {
      pathLength: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    'small-left': {
      pathLength: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    'small-right': {
      pathLength: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    'small-top-left': {
      pathLength: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    'small-top-right': {
      pathLength: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
  };

  return (
    <section className="testimonials-section py-20 px-4 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-purple-900/5" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.div
            className="testimonials-subtitle text-gold text-sm tracking-widest uppercase mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Testimonials
          </motion.div>
          <motion.h2
            className="font-display text-3xl lg:text-4xl text-black tracking-widest uppercase font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Voices of LUXE
          </motion.h2>
        </div>

        {/* Tree + Testimonials container */}
        <div className="relative flex justify-center">
          <div 
            ref={containerRef}
            className="relative w-full max-w-2xl aspect-[3/4]"
            style={{ minHeight: '500px' }}
          >
            {/* SVG Tree */}
            <svg
              viewBox="0 0 600 800"
              className="w-full h-full"
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              {/* === SEED === */}
              <motion.circle
                cx="300"
                cy="780"
                r="12"
                fill="#8B7355"
                initial={{ scale: 0, opacity: 1 }}
                animate={
                  seedPhase === 'grow' 
                    ? { scale: [0, 1.2, 0.8, 1], opacity: 1 }
                    : { scale: 0.5, opacity: 0 }
                }
                transition={
                  seedPhase === 'grow' 
                    ? { duration: 1, times: [0, 0.5, 0.7, 1] }
                    : { duration: 0.5 }
                }
              />
              {/* Seed glow */}
              <motion.circle
                cx="300"
                cy="780"
                r="20"
                fill="rgba(201, 168, 76, 0.3)"
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  seedPhase === 'grow' 
                    ? { scale: [0, 2, 3, 2], opacity: [0, 0.5, 0.2, 0] }
                    : { scale: 0, opacity: 0 }
                }
                transition={{ duration: 1.2, times: [0, 0.4, 0.6, 1] }}
              />

              {/* Roots / ground */}
              <motion.path
                d="M180,780 Q220,795 300,800 Q380,795 420,780"
                stroke="#8B7355"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
              />
              <motion.path
                d="M200,780 Q230,805 270,795"
                stroke="#8B7355"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              />
              <motion.path
                d="M400,780 Q370,805 330,795"
                stroke="#8B7355"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              />

              {/* Tree paths - animated drawing effect */}
              {treePaths.map((pathData) => (
                <motion.path
                  key={pathData.id}
                  d={pathData.d}
                  stroke="#5C3D2E"
                  strokeWidth={pathData.id.startsWith('inner') || pathData.id.startsWith('small') ? "2" : "5"}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={controls}
                  variants={pathVariants}
                  custom={pathData.id}
                />
              ))}

              {/* Decorative leaves / canopy dots */}
              {[
                // Branch ends
                { cx: 130, cy: 540 },
                { cx: 470, cy: 540 },
                { cx: 70, cy: 290 },
                { cx: 530, cy: 290 },
                // Canopy outline points
                { cx: 60, cy: 410 },
                { cx: 540, cy: 410 },
                { cx: 100, cy: 190 },
                { cx: 500, cy: 190 },
                { cx: 190, cy: 170 },
                { cx: 410, cy: 170 },
                { cx: 300, cy: 150 },
                { cx: 250, cy: 120 },
                { cx: 350, cy: 120 },
                // Extra leaves for fuller canopy
                { cx: 80, cy: 350 },
                { cx: 520, cy: 350 },
                { cx: 140, cy: 220 },
                { cx: 460, cy: 220 },
              ].map((pos, i) => (
                <motion.circle
                  key={`leaf-${i}`}
                  cx={pos.cx}
                  cy={pos.cy}
                  r="5"
                  fill="#C9A84C"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 3 + i * 0.06, duration: 0.3 }}
                />
              ))}
            </svg>

            {/* Testimonial Cards - positioned on branch tips */}
            <AnimatePresence>
              {testimonials.map((testimonial, index) => {
                const ep = branchEndpoints[testimonial.branch];
                if (!ep) return null;
                const isVisible = index <= visibleIndex;
                return (
                  <motion.div
                    key={testimonial.author}
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.8 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute"
                    style={{
                      left: `${(ep.x / 600) * 100}%`,
                      top: `${(ep.y / 800) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                      width: 'clamp(200px, 40%, 280px)',
                      ...(ep.textAlign === 'right' ? { marginLeft: ep.offsetX } : { marginRight: ep.offsetX }),
                    }}
                  >
                    <div className="bg-white/90 backdrop-blur-sm border border-gold/20 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <p className="text-gray-800 text-sm leading-relaxed italic">
                        "{testimonial.quote}"
                      </p>
                      <p className="text-gold text-xs font-medium mt-2 tracking-wider">
                        — {testimonial.author}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;