import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, updateCartItemQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const totals = getCartTotal();

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-black border-l border-gold/15 z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gold/15 flex justify-between items-center">
              <h3 className="font-display text-2xl text-white font-light">
                Shopping Cart
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 text-3xl hover:text-gold transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-8xl mb-4">🛒</div>
                  <p className="text-gray-400">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex gap-4 p-4 bg-white/5 border border-gold/10 rounded-none"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="text-4xl">
                        {item.category === 'perfume' ? '🌸' : '💧'}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{item.name}</h4>
                        <p className="text-gray-400 text-sm">
                          {item.size} × {item.quantity}
                        </p>
                        <p className="text-gold text-lg font-semibold">
                          ${item.price * item.quantity}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => updateCartItemQuantity(item.id, -1)}
                            className="px-2 py-1 border border-gold/30 text-white text-sm hover:bg-gold hover:text-black transition-all"
                          >
                            -
                          </button>
                          <button
                            onClick={() => updateCartItemQuantity(item.id, 1)}
                            className="px-2 py-1 border border-gold/30 text-white text-sm hover:bg-gold hover:text-black transition-all"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors text-xl"
                      >
                        🗑
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gold/15 p-6">
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-white">
                    <span>Subtotal:</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Tax (10%):</span>
                    <span>${totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Shipping:</span>
                    <span>{totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-white text-xl font-bold border-t border-gold/15 pt-2">
                    <span>Total:</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => alert('Proceeding to checkout...')}
                  className="w-full bg-gold text-black py-4 text-lg font-bold tracking-wider uppercase hover:bg-gold/90 transition-all duration-300"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartSidebar;