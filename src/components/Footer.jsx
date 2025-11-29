import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const subscribeNewsletter = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const email = e.target.email.value;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email) {
      setIsSubscribed(true);
      e.target.reset();
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }
    
    setIsLoading(false);
  };

  const socialLinks = [
    { icon: '📷', href: 'https://instagram.com/luxe_bd', label: 'Instagram' },
    { icon: '📘', href: 'https://facebook.com/luxe.perfumers', label: 'Facebook' },
    { icon: '🐦', href: 'https://twitter.com/luxe_perfumes', label: 'Twitter' },
    { icon: '💼', href: 'https://linkedin.com/company/luxe', label: 'LinkedIn' }
  ];

  const quickLinks = [
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Shipping', href: '/shipping' }
  ];

  return (
    <footer className="relative bg-black border-t border-gold/20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/20 rounded-full"
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
            
            {/* Brand Section */}
            <div className="text-center lg:text-left">
              <motion.h3 
                className="text-2xl font-serif text-gold mb-4 tracking-widest"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                LUXE
              </motion.h3>
              <motion.p 
                className="text-gray-400 text-sm leading-relaxed max-w-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Crafting timeless fragrances that tell your story. Experience the essence of luxury with our exclusive perfume collections.
              </motion.p>
            </div>

            {/* Quick Links */}
            <div className="text-center">
              <motion.h4 
                className="text-gold font-medium mb-6 tracking-wider text-sm uppercase"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Quick Links
              </motion.h4>
              <div className="flex flex-wrap justify-center gap-6">
                {quickLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className="text-gray-400 hover:text-gold transition-colors duration-300 text-sm tracking-wider"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="text-center lg:text-right">
              <motion.h4 
                className="text-gold font-medium mb-6 tracking-wider text-sm uppercase"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Stay Updated
              </motion.h4>
              
              <AnimatePresence>
                {isSubscribed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg"
                  >
                    <p className="text-green-400 text-sm">🎉 Thank you for subscribing!</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.form 
                onSubmit={subscribeNewsletter}
                className="flex flex-col sm:flex-row gap-3 justify-end"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 bg-gray-900/50 border border-gold/30 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:border-gold focus:bg-gray-800/50 transition-all duration-300 min-w-0 flex-1"
                  required
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  className="px-6 py-3 bg-gold text-black font-medium rounded-lg hover:bg-gold/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Subscribing...
                    </div>
                  ) : (
                    'Subscribe'
                  )}
                </motion.button>
              </motion.form>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gold/10 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              
              {/* Copyright */}
              <motion.div 
                className="text-gray-500 text-sm tracking-wider text-center lg:text-left"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                &copy; {currentYear} LUXE Perfumes. All rights reserved.
              </motion.div>

              {/* Social Links */}
              <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-white transition-colors duration-300 text-lg p-2 hover:bg-gold/10 rounded-lg"
                    aria-label={social.label}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </motion.div>

              {/* Payment Methods */}
              <motion.div 
                className="flex items-center gap-2 text-gray-500 text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <span className="mr-2">Secure payments:</span>
                <span>💳</span>
                <span>📱</span>
                <span>🌐</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;