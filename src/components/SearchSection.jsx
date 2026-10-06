import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const toList = (value, splitWords = false) => {
  const entries = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[,;|•]/) : [];
  return entries.flatMap((entry) => {
    const text = String(entry).trim();
    return splitWords ? text.split(/\s+/) : [text];
  }).map((entry) => entry.trim().replace(/[.,]+$/g, '')).filter(Boolean);
};

const SearchSection = ({ products = [], onSearchChange = () => {}, onFiltersChange = () => {} }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState(['spray', 'roll-on']);
  const [selectedIntensities, setSelectedIntensities] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);

  const notes = useMemo(() => {
    const values = new Set();
    products.filter((product) => product?.isActive !== false).forEach((product) => {
      toList(product.notes, true).forEach((note) => values.add(note.toLowerCase()));
    });
    return values.size ? [...values].sort() : ['amber', 'citrus', 'floral', 'fresh', 'spicy', 'sweet', 'woody'];
  }, [products]);

  const occasions = useMemo(() => {
    const values = new Set();
    products.filter((product) => product?.isActive !== false).forEach((product) => {
      toList(product.bestFor).forEach((occasion) => values.add(occasion.toLowerCase()));
    });
    return [...values].sort();
  }, [products]);

  const emitFilters = (next = {}) => onFiltersChange({
    notes: next.notes ?? selectedNotes,
    types: next.types ?? selectedTypes,
    intensities: next.intensities ?? selectedIntensities,
    occasions: next.occasions ?? selectedOccasions,
  });

  const toggleItem = (current, value, setter, key) => {
    const updated = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    setter(updated);
    emitFilters({ [key]: updated });
  };

  const clearFilters = () => {
    setSelectedNotes([]);
    setSelectedTypes(['spray', 'roll-on']);
    setSelectedIntensities([]);
    setSelectedOccasions([]);
    onFiltersChange({ notes: [], types: ['spray', 'roll-on'], intensities: [], occasions: [] });
  };

  const Chip = ({ label, active, onClick }) => (
    <button type="button" aria-pressed={active} onClick={onClick} className={`rounded-full border px-3.5 py-2 text-xs capitalize transition ${active ? 'border-gold bg-gold text-black' : 'border-white/15 text-gray-300 hover:border-gold/60 hover:text-gold'}`}>
      {label}
    </button>
  );

  return (
    <section className="bg-[#080807] px-4 py-10" aria-label="Search the fragrance collection">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              placeholder="Search fragrance, notes, or occasion…"
              value={searchQuery}
              onChange={(event) => { setSearchQuery(event.target.value); onSearchChange(event.target.value); }}
              className="w-full rounded-xl border border-gold/20 bg-white/[0.04] py-4 pl-12 pr-4 text-white outline-none transition placeholder:text-gray-500 focus:border-gold/70"
              aria-label="Search fragrances"
            />
          </label>
          <button type="button" onClick={() => setShowFilters((visible) => !visible)} aria-expanded={showFilters} className="flex items-center justify-center gap-2 rounded-xl border border-gold/30 px-5 py-3 text-sm text-white transition hover:border-gold hover:text-gold">
            <SlidersHorizontal size={17} /> Filters
            {(selectedNotes.length + selectedIntensities.length + selectedOccasions.length + (selectedTypes.length < 2 ? 1 : 0)) > 0 && <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold text-black">{selectedNotes.length + selectedIntensities.length + selectedOccasions.length + (selectedTypes.length < 2 ? 1 : 0)}</span>}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
              <div className="grid gap-6 p-5 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-xs uppercase tracking-[0.2em] text-gold">Scent notes</h3>
                  <div className="flex flex-wrap gap-2">{notes.map((note) => <Chip key={note} label={note} active={selectedNotes.includes(note)} onClick={() => toggleItem(selectedNotes, note, setSelectedNotes, 'notes')} />)}</div>
                </div>
                <div>
                  <h3 className="mb-3 text-xs uppercase tracking-[0.2em] text-gold">Format</h3>
                  <div className="flex flex-wrap gap-2">{['spray', 'roll-on'].map((type) => <Chip key={type} label={type} active={selectedTypes.includes(type)} onClick={() => toggleItem(selectedTypes, type, setSelectedTypes, 'types')} />)}</div>
                </div>
                <div>
                  <h3 className="mb-3 text-xs uppercase tracking-[0.2em] text-gold">Intensity</h3>
                  <div className="flex flex-wrap gap-2">{['light', 'medium', 'strong'].map((level) => <Chip key={level} label={level} active={selectedIntensities.includes(level)} onClick={() => toggleItem(selectedIntensities, level, setSelectedIntensities, 'intensities')} />)}</div>
                </div>
                {occasions.length > 0 && <div>
                  <h3 className="mb-3 text-xs uppercase tracking-[0.2em] text-gold">Occasion</h3>
                  <div className="flex flex-wrap gap-2">{occasions.map((occasion) => <Chip key={occasion} label={occasion} active={selectedOccasions.includes(occasion)} onClick={() => toggleItem(selectedOccasions, occasion, setSelectedOccasions, 'occasions')} />)}</div>
                </div>}
              </div>
              <div className="flex justify-end border-t border-white/10 px-5 py-3">
                <button type="button" onClick={clearFilters} className="flex items-center gap-1 text-xs text-gray-400 transition hover:text-gold"><X size={14} /> Clear filters</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SearchSection;
