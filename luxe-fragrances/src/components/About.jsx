import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="about-section py-20 px-4 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent" />
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.h2 
          className="font-display text-4xl lg:text-5xl text-black mb-8 tracking-widest uppercase font-light"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About LUXE
        </motion.h2>
        
        <motion.p
          className="about-text text-gray-700 text-lg leading-relaxed mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          At LUXE, we are passionate about bringing you the finest fragrances and essential oils from around the world. 
          Our carefully curated collection features premium perfumes and customizable oils that cater to every preference. 
          From timeless classics to modern masterpieces, each scent tells a unique story. We believe that fragrance is 
          more than just a scent—it's an expression of your personality and style.
        </motion.p>

        <motion.div
          className="social-links flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.a
            href="https://www.facebook.com/luxe.perfumers"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link px-6 py-3 bg-gold text-black font-semibold rounded-full flex items-center gap-2 hover:bg-gold/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>📘</span>
            Follow us on Facebook
          </motion.a>
          
          <motion.a
            href="https://www.instagram.com/luxe_bd"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link px-6 py-3 bg-gold text-black font-semibold rounded-full flex items-center gap-2 hover:bg-gold/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>📷</span>
            Follow us on Instagram
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default About;