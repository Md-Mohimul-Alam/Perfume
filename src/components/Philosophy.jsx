import React from 'react';
import { motion } from 'framer-motion';

const Philosophy = () => {
  return (
    <section className="philosophy-section py-20 px-4 bg-black relative overflow-hidden border-t border-gold/15">
      <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="philosophy-title font-display text-5xl text-white mb-8 font-light tracking-wide relative">
              We craft luxury.
              <div className="absolute top-0 left-0 w-16 h-0.5 bg-gold -translate-y-2" />
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="philosophy-text text-gray-400 text-lg leading-relaxed space-y-6">
              <p>
                Our fragrances are more than just scents—they are statements. LUXE blends fine ingredients 
                and meticulous artistry to deliver timeless olfactory experiences. Every bottle embodies 
                sophistication, inviting you to embrace a world where minimalism meets opulence.
              </p>
              <p>
                In a world flooded with excess, LUXE fragrances stand apart for their clarity, balance, 
                and unforgettable presence. Explore signature aromas designed for identity, memory, and 
                elegance that lasts.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;