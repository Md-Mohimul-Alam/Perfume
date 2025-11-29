import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { X, Plus, Minus, ShoppingCart, Star, Award } from 'lucide-react';

// Enhanced size configuration with premium names
const sizeConfig = {
  perfume: [
    { size: "Petite", volume: "6ml", multiplier: 1, description: "Travel Size" },
    { size: "Elegant", volume: "15ml", multiplier: 1.6, description: "Daily Wear" },
    { size: "Opulent", volume: "30ml", multiplier: 2.6, description: "Signature Collection" }
  ],
  oil: [
    { size: "Essence", volume: "3.5ml", multiplier: 0.8, description: "Sample Vial" },
    { size: "Serene", volume: "6ml", multiplier: 1.12, description: "Personal Use" },
    { size: "Abundant", volume: "15ml", multiplier: 1.8, description: "Regular Collection" },
    { size: "Grand", volume: "30ml", multiplier: 2.8, description: "Luxury Reserve" }
  ]
};

const productEmojis = {
  perfume: '🌸',
  oil: '💧'
};

const ProductModal = ({ product, onClose }) => {
  const [selectedSize, setSelectedSize] = useState(sizeConfig[product.category]?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const { addToCart } = useCart();

  const sizes = sizeConfig[product.category] || [];

  useEffect(() => {
    // Prevent background scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const addToCartFromModal = async () => {
    if (selectedSize) {
      setIsAddingToCart(true);
      // Simulate loading for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      addToCart(product, selectedSize, quantity);
      setIsAddingToCart(false);
      onClose();
    }
  };

  const changeQuantity = (delta) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  const getIntensityIcon = (intensity) => {
    switch (intensity) {
      case 'light': return '🕯️';
      case 'medium': return '💫';
      case 'strong': return '🔥';
      default: return '✨';
    }
  };

  const getScentNotes = () => {
    return product.notes?.map(note => 
      note.charAt(0).toUpperCase() + note.slice(1)
    ).join(' • ') || 'Premium Blend';
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Enhanced Backdrop with 3D Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold/30 rounded-full"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
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

        {/* Main Modal Container with 3D Perspective */}
        <motion.div
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.8, rotateY: -15, opacity: 0 }}
          animate={{ scale: 1, rotateY: 0, opacity: 1 }}
          exit={{ scale: 0.8, rotateY: 15, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          style={{ perspective: "1000px" }}
        >
          <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gold/30 rounded-2xl overflow-hidden shadow-2xl shadow-gold/20 transform-style-3d">
            
            {/* Luxury Header with Gradient */}
            <div className="relative bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border-b border-gold/20 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="text-4xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {productEmojis[product.category]}
                  </motion.div>
                  <div>
                    <h2 className="font-display text-2xl text-white font-light tracking-wide">
                      {product.name}
                    </h2>
                    <p className="text-gold text-sm tracking-widest uppercase">
                      {product.category} • {getIntensityIcon(product.intensity)} {product.intensity} Intensity
                    </p>
                  </div>
                </div>
                
                <motion.button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full border border-gold/30 text-gold flex items-center justify-center hover:bg-gold hover:text-black transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Left Column - Product Visual & Info */}
              <div className="space-y-6">
                {/* 3D Product Visualization */}
                <motion.div 
                  className="relative h-64 bg-gradient-to-br from-gold/10 to-purple-900/10 rounded-xl border border-gold/20 flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="text-8xl"
                    animate={{ 
                      y: [0, -10, 0],
                      rotateY: [0, 5, 0]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {productEmojis[product.category]}
                  </motion.div>
                  
                  {/* Floating Badges */}
                  {product.isBestseller && (
                    <motion.div
                      className="absolute top-4 left-4 bg-gradient-to-r from-gold to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Award size={12} />
                      <span>BESTSELLER</span>
                    </motion.div>
                  )}
                  
                  {product.isNew && (
                    <motion.div
                      className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      NEW
                    </motion.div>
                  )}
                </motion.div>

                {/* Product Details Tabs */}
                <div className="bg-black/50 rounded-xl border border-gold/10 p-4">
                  <div className="flex space-x-4 mb-4">
                    {['details', 'notes', 'usage'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          activeTab === tab
                            ? 'bg-gold text-black'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTab === 'details' && (
                        <div className="space-y-3 text-sm text-gray-300">
                          <p>{product.description}</p>
                          <div className="flex items-center space-x-2 text-gold">
                            <Star size={16} fill="currentColor" />
                            <span>Best for: {product.bestFor?.join(' • ')}</span>
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 'notes' && (
                        <div className="space-y-2">
                          <p className="text-gold font-medium">Scent Profile:</p>
                          <p className="text-sm text-gray-300">{getScentNotes()}</p>
                        </div>
                      )}
                      
                      {activeTab === 'usage' && (
                        <div className="space-y-2 text-sm text-gray-300">
                          <p>• Apply to pulse points for lasting fragrance</p>
                          <p>• Store in cool, dry place away from direct sunlight</p>
                          <p>• Fragrance lasts 6-8 hours</p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Column - Selection & Actions */}
              <div className="space-y-6">
                {/* Size Selection - Premium Cards */}
                <div>
                  <label className="text-white text-lg font-light tracking-wide mb-4 block">
                    Select Your Size
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {sizes.map((size, index) => (
                      <motion.button
                        key={size.size}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                          selectedSize?.size === size.size
                            ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                            : 'border-gold/20 bg-black/30 hover:border-gold/40 hover:bg-gold/5'
                        }`}
                        onClick={() => setSelectedSize(size)}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`font-semibold ${
                          selectedSize?.size === size.size ? 'text-gold' : 'text-white'
                        }`}>
                          {size.size}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {size.volume}
                        </div>
                        <div className="text-gold text-lg font-bold mt-2">
                          ${Math.round(product.basePrice * size.multiplier)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {size.description}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector - Luxury Design */}
                <div>
                  <label className="text-white text-lg font-light tracking-wide mb-4 block">
                    Quantity
                  </label>
                  <div className="flex items-center justify-between bg-black/50 rounded-xl border border-gold/20 p-4">
                    <motion.button
                      onClick={() => changeQuantity(-1)}
                      className="w-12 h-12 rounded-full border-2 border-gold text-gold flex items-center justify-center hover:bg-gold hover:text-black transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={quantity <= 1}
                    >
                      <Minus size={20} />
                    </motion.button>
                    
                    <motion.span 
                      className="text-3xl font-light text-white min-w-[60px] text-center"
                      key={quantity}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                    >
                      {quantity}
                    </motion.span>
                    
                    <motion.button
                      onClick={() => changeQuantity(1)}
                      className="w-12 h-12 rounded-full border-2 border-gold text-gold flex items-center justify-center hover:bg-gold hover:text-black transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={quantity >= 10}
                    >
                      <Plus size={20} />
                    </motion.button>
                  </div>
                </div>

                {/* Total Price Display */}
                <motion.div 
                  className="bg-gradient-to-r from-gold/10 to-transparent border border-gold/20 rounded-xl p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total</span>
                    <motion.span 
                      className="text-2xl font-light text-gold"
                      key={selectedSize ? Math.round(product.basePrice * selectedSize.multiplier * quantity) : 0}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                    >
                      ${selectedSize ? Math.round(product.basePrice * selectedSize.multiplier * quantity) : 0}
                    </motion.span>
                  </div>
                </motion.div>

                {/* Add to Cart Button - Premium Animation */}
                <motion.button
                  onClick={addToCartFromModal}
                  disabled={isAddingToCart}
                  className="w-full bg-gradient-to-r from-gold to-yellow-600 text-black py-4 rounded-xl font-bold text-lg tracking-wide relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="flex items-center justify-center space-x-2"
                    initial={false}
                    animate={isAddingToCart ? { opacity: 0 } : { opacity: 1 }}
                  >
                    <ShoppingCart size={20} />
                    <span>Add to Cart</span>
                  </motion.div>
                  
                  {/* Loading Animation */}
                  <AnimatePresence>
                    {isAddingToCart && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          className="w-6 h-6 border-2 border-black border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </motion.button>

                {/* Trust Badges */}
                <div className="flex justify-center space-x-6 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Premium Quality</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Free Shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;