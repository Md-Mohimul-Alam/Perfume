// Testimonials.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import Tree from './Tree';

const Testimonials = () => {
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [treeDrawn, setTreeDrawn] = useState(false);
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

  // Branch endpoints – scaled to the 1252×1252 Tree viewBox
  const branchEndpoints = {
    'left-lower': { x: 172, y: 485, offsetX: -90 },   // card moves left
    'right-lower': { x: 1080, y: 485, offsetX: 90 },  // card moves right
    'left-upper': { x: 313, y: 266, offsetX: -90 },
    'right-upper': { x: 939, y: 266, offsetX: 90 },
  };

  const branchIds = ['left-lower', 'right-lower', 'left-upper', 'right-upper'];
  const branchToIndex = {
    'left-lower': 0,
    'right-lower': 1,
    'left-upper': 2,
    'right-upper': 3,
  };

  // Animate tree drawing, then reveal testimonials with dots and sliding cards
  useEffect(() => {
    const animate = async () => {
      // Fade in and draw the tree
      await controls.start('visible');
      // Wait for drawing to complete (Tree animation takes ~4.5s total)
      await new Promise(resolve => setTimeout(resolve, 5000));
      setTreeDrawn(true); // show dots at branch tips

      // Reveal testimonials one by one with a delay
      for (const id of branchIds) {
        await new Promise(resolve => setTimeout(resolve, 400));
        const idx = branchToIndex[id];
        if (idx !== undefined) {
          setVisibleIndex(idx);
        }
      }
    };
    animate();
  }, [controls]);

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
            className="relative w-full max-w-2xl aspect-square"
            style={{ minHeight: '400px' }}
          >
            {/* The Tree component with animated drawing */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: 'easeOut' } }
              }}
              className="w-full h-full"
            >
              <Tree 
                width="100%" 
                height="100%" 
                stroke="#5C3D2E" 
                strokeWidth={3} 
                animated={true}
              />
            </motion.div>

            {/* Testimonial Cards with branch-tip dots */}
            <AnimatePresence>
              {testimonials.map((testimonial, index) => {
                const ep = branchEndpoints[testimonial.branch];
                if (!ep) return null;
                const isVisible = index <= visibleIndex;
                const xPercent = (ep.x / 1252) * 100;
                const yPercent = (ep.y / 1252) * 100;

                return (
                  <motion.div
                    key={testimonial.author}
                    className="absolute"
                    style={{
                      left: `${xPercent}%`,
                      top: `${yPercent}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: treeDrawn ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Glowing dot at the exact branch tip */}
                    <motion.div
                      className="absolute w-3 h-3 rounded-full bg-gold shadow-lg shadow-gold/50"
                      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                      initial={{ scale: 0 }}
                      animate={{ scale: treeDrawn ? 1 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.1 }}
                    />

                    {/* Card that slides out from the dot */}
                    <motion.div
                      className="absolute"
                      style={{
                        left: '50%',
                        top: '50%',
                        width: 'clamp(180px, 28%, 240px)',
                      }}
                      initial={{ x: 0, y: '-50%', scale: 0, opacity: 0 }}
                      animate={isVisible ? { 
                        x: ep.offsetX, 
                        y: '-50%', 
                        scale: 1, 
                        opacity: 1 
                      } : { 
                        x: 0, 
                        y: '-50%', 
                        scale: 0, 
                        opacity: 0 
                      }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 300, 
                        damping: 20, 
                        delay: 0.2 
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