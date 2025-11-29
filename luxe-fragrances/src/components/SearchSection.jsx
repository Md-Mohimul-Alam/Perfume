import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchSection = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const scentNotes = ['Floral', 'Woody', 'Citrus', 'Spicy', 'Fresh', 'Oriental', 'Gourmand', 'Aquatic'];

  return (
    <section className="search-section py-16 px-4 bg-black">
      <div className="max-w-4xl mx-auto text-center">
        <div className="search-container relative">
          <input
            type="search"
            placeholder="Search fragrances, notes, or moods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 bg-transparent border border-gold/30 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-colors text-lg"
          />
          
          <motion.button
            className="filter-toggle mt-6 px-8 py-3 border border-gold/30 text-white text-sm tracking-wider uppercase font-light hover:bg-gold hover:text-black transition-all duration-300"
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showFilters ? 'HIDE FILTERS' : 'ADVANCED FILTERS'}
          </motion.button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="advanced-filters mt-8 p-8 bg-black/90 border border-gold/20 backdrop-blur-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="filter-section mb-8">
                <h3 className="filter-title text-gold text-lg tracking-wider uppercase mb-4">
                  Scent Notes
                </h3>
                <div className="scent-notes flex flex-wrap justify-center gap-3">
                  {scentNotes.map((note) => (
                    <button
                      key={note}
                      className="scent-note px-4 py-2 border border-gold/30 text-white text-sm tracking-wider uppercase hover:bg-gold hover:text-black transition-all duration-300"
                    >
                      {note}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="filter-section">
                <h3 className="filter-title text-gold text-lg tracking-wider uppercase mb-4">
                  Product Type
                </h3>
                <div className="flex justify-center gap-8">
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-gold" />
                    Perfume
                  </label>
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-gold" />
                    Oil
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SearchSection;