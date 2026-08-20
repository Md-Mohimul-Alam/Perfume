import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Sparkles, Search } from 'lucide-react';
import API from '../api/axios';

// ----- Helper functions (unchanged) -----
const noteFamilyMap = {
  floral: 'floral', rose: 'floral', jasmine: 'floral', lily: 'floral', violet: 'floral',
  woody: 'woody', cedar: 'woody', sandalwood: 'woody', patchouli: 'woody', vetiver: 'woody',
  citrus: 'citrus', lemon: 'citrus', orange: 'citrus', bergamot: 'citrus', grapefruit: 'citrus',
  oriental: 'oriental', amber: 'oriental', vanilla: 'oriental', spice: 'oriental', spicy: 'oriental', musk: 'oriental',
  fresh: 'fresh', aquatic: 'fresh', green: 'fresh', fruity: 'fruity', sweet: 'gourmand', gourmand: 'gourmand'
};

const getScentFamily = (notesArray) => {
  if (!notesArray || notesArray.length === 0) return 'other';
  for (const note of notesArray) {
    const lower = note.toLowerCase();
    for (const [key, family] of Object.entries(noteFamilyMap)) {
      if (lower.includes(key)) return family;
    }
  }
  return 'other';
};

const getDisplayPrice = (product) => {
  if (!product.sizes || product.sizes.length === 0) return 0;
  const validSizes = product.sizes.filter(s => s.sellingPrice > 0 && s.sizeMl !== 3);
  if (validSizes.length === 0) return 0;
  return Math.min(...validSizes.map(s => s.sellingPrice));
};

// ----- Main Component -----
const AIFragranceFinder = ({ openProductModal }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  // Fetch products (unchanged)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await API.get('/products?limit=10000');
        let raw = [];
        if (Array.isArray(response.data)) raw = response.data;
        else if (Array.isArray(response.data.products)) raw = response.data.products;
        else if (Array.isArray(response.data.data)) raw = response.data.data;
        else if (Array.isArray(response.data.items)) raw = response.data.items;
        const valid = raw.filter(p => p.sizes && p.sizes.some(s => s.sellingPrice > 0 && s.sizeMl !== 3));
        setProducts(valid);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Could not load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Build dynamic options from product data (unchanged logic, but we add labels for steps)
  const stepOptions = useMemo(() => {
    if (products.length === 0) return [];
    const intensities = new Set();
    products.forEach(p => { if (p.intensity) intensities.add(p.intensity); });
    const intensityOptions = Array.from(intensities).map(val => ({ value: val, label: val.charAt(0).toUpperCase() + val.slice(1) }));
    const families = new Set();
    products.forEach(p => {
      if (p.notes && p.notes.length > 0) {
        const family = getScentFamily(p.notes);
        if (family !== 'other') families.add(family);
      }
    });
    const familyOptions = Array.from(families).map(val => ({ value: val, label: val.charAt(0).toUpperCase() + val.slice(1) }));
    const bestForSet = new Set();
    products.forEach(p => { if (p.bestFor && p.bestFor.length > 0) p.bestFor.forEach(bf => bestForSet.add(bf)); });
    const bestForOptions = Array.from(bestForSet).map(val => ({ value: val, label: val.charAt(0).toUpperCase() + val.slice(1) }));
    return [
      { step: 1, question: "What mood are you seeking?", options: intensityOptions, icon: '✨' },
      { step: 2, question: "Which scent family resonates with you?", options: familyOptions, icon: '🌸' },
      { step: 3, question: "When will you primarily wear this fragrance?", options: bestForOptions, icon: '📅' }
    ];
  }, [products]);

  // Filter products based on answers
  const recommendedProducts = useMemo(() => {
    if (Object.keys(answers).length < 3) return [];
    const selectedIntensity = answers[1];
    const selectedFamily = answers[2];
    const selectedBestFor = answers[3];
    return products.filter(p => {
      if (selectedIntensity && p.intensity !== selectedIntensity) return false;
      if (selectedFamily) {
        const family = getScentFamily(p.notes);
        if (family !== selectedFamily) return false;
      }
      if (selectedBestFor) {
        if (!p.bestFor || !p.bestFor.includes(selectedBestFor)) return false;
      }
      return true;
    });
  }, [products, answers]);

  // Handlers
  const selectOption = (stepId, value) => {
    setAnswers(prev => ({ ...prev, [stepId]: value }));
    setTimeout(() => {
      if (stepId < 3) setCurrentStep(stepId + 1);
      else setCurrentStep(4);
    }, 400);
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const resetFinder = () => {
    setIsResetting(true);
    setAnswers({});
    setCurrentStep(1);
    setTimeout(() => setIsResetting(false), 400);
  };

  // Step labels
  const stepLabels = ['Mood', 'Scent Family', 'Occasion'];

  // Loading state
  if (loading) {
    return (
      <section className="py-20 px-4 bg-black/80 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm tracking-widest uppercase">Loading fragrance finder...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 px-4 bg-black/80 min-h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 border border-gold/30 text-white hover:bg-gold hover:text-black transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // Empty products
  if (products.length === 0) {
    return (
      <section className="py-20 px-4 bg-black/80 min-h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-2xl mb-2">🛒</p>
          <p>No products available to find fragrances.</p>
        </div>
      </section>
    );
  }

  // ----- Render -----
  return (
    <section className="py-20 px-4 bg-black/80 relative overflow-hidden border-y border-gold/20">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-purple-900/10 to-gold/10 animate-pulse" />
      <div className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/3 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4 tracking-widest uppercase font-light gold-gradient">
            AI Fragrance Finder
          </h2>
          <p className="text-gray-400 text-lg mb-12 tracking-widest font-light">
            Our advanced AI will help you discover your perfect scent
          </p>
        </motion.div>

        {/* Step progress with labels */}
        <div className="flex justify-center items-center gap-2 md:gap-6 mb-12">
          {[1, 2, 3].map((step) => {
            const isActive = currentStep === step;
            const isCompleted = currentStep > step;
            const isNext = currentStep === step + 1; // for animation of line

            return (
              <div key={step} className="flex items-center">
                <motion.div
                  className={`relative flex flex-col items-center transition-colors ${
                    isCompleted ? 'text-gold' : isActive ? 'text-gold' : 'text-gray-400'
                  }`}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors
                    ${isCompleted ? 'bg-gold border-gold text-black' :
                      isActive ? 'border-gold text-gold' : 'border-gold/30 text-gray-400'}
                  `}>
                    {isCompleted ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        ✓
                      </motion.span>
                    ) : (
                      step
                    )}
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest mt-1 ${
                    isCompleted ? 'text-gold' : isActive ? 'text-gold' : 'text-gray-500'
                  }`}>
                    {stepLabels[step - 1]}
                  </span>
                </motion.div>
                {step < 3 && (
                  <motion.div
                    className={`w-8 md:w-16 h-0.5 mx-2 md:mx-4 ${
                      isCompleted ? 'bg-gold' : 'bg-gold/30'
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <AnimatePresence mode="wait">
          {currentStep <= 3 ? (
            stepOptions.map((step) => (
              currentStep === step.step && (
                <motion.div
                  key={step.step}
                  className="ai-finder-step"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <div className="text-2xl md:text-3xl text-white mb-8 font-light tracking-wide">
                    <span className="mr-2">{step.icon}</span>
                    {step.question}
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    {step.options.map((option) => (
                      <motion.button
                        key={option.value}
                        className={`px-6 py-3 border text-sm tracking-wider uppercase font-light transition-all duration-300 ${
                          answers[step.step] === option.value
                            ? 'border-gold bg-gold text-black shadow-lg shadow-gold/30'
                            : 'border-gold/30 text-white hover:border-gold hover:bg-gold/10'
                        }`}
                        onClick={() => selectOption(step.step, option.value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                  {currentStep > 1 && (
                    <motion.button
                      onClick={goBack}
                      className="mt-8 text-gray-400 hover:text-gold transition-colors flex items-center justify-center gap-2 mx-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <ChevronLeft size={16} /> Go back
                    </motion.button>
                  )}
                </motion.div>
              )
            ))
          ) : (
            // Results step
            <motion.div
              className="ai-finder-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="text-gold" size={24} />
                <h3 className="text-2xl md:text-3xl text-white font-light tracking-wide">
                  Your recommended fragrances
                </h3>
                <span className="text-gold text-sm bg-gold/20 px-3 py-1 rounded-full">
                  {recommendedProducts.length} found
                </span>
              </div>

              {recommendedProducts.length === 0 ? (
                <motion.div
                  className="text-gray-400 py-12"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <p className="text-6xl mb-4">🔍</p>
                  <p>No products match your criteria. Try different selections.</p>
                  <button
                    onClick={resetFinder}
                    className="mt-4 text-gold underline hover:text-gold/80 transition"
                  >
                    Start over
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {recommendedProducts.slice(0, 12).map((product, index) => {
                      const displayPrice = getDisplayPrice(product);
                      return (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group bg-white/5 border border-gold/15 rounded-xl p-5 text-left hover:border-gold hover:bg-white/10 transition-all duration-300 cursor-pointer hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
                          onClick={() => openProductModal(product)}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-gold text-xs tracking-widest uppercase font-medium">
                              {product.type === 'spray' ? 'Perfume' : 'Oil'}
                            </span>
                            {product.isBestseller && (
                              <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded-full">Bestseller</span>
                            )}
                          </div>
                          <h4 className="text-white text-lg font-light mt-2 group-hover:text-gold transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                            {product.description || 'A premium fragrance crafted for the discerning.'}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-gold font-semibold">From ৳{displayPrice}</span>
                            <span className="text-xs text-gray-500 capitalize">
                              {product.intensity} • {product.bestFor?.slice(0, 2).join(', ')}
                            </span>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gold/10 flex justify-end">
                            <span className="text-xs text-gold/70 group-hover:text-gold transition flex items-center gap-1">
                              View details <span className="text-lg">→</span>
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  {recommendedProducts.length > 12 && (
                    <p className="text-gray-400 text-sm mt-4">
                      Showing 12 of {recommendedProducts.length} products
                    </p>
                  )}
                </>
              )}

              <div className="flex flex-wrap justify-center gap-4 mt-10">
                <motion.button
                  onClick={resetFinder}
                  className="px-6 py-3 border border-gold/30 text-white hover:bg-gold/10 transition-colors rounded-lg text-sm tracking-wider uppercase"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isResetting}
                >
                  {isResetting ? 'Resetting...' : 'Start Over'}
                </motion.button>
                <motion.button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 bg-gold text-black hover:bg-gold/90 transition-colors rounded-lg text-sm tracking-wider uppercase font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Refine Search
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AIFragranceFinder;