import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../api/axios';

// Fallback icons for notes (unchanged)
const noteIcons = { floral: '🌸', woody: '🌲', citrus: '🍊', oriental: '🕌', amber: '🟠', spicy: '🌶️', sweet: '🍬', fresh: '💧', vanilla: '🍦', fruity: '🍇', musk: '🦌', leather: '👞', aquatic: '🌊', green: '🌿', powdery: '☁️', gourmand: '🍫', default: '✨' };

const getIconForNote = (note) => {
  const key = Object.keys(noteIcons).find(k => note.toLowerCase().includes(k) || k.includes(note.toLowerCase()));
  return noteIcons[key] || noteIcons.default;
};

const ScentNotes = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const sliderRef = useRef(null);

  // Fetch products (or use static data – see commented alternative)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // If you want to use the static JSON directly, replace the API call with:
        // const staticData = [ /* paste your JSON array here */ ];
        // setProducts(staticData.filter(p => p.notes && p.notes.length > 0));
        // setError(null);
        // return;

        const response = await API.get('/products?limit=10000');
        let raw = [];
        if (Array.isArray(response.data)) raw = response.data;
        else if (Array.isArray(response.data.products)) raw = response.data.products;
        else if (Array.isArray(response.data.data)) raw = response.data.data;
        else if (Array.isArray(response.data.items)) raw = response.data.items;

        const valid = raw.filter(p => p.notes && p.notes.length > 0);
        setProducts(valid);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products for scent notes:', err);
        setError('Could not load scent notes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Build unique notes with product counts
  const notesData = useMemo(() => {
    const noteMap = new Map();
    products.forEach(product => {
      // Ensure notes is an array (just in case)
      const notes = Array.isArray(product.notes) ? product.notes : [product.notes];
      notes.forEach(note => {
        const key = note.trim().toLowerCase();
        if (!noteMap.has(key)) {
          noteMap.set(key, {
            id: key,
            label: note.trim(),
            count: 0,
            products: []
          });
        }
        const entry = noteMap.get(key);
        entry.count += 1;
        entry.products.push(product);
      });
    });
    return Array.from(noteMap.values())
      .sort((a, b) => b.count - a.count);
  }, [products]);

  // Responsive items per view (unchanged)
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerView(2);
      else if (width < 1024) setItemsPerView(3);
      else setItemsPerView(4);
    };
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Slider navigation (unchanged)
  const totalSlides = Math.ceil(notesData.length / itemsPerView);
  const goToSlide = (index) => {
    setCurrentIndex(Math.max(0, Math.min(index, totalSlides - 1)));
  };
  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  const visibleNotes = useMemo(() => {
    const start = currentIndex * itemsPerView;
    return notesData.slice(start, start + itemsPerView);
  }, [notesData, currentIndex, itemsPerView]);

  const handleNoteClick = (noteId) => {
    setSelectedNote(selectedNote === noteId ? null : noteId);
  };

  const selectedNoteData = notesData.find(n => n.id === selectedNote);

  // Loading / error / empty states (unchanged)
  if (loading) {
    return (
      <section className="scent-notes py-20 px-4 bg-black min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading scent notes...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="scent-notes py-20 px-4 bg-black min-h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  if (notesData.length === 0) {
    return (
      <section className="scent-notes py-20 px-4 bg-black min-h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p>No scent notes found in products yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="scent-notes py-20 px-4 bg-black relative overflow-hidden m-9">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2
          className="font-display text-4xl lg:text-5xl text-white mb-4 tracking-widest uppercase font-light text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Explore Scent Notes
        </motion.h2>
        <motion.p
          className="text-center text-gray-400 text-lg mb-12 tracking-widest font-light"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Click on a note to see which products contain it
        </motion.p>

        {/* Slider */}
        <div className="relative p-2">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIdx) => (
                <div
                  key={slideIdx}
                  className="flex-shrink-0 w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2"
                >
                  {notesData
                    .slice(slideIdx * itemsPerView, slideIdx * itemsPerView + itemsPerView)
                    .map((note) => {
                      const icon = getIconForNote(note.label);
                      const isActive = selectedNote === note.id;
                      return (
                        <motion.div
                          key={note.id}
                          className="scent-note-item text-center cursor-pointer group"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4 }}
                          onClick={() => handleNoteClick(note.id)}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className={`scent-note-circle w-24 h-24 bg-gold/10 border-2 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 transition-all duration-300 group-hover:bg-gold/20 ${
                            isActive ? 'bg-gold border-gold scale-110' : 'border-gold/30'
                          }`}>
                            {icon}
                          </div>
                          <h3 className="text-white text-lg font-medium capitalize">{note.label}</h3>
                          <p className="text-gray-400 text-sm mt-1">{note.count} product{note.count !== 1 && 's'}</p>
                        </motion.div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-6 w-10 h-10 rounded-full border border-gold/30 bg-black/80 text-gold flex items-center justify-center transition-all hover:bg-gold hover:text-black disabled:opacity-30 disabled:cursor-not-allowed z-10 ${
                  currentIndex === 0 ? 'opacity-30' : ''
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex === totalSlides - 1}
                className={`absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-6 w-10 h-10 rounded-full border border-gold/30 bg-black/80 text-gold flex items-center justify-center transition-all hover:bg-gold hover:text-black disabled:opacity-30 disabled:cursor-not-allowed z-10 ${
                  currentIndex === totalSlides - 1 ? 'opacity-30' : ''
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-gold w-8' : 'bg-gold/30 hover:bg-gold/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Selected note details – improved key handling */}
        <AnimatePresence>
          {selectedNoteData && (
            <motion.div
              className="scent-note-description max-w-4xl mx-auto mt-12 p-8 bg-white/5 border border-gold/20 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-gold text-2xl font-display mb-4 capitalize">
                Products with "{selectedNoteData.label}" note
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {selectedNoteData.products.slice(0, 12).map(product => (
                  <span
                    key={product._id || product.sku || product.name} // ✅ fallback key
                    className="px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-white text-sm"
                  >
                    {product.name}
                  </span>
                ))}
                {selectedNoteData.products.length > 12 && (
                  <span className="px-4 py-2 text-gray-400 text-sm">
                    +{selectedNoteData.products.length - 12} more
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ScentNotes;