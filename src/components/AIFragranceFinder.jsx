import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';

// Mapping of note keywords to scent families
const noteFamilyMap = {
  floral: 'floral',
  rose: 'floral',
  jasmine: 'floral',
  lily: 'floral',
  violet: 'floral',
  tuberose: 'floral',
  woody: 'woody',
  cedar: 'woody',
  sandalwood: 'woody',
  patchouli: 'woody',
  vetiver: 'woody',
  citrus: 'citrus',
  lemon: 'citrus',
  orange: 'citrus',
  bergamot: 'citrus',
  grapefruit: 'citrus',
  oriental: 'oriental',
  amber: 'oriental',
  vanilla: 'oriental',
  spice: 'oriental',
  spicy: 'oriental',
  musk: 'oriental',
  fresh: 'fresh',
  aquatic: 'fresh',
  green: 'fresh',
  fruity: 'fruity',
  sweet: 'gourmand',
  gourmand: 'gourmand',
  chocolate: 'gourmand',
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

// Helper to get display price (minimum positive price among valid sizes)
const getDisplayPrice = (product) => {
  if (!product.sizes || product.sizes.length === 0) return 0;
  const validSizes = product.sizes.filter(s => s.sellingPrice > 0 && s.sizeMl !== 3);
  if (validSizes.length === 0) return 0;
  return Math.min(...validSizes.map(s => s.sellingPrice));
};

const AIFragranceFinder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products
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

        // Filter products with at least one positive-priced size (excluding 3ml)
        const valid = raw.filter(p => {
          if (!p.sizes || p.sizes.length === 0) return false;
          return p.sizes.some(s => s.sellingPrice > 0 && s.sizeMl !== 3);
        });
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

  // Build dynamic options
  const stepOptions = useMemo(() => {
    if (products.length === 0) return [];

    const intensities = new Set();
    products.forEach(p => {
      if (p.intensity) intensities.add(p.intensity);
    });
    const intensityOptions = Array.from(intensities).map(val => ({
      value: val,
      label: val.charAt(0).toUpperCase() + val.slice(1)
    }));

    const families = new Set();
    products.forEach(p => {
      if (p.notes && p.notes.length > 0) {
        const family = getScentFamily(p.notes);
        if (family !== 'other') families.add(family);
      }
    });
    const familyOptions = Array.from(families).map(val => ({
      value: val,
      label: val.charAt(0).toUpperCase() + val.slice(1)
    }));

    const bestForSet = new Set();
    products.forEach(p => {
      if (p.bestFor && p.bestFor.length > 0) {
        p.bestFor.forEach(bf => bestForSet.add(bf));
      }
    });
    const bestForOptions = Array.from(bestForSet).map(val => ({
      value: val,
      label: val.charAt(0).toUpperCase() + val.slice(1)
    }));

    return [
      { step: 1, question: "What mood are you seeking?", options: intensityOptions },
      { step: 2, question: "Which scent family resonates with you?", options: familyOptions },
      { step: 3, question: "When will you primarily wear this fragrance?", options: bestForOptions }
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
    setAnswers({});
    setCurrentStep(1);
  };

  if (loading) {
    return (
      <section className="ai-fragrance-finder py-20 px-4 bg-black/80 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading fragrance finder...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="ai-fragrance-finder py-20 px-4 bg-black/80 min-h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="ai-fragrance-finder py-20 px-4 bg-black/80 min-h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p>No products available to find fragrances.</p>
        </div>
      </section>
    );
  }

  const progress = (currentStep / 4) * 100;

  return (
    <section className="ai-fragrance-finder py-20 px-4 bg-black/80 relative overflow-hidden border-y border-gold/20">
      <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-purple-900/10 animate-pulse" />
      
      <div className="max-w-6xl mx-auto relative z-10 text-center">
        <motion.h2 
          className="font-display text-4xl text-white mb-4 tracking-widest uppercase font-light"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          AI Fragrance Finder
        </motion.h2>
        
        <motion.p
          className="text-gray-400 text-lg mb-12 tracking-widest font-light"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Our advanced AI will help you discover your perfect scent
        </motion.p>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gold/20 rounded-full mb-12 overflow-hidden">
          <motion.div 
            className="h-full bg-gold"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {currentStep <= 3 ? (
            stepOptions.map((step) => (
              currentStep === step.step && (
                <motion.div
                  key={step.step}
                  className="ai-finder-step"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="ai-finder-question text-2xl text-white mb-8 font-light tracking-wide">
                    {step.question}
                  </div>
                  
                  <div className="ai-finder-options flex flex-wrap justify-center gap-4">
                    {step.options.map((option) => (
                      <motion.button
                        key={option.value}
                        className={`px-6 py-3 border text-sm tracking-wider uppercase font-light transition-all duration-300 ${
                          answers[step.step] === option.value
                            ? 'border-gold bg-gold text-black'
                            : 'border-gold/30 text-white hover:border-gold'
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
                    <button
                      onClick={goBack}
                      className="mt-8 text-gray-400 hover:text-gold transition-colors"
                    >
                      ← Go back
                    </button>
                  )}
                </motion.div>
              )
            ))
          ) : (
            // Results
            <motion.div
              className="ai-finder-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl text-white mb-6 font-light tracking-wide">
                Your recommended fragrances
              </h3>

              {recommendedProducts.length === 0 ? (
                <div className="text-gray-400">
                  <p>No products match your criteria. Try different selections.</p>
                  <button
                    onClick={resetFinder}
                    className="mt-4 text-gold underline"
                  >
                    Start over
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {recommendedProducts.slice(0, 12).map((product) => {
                    const displayPrice = getDisplayPrice(product);
                    return (
                      <div
                        key={product._id}
                        className="bg-white/5 border border-gold/15 rounded-lg p-4 text-left hover:border-gold transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gold text-sm uppercase tracking-wider">
                            {product.type === 'spray' ? 'Perfume' : 'Oil'}
                          </span>
                          {product.isBestseller && (
                            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">Bestseller</span>
                          )}
                        </div>
                        <h4 className="text-white text-lg font-light mt-2">{product.name}</h4>
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{product.description}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-gold font-medium">
                            From ৳{displayPrice}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            {product.intensity} • {product.bestFor?.join(', ')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-center gap-4 mt-10">
                <button
                  onClick={resetFinder}
                  className="px-6 py-2 border border-gold/30 text-white hover:bg-gold/10 transition-colors"
                >
                  Start Over
                </button>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 bg-gold text-black hover:bg-gold/90 transition-colors"
                >
                  Refine Search
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AIFragranceFinder;