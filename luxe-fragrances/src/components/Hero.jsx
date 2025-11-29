import React from 'react';
import { motion } from 'framer-motion';
import Bottle3D from './Bottle3D';

const Hero = () => {
  const scrollToShop = () => {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-4 lg:px-16">
      {/* Background Particles */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-gold rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, 30, 0],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 15,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center text-white py-32">
        <motion.h1
          className="hero-title font-display font-light tracking-[0.5em] uppercase mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            fontSize: 'clamp(3.75rem, 12vw, 8.75rem)',
            textShadow: '0 0 30px rgba(212, 175, 55, 0.5)'
          }}
        >
          LUXE
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gold"
        />

        <motion.p
          className="hero-subtitle text-gray-400 text-lg tracking-widest uppercase font-light mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Premium Fragrances & Essential Oils
        </motion.p>

        {/* 3D Bottle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="my-16"
        >
          <Bottle3D />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 mb-8"
        >
          <motion.button
            className="cta-btn border border-gold text-white px-12 py-4 tracking-widest uppercase text-sm font-light relative overflow-hidden group"
            onClick={scrollToShop}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              variants={{
                hover: { x: -100 }
              }}
              transition={{ duration: 0.4 }}
              className="relative z-10"
            >
              Explore Collection
            </motion.span>
            <motion.span
              variants={{
                hover: { x: 0 }
              }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-gold text-black flex items-center justify-center z-20"
            >
              Explore Collection
            </motion.span>
          </motion.button>
        </motion.div>

        <motion.div
          className="scroll-indicator opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-8 mx-auto mb-2"
          >
            <svg viewBox="0 0 32 32" fill="none" className="text-gold">
              <path d="M16 8v16M16 24l-6-7M16 24l6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
          <div className="text-gold text-xs tracking-widest">SCROLL</div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;