import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, ShoppingCart, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const FILTERS = [
  { key: 'all', label: 'All fragrances' },
  { key: 'spray', label: 'Spray' },
  { key: 'roll-on', label: 'Roll-on' },
  { key: 'bestsellers', label: 'Bestsellers' },
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

const ProductCard = React.memo(({ product, isWishlisted, onToggleWishlist, onOpen, onQuickAdd }) => {
  const isRollOn = product.type === 'roll-on';
  const availableSizes = product.sizes.filter((size) => Number(size.sellingPrice) > 0);
  const priceLabel = product.minPrice && product.maxPrice && product.minPrice !== product.maxPrice
    ? `৳${product.minPrice.toLocaleString()} – ৳${product.maxPrice.toLocaleString()}`
    : `৳${(product.minPrice || product.basePrice || 0).toLocaleString()}`;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-2xl border border-gold/15 bg-gradient-to-b from-white/[0.07] to-white/[0.02] transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_18px_55px_rgba(212,175,55,0.12)]"
    >
      <div className="relative flex h-64 cursor-pointer items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.14),transparent_66%)]" onClick={() => onOpen(product)}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-gold/[0.06]" />
        <div className={`relative flex items-center justify-center border border-white/30 bg-gradient-to-br from-white/25 to-white/[0.04] shadow-[0_18px_45px_rgba(0,0,0,0.45)] transition duration-500 group-hover:scale-105 ${isRollOn ? 'h-36 w-20 rounded-[1.1rem]' : 'h-44 w-24 rounded-t-[1.3rem] rounded-b-2xl'}`}>
          <div className="absolute -top-5 h-7 w-9 rounded-t-md border border-white/20 bg-gradient-to-b from-gray-300 to-gray-600" />
          <div className="absolute inset-x-2 top-1/3 h-px bg-white/25" />
          <div className="absolute inset-x-2 bottom-5 border-y border-gold/30 py-2 text-center">
            <span className="block text-[9px] font-semibold tracking-[0.24em] text-gold">LUXE</span>
            <span className="mt-1 block text-[7px] uppercase tracking-widest text-white/60">{isRollOn ? 'OIL' : 'PARFUM'}</span>
          </div>
          <span className="absolute bottom-1 right-2 text-white/50"><Sparkles size={12} /></span>
        </div>

        <span className="absolute left-4 top-4 rounded-full border border-gold/25 bg-black/55 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gold backdrop-blur">
          {isRollOn ? 'Roll-on' : 'Spray'}
        </span>
        {product.isBestseller && <span className="absolute bottom-4 left-4 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-black">Bestseller</span>}

        <button
          type="button"
          onClick={(event) => { event.stopPropagation(); onToggleWishlist(product.id); }}
          className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/55 backdrop-blur transition hover:scale-105 ${isWishlisted ? 'text-rose-400' : 'text-white hover:text-rose-300'}`}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        <button type="button" onClick={(event) => { event.stopPropagation(); onOpen(product); }} className="absolute inset-x-5 bottom-4 translate-y-3 rounded-full bg-white/95 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-black opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100">
          View fragrance
        </button>
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.17em] text-gray-400">
          <span>{product.intensity || 'Signature'} intensity</span>
          <span>{product.sizes.length} size{product.sizes.length === 1 ? '' : 's'}</span>
        </div>
        <button type="button" onClick={() => onOpen(product)} className="line-clamp-1 text-left font-display text-lg text-white transition hover:text-gold">{product.name}</button>
        <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-gray-400">{product.description || 'A carefully selected fragrance for your everyday signature.'}</p>

        {!!product.notes.length && <div className="mt-3 flex min-h-6 flex-wrap gap-1.5">{product.notes.slice(0, 3).map((note) => <span key={note} className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] capitalize text-gray-300">{note}</span>)}</div>}

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
          <div>
            <span className="block text-[10px] uppercase tracking-widest text-gray-500">Price</span>
            <span className="mt-1 block text-lg font-medium text-gold">{priceLabel}</span>
          </div>
          <button
            type="button"
            onClick={(event) => { event.stopPropagation(); onQuickAdd(product); }}
            disabled={!availableSizes.length || product.isStockOut}
            className="flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
            aria-label={`Add ${product.name} in the smallest size to cart`}
          >
            <ShoppingCart size={15} />
            {availableSizes.length ? 'Quick add' : 'Unavailable'}
          </button>
        </div>
      </div>
    </motion.article>
  );
});
ProductCard.displayName = 'ProductCard';

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

  const quickAdd = (product) => {
    if (product.isStockOut) return;
    const smallestSize = [...product.sizes]
      .filter((size) => Number(size.sellingPrice) > 0)
      .sort((a, b) => Number(a.sizeMl) - Number(b.sizeMl))[0];
    if (smallestSize) addToCart(product, smallestSize, 1);
  };

  const openProduct = (product) => openProductModal?.(product);

  if (loading) return (
    <section id="shop" className="flex min-h-[420px] items-center justify-center bg-black px-4 py-20">
      <div className="text-center"><div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-gold border-t-transparent" /><p className="text-gray-400">Loading the LUXE collection…</p></div>
    </section>
  );

  return (
    <section id="shop" className="relative overflow-hidden bg-[#080807] px-4 py-20 lg:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.10),transparent_70%)]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold">Find your signature</p>
          <h2 className="font-display text-4xl font-light tracking-wide text-white md:text-5xl">The Fragrance Collection</h2>
          <p className="mt-4 text-sm leading-6 text-gray-400">Explore roll-ons and sprays by scent, intensity, and price.</p>
        </div>

        <div className="mb-8 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 md:grid-cols-[1fr_auto_auto] md:p-4">
          <label className="relative block">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(16); }} placeholder="Search name, scent notes, or occasion" className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-gold/60" aria-label="Search fragrances" />
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 text-gray-400">
            <SlidersHorizontal size={15} />
            <select value={intensity} onChange={(event) => { setIntensity(event.target.value); setVisibleCount(16); }} className="w-full bg-transparent py-3 text-sm text-white outline-none" aria-label="Filter by intensity">
              <option value="all">All intensity</option><option value="light">Light</option><option value="medium">Medium</option><option value="strong">Strong</option>
            </select>
          </label>
          <label className="rounded-xl border border-white/10 bg-black/40 px-3 text-gray-400">
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="w-full bg-transparent py-3 text-sm text-white outline-none" aria-label="Sort fragrances">
              <option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option>
            </select>
          </label>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter fragrance type">
            {FILTERS.map((filter) => (
              <button key={filter.key} type="button" onClick={() => { setActiveFilter(filter.key); setVisibleCount(16); }} aria-pressed={activeFilter === filter.key} className={`rounded-full border px-4 py-2 text-xs uppercase tracking-wider transition ${activeFilter === filter.key ? 'border-gold bg-gold text-black' : 'border-white/15 text-gray-300 hover:border-gold/60 hover:text-gold'}`}>
                {filter.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-400">{filteredProducts.length} fragrance{filteredProducts.length === 1 ? '' : 's'}</p>
        </div>

        {visibleProducts.length ? (
          <>
            <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} isWishlisted={wishlistIds.has(product.id)} onToggleWishlist={toggleWishlist || (() => {})} onOpen={openProduct} onQuickAdd={quickAdd} />
              ))}
            </motion.div>
            {visibleCount < filteredProducts.length && <div className="mt-10 text-center"><button type="button" onClick={() => setVisibleCount((count) => count + 16)} className="rounded-full border border-gold/50 px-7 py-3 text-sm text-gold transition hover:bg-gold hover:text-black">Show more fragrances</button></div>}
          </>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <p className="mb-3 text-3xl">✨</p><p className="text-lg text-white">No fragrances match those filters.</p>
            <button type="button" onClick={() => { setQuery(''); setIntensity('all'); setActiveFilter('all'); }} className="mt-4 text-sm text-gold underline underline-offset-4">Clear filters</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsGrid;
