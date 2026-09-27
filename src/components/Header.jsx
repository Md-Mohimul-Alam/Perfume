import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Header = ({ toggleCart, wishlist = [], onWishlistClick }) => {
  const { getCartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.2;
      setIsScrolled(window.scrollY > threshold);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const wishlistCount = wishlist?.length || 0;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-md border-b border-gold/30 shadow-[0_4px_30px_rgba(212,175,55,0.15)]'
          : 'bg-transparent backdrop-blur-sm border-b border-gold/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-16 py-5 flex justify-between items-center">
        <motion.a
          href="#home"
          className="logo font-display text-2xl text-white font-light tracking-[0.5em] uppercase relative overflow-hidden"
          whileHover="hover"
        >
          <img src="/logo.jpg" alt="Logo" className="w-20 h-20 object-cover rounded-full" />
          <motion.div
            className="absolute bottom-0 left-0 w-full h-px bg-gold"
            variants={{ hover: { x: 0 }, initial: { x: '-100%' } }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </motion.a>

        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {['Home', 'Shop', 'About'].map((item) => (
              <li key={item}>
                <motion.a
                  href={`#${item.toLowerCase()}`}
                  className="text-white text-sm font-light tracking-wider uppercase relative transition-colors hover:text-gold"
                  whileHover="hover"
                >
                  {item}
                  <motion.div
                    className="absolute bottom-0 left-0 w-0 h-px bg-gold"
                    variants={{ hover: { width: '100%' } }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side: Wishlist + Cart */}
        <div className="flex items-center gap-3">
          {/* ✅ Wishlist Button */}
          <motion.button
            onClick={onWishlistClick}
            className="relative w-12 h-12 rounded-full border border-gold/40 text-white flex items-center justify-center hover:bg-gold hover:text-black transition-all duration-300 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open wishlist"
          >
            <Heart
              size={20}
              className={wishlistCount > 0 ? 'fill-current' : ''}
              strokeWidth={2}
            />

            {/* Badge */}
            <AnimatePresence>
              {wishlistCount > 0 && (
                <motion.span
                  key={wishlistCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-semibold border border-black/40"
                >
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Cart Button (existing) */}
          <motion.button
            className="cart-btn flex items-center space-x-2 bg-transparent border border-gold text-white px-6 py-3 text-sm tracking-wider uppercase font-light relative overflow-hidden group"
            onClick={toggleCart}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              variants={{ hover: { x: -100 } }}
              transition={{ duration: 0.4 }}
              className="relative z-10 flex items-center space-x-2"
            >
              <ShoppingBag size={20} />
              <span>CART</span>
            </motion.span>

            <AnimatePresence>
              <motion.span
                key={getCartCount()}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="cart-count bg-gold text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold"
              >
                {getCartCount()}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;