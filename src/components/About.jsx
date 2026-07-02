import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Calendar, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="about-section py-20 px-4 bg-white relative overflow-hidden">
      {/* Decorative Glow (subtle) */}
      <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.h2 
          className="font-display text-4xl lg:text-5xl text-black mb-4 tracking-widest uppercase font-light"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About LUXE
        </motion.h2>

        <motion.div
          className="w-16 h-0.5 bg-gold mx-auto mb-8"
          initial={{ width: 0 }}
          whileInView={{ width: '4rem' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        <motion.p
          className="about-text text-gray-700 text-lg leading-relaxed mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          At <span className="text-gold font-medium">LUXE</span>, we are passionate about bringing you the finest fragrances 
          and essential oils from around the world. Our carefully curated collection features premium perfumes and 
          customizable oils that cater to every preference. From timeless classics to modern masterpieces, each scent 
          tells a unique story. We believe that fragrance is more than just a scent—it's an <span className="text-gold">expression of your 
          personality and style</span>.
        </motion.p>

        {/* Launch Date Highlight */}
        <motion.div
          className="inline-flex items-center gap-3 bg-gold/10 border border-gold/30 rounded-full px-6 py-3 mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Calendar size={20} className="text-gold" />
          <span className="text-gray-700 text-sm tracking-wider">
            <span className="text-gold font-semibold">Launched</span> — August 20, 2025
          </span>
          <Sparkles size={16} className="text-gold animate-pulse" />
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="social-links flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.a
            href="https://www.facebook.com/luxe.perfumers"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link px-6 py-3 bg-gold/10 border border-gold/30 text-gray-700 rounded-full flex items-center gap-3 hover:bg-gold hover:text-white transition-all duration-300 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Facebook size={20} className="group-hover:text-white transition-colors" />
            <span className="tracking-wider text-sm font-light">Follow us on Facebook</span>
          </motion.a>
          
          <motion.a
            href="https://www.instagram.com/luxe_bd"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link px-6 py-3 bg-gold/10 border border-gold/30 text-gray-700 rounded-full flex items-center gap-3 hover:bg-gold hover:text-white transition-all duration-300 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Instagram size={20} className="group-hover:text-white transition-colors" />
            <span className="tracking-wider text-sm font-light">Follow us on Instagram</span>
          </motion.a>
        </motion.div>

        {/* Decorative Bottom Line */}
        <motion.div
          className="mt-16 w-24 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mx-auto"
          initial={{ width: 0 }}
          whileInView={{ width: '6rem' }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />
      </div>
    </section>
  );
};

export default About;