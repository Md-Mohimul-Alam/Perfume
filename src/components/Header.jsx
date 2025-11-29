import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';

const Header = ({ toggleCart }) => {
  const { getCartCount } = useCart();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-gold/15"
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
            variants={{
              hover: { x: 0 },
              initial: { x: "-100%" }
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
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
                    variants={{
                      hover: { width: "100%" }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              </li>
            ))}
          </ul>
        </nav>

        <motion.button
          className="cart-btn flex items-center space-x-2 bg-transparent border border-gold text-white px-6 py-3 text-sm tracking-wider uppercase font-light relative overflow-hidden group"
          onClick={toggleCart}
          whileHover="hover"
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            variants={{
              hover: { x: -100 }
            }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex items-center space-x-2"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8.5" cy="17.5" r="1.5"/>
              <circle cx="15.5" cy="17.5" r="1.5"/>
              <path d="M3 3h2.5l2.67 13.39A2 2 0 0 0 10.08 18.5h7.66a2 2 0 0 0 1.91-1.39L21 7.5H6.16"/>
            </svg>
            <span>CART</span>
          </motion.span>
          
          <motion.span
            variants={{
              hover: { x: 0 }
            }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-transparent flex items-center justify-center text-black z-20"
          >
          </motion.span>

          <motion.span
            className="cart-count bg-gold text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold"
            whileHover={{ scale: 1.1 }}
          >
            {getCartCount()}
          </motion.span>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;