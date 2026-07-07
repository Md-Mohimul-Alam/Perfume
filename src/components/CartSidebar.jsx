import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, updateCartItemQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const totals = getCartTotal();

  // Format currency in BDT
  const formatCurrency = (amount) => `৳${amount.toFixed(2)}`;

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
              <h3 className="font-display text-2xl text-white font-light flex items-center gap-2">
                <ShoppingBag size={24} className="text-gold" />
                Cart ({getCartCount()})
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gold transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-8xl mb-4">🛒</div>
                  <p className="text-gray-400">Your cart is empty</p>
                  <button
                    onClick={onClose}
                    className="mt-4 text-gold hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex gap-4 p-4 bg-white/5 border border-gold/10 rounded-lg hover:border-gold/30 transition-all"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="text-3xl flex-shrink-0">
                        {item.imageEmoji || '✨'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold truncate">{item.name}</h4>
                        <p className="text-gray-400 text-sm">
                          {item.sizeLabel || `${item.size}ml`} × {item.quantity}
                        </p>
                        <p className="text-gold text-lg font-semibold">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateCartItemQuantity(item.id, -1)}
                            className="w-7 h-7 border border-gold/30 text-white rounded flex items-center justify-center hover:bg-gold hover:text-black transition-all"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartItemQuantity(item.id, 1)}
                            className="w-7 h-7 border border-gold/30 text-white rounded flex items-center justify-center hover:bg-gold hover:text-black transition-all"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
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
                  <div className="flex justify-between text-white text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-white text-sm">
                    <span>Tax (10%)</span>
                    <span>{formatCurrency(totals.tax)}</span>
                  </div>
                  <div className="flex justify-between text-white text-sm">
                    <span>Shipping</span>
                    <span className="text-green-400">
                      {totals.shipping === 0 ? 'FREE' : formatCurrency(totals.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-white text-xl font-bold border-t border-gold/15 pt-2">
                    <span>Total</span>
                    <span className="text-gold">{formatCurrency(totals.total)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    // You can replace this with a navigation to checkout page
                    alert('Proceeding to checkout...');
                  }}
                  className="w-full bg-gold text-black py-4 text-lg font-bold tracking-wider uppercase hover:bg-gold/90 transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/40"
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