import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

// Add these constants directly in the component file
const sizeConfig = {
  perfume: [
    { size: "6ml", multiplier: 1 },
    { size: "15ml", multiplier: 1.6 },
    { size: "30ml", multiplier: 2.6 }
  ],
  oil: [
    { size: "3.5ml", multiplier: 0.8 },
    { size: "6ml", multiplier: 1.12 },
    { size: "15ml", multiplier: 1.8 },
    { size: "30ml", multiplier: 2.8 }
  ]
};

const productEmojis = {
  perfume: '🌸',
  oil: '💧'
};

const ProductsGrid = ({ products, wishlist, toggleWishlist, openProductModal }) => {
  const [currentFilter, setCurrentFilter] = useState('all');
  const { addToCart } = useCart();

  const quickAddToCart = (product, event) => {
    event?.stopPropagation();
    const defaultSize = sizeConfig[product.category]?.[0];
    if (defaultSize) {
      addToCart(product, defaultSize);
    }
  };

  const filteredProducts = products.filter(product => {
    switch (currentFilter) {
      case 'perfume':
        return product.category === 'perfume';
      case 'oil':
        return product.category === 'oil';
      case 'new':
        return product.isNew;
      case 'bestsellers':
        return product.isBestseller;
      default:
        return true;
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section id="shop" className="py-20 px-4 lg:px-16 bg-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent animate-pulse" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2 
          className="font-display text-4xl lg:text-5xl text-center text-white mb-4 tracking-widest uppercase font-light"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textShadow: '0 0 20px rgba(212, 175, 55, 0.5)' }}
        >
          Our Collection
        </motion.h2>
        
        <motion.p
          className="text-center text-gray-400 text-lg mb-12 tracking-widest font-light"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Discover our premium selection of fragrances and oils
        </motion.p>

        {/* Filter Tabs */}
        <div className="filter-tabs flex justify-center gap-4 mb-16 flex-wrap">
          {[
            { key: 'all', label: 'All Products' },
            { key: 'perfume', label: 'Perfumes' },
            { key: 'oil', label: 'Essential Oils' },
            { key: 'new', label: 'New Arrivals' },
            { key: 'bestsellers', label: 'Bestsellers' }
          ].map((filter) => (
            <motion.button
              key={filter.key}
              className={`filter-btn px-7 py-3 border border-gold/30 text-white text-sm tracking-wider uppercase font-light relative overflow-hidden group ${
                currentFilter === filter.key ? 'text-black' : ''
              }`}
              onClick={() => setCurrentFilter(filter.key)}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                variants={{
                  hover: { x: currentFilter === filter.key ? 0 : -100 }
                }}
                transition={{ duration: 0.4 }}
                className="relative z-10"
              >
                {filter.label}
              </motion.span>
              <motion.span
                variants={{
                  hover: { x: 0 }
                }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-gold flex items-center justify-center z-20"
              />
            </motion.button>
          ))}
        </div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <AnimatePresence>
            {filteredProducts.map((product) => {
              const defaultSize = sizeConfig[product.category]?.[0];
              const displayPrice = defaultSize ? Math.round(product.basePrice * defaultSize.multiplier) : product.basePrice;
              const isInWishlist = wishlist.includes(product.id);
              
              return (
                <motion.div
                  key={product.id}
                  className="product-card group relative bg-white/5 border border-gold/15 rounded-lg overflow-hidden transition-all duration-400 hover:border-gold hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gold/20"
                  variants={itemVariants}
                  layout
                  whileHover={{ y: -8 }}
                >
                  {/* Badges */}
                  <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-gold text-black px-3 py-1 text-xs font-semibold rounded animate-pulse">
                        NEW
                      </span>
                    )}
                    {product.isBestseller && (
                      <span className="bg-red-600 text-white px-3 py-1 text-xs font-semibold rounded">
                        BESTSELLER
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
                      isInWishlist 
                        ? 'text-red-500 scale-110' 
                        : 'text-white hover:scale-110 hover:text-red-400'
                    }`}
                  >
                    <Heart 
                      size={20} 
                      fill={isInWishlist ? 'currentColor' : 'none'} 
                    />
                  </button>

                  {/* Product Image */}
                  <div 
                    className="w-full h-80 bg-gradient-to-br from-gold/10 to-purple-900/10 flex items-center justify-center relative overflow-hidden cursor-pointer"
                    onClick={() => openProductModal(product)}
                  >
                    <span className="text-6xl transition-transform duration-300 group-hover:scale-110">
                      {productEmojis[product.category] || '✨'}
                    </span>
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex space-x-4">
                        <button
                          onClick={(e) => quickAddToCart(product, e)}
                          className="w-12 h-12 bg-gold text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                        >
                          <ShoppingCart size={20} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openProductModal(product);
                          }}
                          className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                        >
                          <Eye size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <span className="text-gray-400 text-xs tracking-widest uppercase font-medium">
                      {product.category}
                    </span>
                    <h3 className="font-display text-xl text-white mt-2 mb-3 font-normal tracking-wide line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gold text-2xl font-light mb-4 tracking-wide">
                      From ${displayPrice}
                    </p>
                    <button
                      onClick={(e) => quickAddToCart(product, e)}
                      className="w-full bg-transparent border border-gold/30 text-white py-3 px-6 text-sm tracking-wider uppercase font-light hover:bg-gold hover:text-black transition-all duration-300 relative overflow-hidden group"
                    >
                      <span className="relative z-10">Quick Add to Cart</span>
                      <div className="absolute inset-0 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsGrid;