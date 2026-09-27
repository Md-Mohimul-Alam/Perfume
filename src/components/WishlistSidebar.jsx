import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Trash2, ShoppingBag, Eye } from 'lucide-react';

const WishlistSidebar = ({ isOpen, onClose, wishlist, products, onRemove, onViewProduct, onAddToCart }) => {
  // Resolve product objects from IDs
  const items = (wishlist || [])
    .map((id) => products?.find((p) => p.id === id || p._id === id))
    .filter(Boolean);

  const handleProductClick = (product) => {
    if (onViewProduct) onViewProduct(product);
    onClose();
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-xl z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

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
                <Heart size={24} className="text-gold fill-current" />
                Wishlist ({items.length})
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gold transition-colors"
                aria-label="Close wishlist"
              >
                <X size={28} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <Heart size={64} className="text-gold/30 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">Your wishlist is empty</p>
                  <p className="text-gray-500 text-sm mb-6">
                    Tap the heart on any product to save it here
                  </p>
                  <button
                    onClick={onClose}
                    className="text-gold hover:underline text-sm tracking-wider uppercase"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((product, index) => (
                    <motion.div
                      key={product.id || product._id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 p-4 bg-white/5 border border-gold/10 rounded-lg hover:border-gold/30 transition-all cursor-pointer group"
                      onClick={() => handleProductClick(product)}
                    >
                      {/* Image / emoji */}
                      <div className="w-16 h-16 flex-shrink-0 bg-gold/10 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.mainImage ? (
                          <img
                            src={product.mainImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentNode.textContent = product.category === 'perfume' ? '🌸' : '💧';
                            }}
                          />
                        ) : (
                          <span className="text-3xl">
                            {product.category === 'perfume' ? '🌸' : '💧'}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-sm truncate group-hover:text-gold transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-gray-400 text-xs mt-0.5 capitalize">
                          {product.category || product.type}
                        </p>
                        <p className="text-gold text-sm font-semibold mt-1">
                          From ৳{product.basePrice || 0}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="flex items-center gap-1 text-[11px] tracking-wider uppercase text-gold border border-gold/30 rounded px-2 py-1 hover:bg-gold hover:text-black transition-all"
                            title="Add to cart"
                          >
                            <ShoppingBag size={12} />
                            Add
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleProductClick(product); }}
                            className="flex items-center gap-1 text-[11px] tracking-wider uppercase text-white/70 border border-white/20 rounded px-2 py-1 hover:bg-white/10 transition-all"
                            title="View details"
                          >
                            <Eye size={12} />
                            View
                          </button>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(product.id || product._id);
                        }}
                        className="text-gray-400 hover:text-red-400 transition-colors flex-shrink-0 self-start"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gold/15 p-6">
                <button
                  onClick={onClose}
                  className="w-full bg-transparent border border-gold/40 text-gold py-3 tracking-widest uppercase text-sm hover:bg-gold hover:text-black transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WishlistSidebar;