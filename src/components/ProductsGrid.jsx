import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, ShoppingCart, SlidersHorizontal, X, Sparkles, Eye, ChevronDown } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'spray', label: 'Spray' },
  { key: 'roll-on', label: 'Roll-on' },
  { key: 'bestsellers', label: 'Bestsellers' },
];

const INTENSITIES = [
  { value: 'all', label: 'Any intensity' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'strong', label: 'Strong' },
];

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price ↑' },
  { value: 'price-high', label: 'Price ↓' },
  { value: 'name', label: 'A → Z' },
];

const toList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  if (typeof value !== 'string') return [];
  return value.split(/[,|•]/).map((item) => item.trim()).filter(Boolean);
};

const getType = (product = {}) => {
  const raw = String(product.type || product.category || '').toLowerCase().replace(/[_\s]/g, '-');
  if (raw === 'rollon' || raw === 'roll-on' || raw === 'oil') return 'roll-on';
  return 'spray';
};

const normalizeProduct = (product) => {
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  const prices = sizes.map((size) => Number(size.sellingPrice)).filter((price) => Number.isFinite(price) && price > 0);
  const type = getType(product);
  return {
    ...product,
    id: product.id || product._id,
    category: product.category || (type === 'spray' ? 'perfume' : 'oil'),
    type,
    notes: toList(product.notes).flatMap((note) => note.split(/\s+/).filter(Boolean)),
    bestFor: toList(product.bestFor),
    basePrice: Number(product.basePrice ?? product.minPrice ?? (prices.length ? Math.min(...prices) : 0)),
    minPrice: Number(product.minPrice ?? (prices.length ? Math.min(...prices) : product.basePrice ?? 0)),
    maxPrice: Number(product.maxPrice ?? (prices.length ? Math.max(...prices) : product.basePrice ?? 0)),
    sizes,
  };
};

const getImageValue = (value) => {
  if (typeof value === 'string') return value.trim();
  if (value && typeof value === 'object') return value.url || value.secure_url || value.path || value.src || '';
  return '';
};

const resolveProductImage = (product) => {
  const sizeImage = product.sizes?.map((size) => getImageValue(size.image)).find(Boolean);
  const rawImage = getImageValue(product.mainImage)
    || getImageValue(product.imageUrl)
    || getImageValue(product.image)
    || (Array.isArray(product.images) ? getImageValue(product.images[0]) : getImageValue(product.images))
    || sizeImage;
  if (!rawImage) return '';
  if (/^(https?:|data:|blob:)/i.test(rawImage)) return rawImage;
  const apiBase = (import.meta.env.VITE_API_URL || 'https://perfume-stock-management-system.onrender.com').replace(/\/$/, '');
  return `${apiBase}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;
};

const makeBottleFallback = (isRollOn) => {
  const bottle = isRollOn
    ? '<rect x="87" y="100" width="66" height="132" rx="18" fill="url(#glass)" stroke="#e9d9a6" stroke-opacity=".7"/><rect x="104" y="73" width="32" height="32" rx="5" fill="url(#cap)"/>'
    : '<rect x="76" y="74" width="88" height="158" rx="18" fill="url(#glass)" stroke="#e9d9a6" stroke-opacity=".7"/><rect x="99" y="43" width="42" height="35" rx="5" fill="url(#cap)"/><rect x="111" y="33" width="18" height="13" rx="3" fill="#dac28b"/>';
  const label = isRollOn ? 'ROLL-ON' : 'EAU DE PARFUM';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="300" viewBox="0 0 240 300"><defs><radialGradient id="bg"><stop stop-color="#332711"/><stop offset="1" stop-color="#090909"/></radialGradient><linearGradient id="glass" x1="0" x2="1"><stop stop-color="#c9a64d" stop-opacity=".6"/><stop offset=".45" stop-color="#f5e6bb" stop-opacity=".14"/><stop offset="1" stop-color="#9d7623" stop-opacity=".5"/></linearGradient><linearGradient id="cap" x1="0" x2="1"><stop stop-color="#eee0b8"/><stop offset="1" stop-color="#8e6c2c"/></linearGradient></defs><rect width="240" height="300" rx="22" fill="url(#bg)"/><circle cx="120" cy="150" r="94" fill="#d4af37" opacity=".07"/>${bottle}<rect x="84" y="150" width="72" height="43" rx="3" fill="#111" fill-opacity=".8" stroke="#d4af37" stroke-opacity=".55"/><text x="120" y="169" text-anchor="middle" fill="#e4c66d" font-family="Georgia,serif" font-size="12" letter-spacing="3">LUXE</text><text x="120" y="183" text-anchor="middle" fill="#eee" font-family="Arial,sans-serif" font-size="6" letter-spacing="1.3">${label}</text><text x="120" y="270" text-anchor="middle" fill="#cbb878" font-family="Arial,sans-serif" font-size="9" letter-spacing="3">FRAGRANCE</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

// --------------------------------------------------
// Skeleton card
// --------------------------------------------------
const SkeletonCard = () => (
  <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
    <div className="flex h-64 items-center justify-center bg-white/[0.015]">
      <div className="h-28 w-20 animate-pulse rounded-lg bg-white/[0.04]" />
    </div>
    <div className="space-y-3 p-5">
      <div className="flex justify-between">
        <div className="h-2.5 w-20 animate-pulse rounded bg-white/[0.05]" />
        <div className="h-2.5 w-12 animate-pulse rounded bg-white/[0.05]" />
      </div>
      <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.06]" />
      <div className="h-3 w-full animate-pulse rounded bg-white/[0.04]" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-white/[0.04]" />
      <div className="flex items-end justify-between border-t border-white/[0.06] pt-4">
        <div className="h-6 w-24 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-9 w-28 animate-pulse rounded-full bg-white/[0.05]" />
      </div>
    </div>
  </div>
);

// --------------------------------------------------
// Product card
// --------------------------------------------------
const ProductCard = React.memo(({ product, isWishlisted, onToggleWishlist, onOpen, onQuickAdd }) => {
  const isRollOn = product.type === 'roll-on';
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = resolveProductImage(product);

  if (!imageUrl && !imageFailed && typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.warn('[ProductImage] Missing image for', product.name, product.id || product._id);
  }

  const displayedImage = !imageFailed && imageUrl ? imageUrl : makeBottleFallback(isRollOn);
  const availableSizes = product.sizes.filter((size) => Number(size.sellingPrice) > 0);
  const hasRange = product.minPrice && product.maxPrice && product.minPrice !== product.maxPrice;
  const priceLabel = hasRange
    ? `৳${product.minPrice.toLocaleString()} – ৳${product.maxPrice.toLocaleString()}`
    : `৳${(product.minPrice || product.basePrice || 0).toLocaleString()}`;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-white/[0.015] transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/35 hover:shadow-[0_24px_70px_-20px_rgba(212,175,55,0.35)]"
    >
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 h-48 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.18), transparent 65%)' }}
      />

      <div
        className="relative flex h-64 cursor-pointer items-center justify-center overflow-hidden"
        onClick={() => onOpen(product)}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.10),transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-gold/[0.05]" />

        <img
          src={displayedImage}
          alt={`${product.name} ${isRollOn ? 'roll-on' : 'spray'} fragrance`}
          className="relative z-10 h-full w-full object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />

        <div className="pointer-events-none absolute inset-0 z-[15] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.28))]" />

        <span className="absolute left-4 top-4 z-20 rounded-full border border-gold/20 bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gold/90 backdrop-blur-md">
          {isRollOn ? 'Roll-on' : 'Spray'}
        </span>

        {product.isBestseller && (
          <span className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold to-yellow-400 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-black shadow-[0_4px_16px_rgba(212,175,55,0.35)]">
            <Sparkles size={11} strokeWidth={2.5} />
            Bestseller
          </span>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-110 ${
            isWishlisted
              ? 'border-rose-400/30 bg-rose-500/15 text-rose-400 shadow-[0_4px_20px_rgba(244,63,94,0.25)]'
              : 'border-white/15 bg-black/55 text-white hover:border-rose-300/40 hover:text-rose-300'
          }`}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
        >
          <Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen(product);
          }}
          className="absolute bottom-4 left-1/2 z-20 grid h-11 w-11 -translate-x-1/2 translate-y-3 place-items-center rounded-full bg-white/95 text-black opacity-0 shadow-[0_10px_28px_-8px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110 hover:bg-white focus:translate-y-0 focus:opacity-100"
          aria-label={`View ${product.name}`}
        >
          <Eye size={18} strokeWidth={2.25} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2.5 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.17em] text-gray-500">
          <span className="text-gold/70">{product.intensity || 'Signature'} intensity</span>
          <span className="text-gray-500">
            {product.sizes.length} size{product.sizes.length === 1 ? '' : 's'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpen(product)}
          className="line-clamp-1 text-left font-display text-lg tracking-wide text-white transition-colors duration-300 hover:text-gold"
        >
          {product.name}
        </button>

        <p className="mt-1.5 line-clamp-2 min-h-10 text-sm leading-5 text-gray-400/90">
          {product.description || 'A carefully selected fragrance for your everyday signature.'}
        </p>

        {!!product.notes.length && (
          <div className="mt-3 flex min-h-6 flex-wrap gap-1.5">
            {product.notes.slice(0, 3).map((note) => (
              <span
                key={note}
                className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[10px] capitalize tracking-wide text-gray-300/90"
              >
                {note}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/[0.06] pt-4">
          <div className="min-w-0">
            <span className="block text-[10px] uppercase tracking-[0.2em] text-gray-500">Price</span>
            <span className="mt-1 block truncate text-lg font-medium tracking-tight text-gold">
              {priceLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onQuickAdd(product);
            }}
            disabled={!availableSizes.length || product.isStockOut}
            className="group/btn flex flex-shrink-0 items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-black transition-all duration-300 hover:bg-yellow-300 hover:shadow-[0_6px_20px_rgba(212,175,55,0.4)] disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500 disabled:shadow-none"
            aria-label={`Add ${product.name} in the smallest size to cart`}
          >
            <ShoppingCart
              size={14}
              className="transition-transform duration-300 group-hover/btn:-translate-y-0.5"
              strokeWidth={2.5}
            />
            {availableSizes.length ? 'Quick add' : 'Unavailable'}
          </button>
        </div>
      </div>
    </motion.article>
  );
});

ProductCard.displayName = 'ProductCard';

// --------------------------------------------------
// Filter bar (redesigned)
// --------------------------------------------------
const FilterBar = ({
  query, setQuery,
  intensity, setIntensity,
  sortBy, setSortBy,
  activeFilter, setActiveFilter,
  activeFilterCount, hasActiveFilters, clearAll,
  resultCount,
  onResetVisibleCount,
}) => {
  const handleQuery = (value) => { setQuery(value); onResetVisibleCount(); };
  const handleIntensity = (value) => { setIntensity(value); onResetVisibleCount(); };
  const handleFilter = (key) => { setActiveFilter(key); onResetVisibleCount(); };

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
      {/* Ambient inner glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.07),transparent_75%)]" />

      <div className="relative">
        {/* Top row — search + dropdowns */}
        <div className="p-3 md:p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search */}
            <label className="relative block flex-1">
              <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={query}
                onChange={(event) => handleQuery(event.target.value)}
                placeholder="Search name, scent notes, or occasion…"
                className="w-full rounded-xl border border-white/[0.08] bg-black/40 py-3 pl-11 pr-10 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-gold/60 focus:bg-black/60 focus:ring-2 focus:ring-gold/15"
                aria-label="Search fragrances"
              />
              <AnimatePresence>
                {query && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => handleQuery('')}
                    className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-gray-500 transition hover:bg-white/5 hover:text-gray-200"
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </motion.button>
                )}
              </AnimatePresence>
            </label>

            {/* Intensity */}
            <div className="relative">
              <select
                value={intensity}
                onChange={(event) => handleIntensity(event.target.value)}
                className="peer w-full cursor-pointer appearance-none rounded-xl border border-white/[0.08] bg-black/40 py-3 pl-10 pr-10 text-sm text-white outline-none transition hover:border-gold/40 focus:border-gold/60 focus:ring-2 focus:ring-gold/15 lg:w-44 [&>option]:bg-[#0e0d0b]"
                aria-label="Filter by intensity"
              >
                {INTENSITIES.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <SlidersHorizontal size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/60" />
              <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-transform peer-focus:rotate-180" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="peer w-full cursor-pointer appearance-none rounded-xl border border-white/[0.08] bg-black/40 py-3 pl-4 pr-10 text-sm text-white outline-none transition hover:border-gold/40 focus:border-gold/60 focus:ring-2 focus:ring-gold/15 lg:w-40 [&>option]:bg-[#0e0d0b]"
                aria-label="Sort fragrances"
              >
                {SORTS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-transform peer-focus:rotate-180" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-3 h-px bg-white/[0.06] md:mx-4" />

        {/* Bottom row — segmented type chips + clear all */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 md:p-4">
          <div
            className="relative inline-flex flex-wrap gap-0.5 rounded-full border border-white/[0.08] bg-black/40 p-1"
            role="group"
            aria-label="Filter fragrance type"
          >
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => handleFilter(filter.key)}
                  aria-pressed={isActive}
                  className="relative rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 sm:px-4"
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-gold to-yellow-400 shadow-[0_4px_14px_-4px_rgba(212,175,55,0.6)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? 'text-black font-semibold' : 'text-gray-300 hover:text-gold'}`}>
                    {filter.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-xs text-gray-400">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              <span className="text-white">{resultCount}</span>
              fragrance{resultCount === 1 ? '' : 's'}
            </span>

            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={clearAll}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-gray-400 transition hover:border-rose-400/40 hover:bg-rose-500/5 hover:text-rose-300"
                >
                  <X size={12} />
                  Clear ({activeFilterCount})
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------
// Main grid
// --------------------------------------------------
const ProductsGrid = ({ products = [], loading = false, wishlist = [], toggleWishlist, openProductModal }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [intensity, setIntensity] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(16);
  const { addToCart } = useCart();

  const activeProducts = useMemo(() => products
    .filter((product) => product && product.isActive !== false)
    .map(normalizeProduct), [products]);

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();
    const result = activeProducts.filter((product) => {
      const matchesType = activeFilter === 'all'
        || (activeFilter === 'bestsellers' ? product.isBestseller : product.type === activeFilter);
      const matchesIntensity = intensity === 'all' || String(product.intensity || '').toLowerCase() === intensity;
      const haystack = [product.name, product.sku, product.description, product.notes.join(' '), product.bestFor.join(' '), product.type].join(' ').toLowerCase();
      return matchesType && matchesIntensity && (!search || haystack.includes(search));
    });

    if (sortBy === 'price-low') result.sort((a, b) => a.minPrice - b.minPrice);
    if (sortBy === 'price-high') result.sort((a, b) => b.minPrice - a.minPrice);
    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'featured') result.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller) || a.name.localeCompare(b.name));
    return result;
  }, [activeProducts, activeFilter, intensity, query, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const wishlistIds = useMemo(() => new Set(wishlist), [wishlist]);

  const hasActiveFilters = query !== '' || intensity !== 'all' || activeFilter !== 'all';
  const activeFilterCount = [
    query !== '',
    intensity !== 'all',
    activeFilter !== 'all',
  ].filter(Boolean).length;

  const clearAll = () => {
    setQuery('');
    setIntensity('all');
    setActiveFilter('all');
    setVisibleCount(16);
  };

  const quickAdd = (product) => {
    if (product.isStockOut) return;
    const smallestSize = [...product.sizes]
      .filter((size) => Number(size.sellingPrice) > 0)
      .sort((a, b) => Number(a.sizeMl) - Number(b.sizeMl))[0];
    if (smallestSize) addToCart(product, smallestSize, 1);
  };

  const openProduct = (product) => openProductModal?.(product);

  // --------------------------------------------------
  // Loading skeleton
  // --------------------------------------------------
  if (loading) return (
    <section id="shop" className="relative overflow-hidden bg-[#080807] px-4 py-20 lg:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08),transparent_70%)]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold/70">Find your signature</p>
          <h2 className="font-display text-4xl font-light tracking-wide text-white md:text-5xl">The Fragrance Collection</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </section>
  );

  // --------------------------------------------------
  // Loaded view
  // --------------------------------------------------
  return (
    <section id="shop" className="relative overflow-hidden bg-[#080807] px-4 py-20 lg:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.10),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold/80">Find your signature</p>
          <h2 className="font-display text-4xl font-light tracking-wide text-white md:text-5xl">
            The Fragrance Collection
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          <p className="mt-5 text-sm leading-6 text-gray-400">
            Explore roll-ons and sprays by scent, intensity, and price.
          </p>
        </div>

        {/* Filter bar */}
        <FilterBar
          query={query}
          setQuery={setQuery}
          intensity={intensity}
          setIntensity={setIntensity}
          sortBy={sortBy}
          setSortBy={setSortBy}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          activeFilterCount={activeFilterCount}
          hasActiveFilters={hasActiveFilters}
          clearAll={clearAll}
          resultCount={filteredProducts.length}
          onResetVisibleCount={() => setVisibleCount(16)}
        />

        {/* Grid */}
        {visibleProducts.length ? (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.has(product.id)}
                  onToggleWishlist={toggleWishlist || (() => {})}
                  onOpen={openProduct}
                  onQuickAdd={quickAdd}
                />
              ))}
            </motion.div>

            {visibleCount < filteredProducts.length && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + 16)}
                  className="group relative overflow-hidden rounded-full border border-gold/40 px-8 py-3 text-sm tracking-wide text-gold transition-all duration-300 hover:border-gold hover:bg-gold hover:text-black hover:shadow-[0_8px_28px_rgba(212,175,55,0.35)]"
                >
                  <span className="relative z-10">
                    Show more fragrances
                    <span className="ml-2 text-xs opacity-70">
                      ({filteredProducts.length - visibleCount} left)
                    </span>
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.035] to-white/[0.01] px-6 py-20 text-center">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.10),transparent_70%)]" />
            <div className="relative">
              <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-gold/25 bg-gold/5">
                <Search size={24} className="text-gold/70" />
              </div>
              <p className="mb-2 font-display text-2xl tracking-wide text-white">
                No fragrances match those filters
              </p>
              <p className="mx-auto mb-6 max-w-sm text-sm text-gray-400">
                Try adjusting your search or clearing filters to see the full collection.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="rounded-full border border-gold/50 px-6 py-2.5 text-sm text-gold transition hover:bg-gold hover:text-black"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsGrid;