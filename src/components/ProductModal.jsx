import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import {
  X, Plus, Minus, ShoppingCart, Star, Award,
  Sparkles, Droplets, Shield, Truck,
} from 'lucide-react';
import API from '../api/axios';

const toList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  if (typeof value !== 'string') return [];
  return value.split(/[,|•]/).map((item) => item.trim()).filter(Boolean);
};

const normalizeImageUrl = (url) => {
  if (!url) return null;
  if (typeof url === 'object') url = url.url || url.secure_url || url.path || url.src;
  if (typeof url !== 'string' || !url.trim()) return null;
  url = url.trim();
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'https://perfume-stock-management-system.onrender.com';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

const makeBottleFallback = (isRollOn) => {
  const body = isRollOn
    ? '<rect x="87" y="100" width="66" height="132" rx="18" fill="url(#glass)" stroke="#e9d9a6" stroke-opacity=".7"/><rect x="104" y="73" width="32" height="32" rx="5" fill="url(#cap)"/>'
    : '<rect x="76" y="74" width="88" height="158" rx="18" fill="url(#glass)" stroke="#e9d9a6" stroke-opacity=".7"/><rect x="99" y="43" width="42" height="35" rx="5" fill="url(#cap)"/><rect x="111" y="33" width="18" height="13" rx="3" fill="#dac28b"/>';
  const kind = isRollOn ? 'ROLL-ON' : 'EAU DE PARFUM';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="300" viewBox="0 0 240 300"><defs><radialGradient id="bg"><stop stop-color="#332711"/><stop offset="1" stop-color="#090909"/></radialGradient><linearGradient id="glass" x1="0" x2="1"><stop stop-color="#c9a64d" stop-opacity=".6"/><stop offset=".45" stop-color="#f5e6bb" stop-opacity=".14"/><stop offset="1" stop-color="#9d7623" stop-opacity=".5"/></linearGradient><linearGradient id="cap" x1="0" x2="1"><stop stop-color="#eee0b8"/><stop offset="1" stop-color="#8e6c2c"/></linearGradient></defs><rect width="240" height="300" rx="22" fill="url(#bg)"/><circle cx="120" cy="150" r="94" fill="#d4af37" opacity=".07"/>${body}<rect x="84" y="150" width="72" height="43" rx="3" fill="#111" fill-opacity=".8" stroke="#d4af37" stroke-opacity=".55"/><text x="120" y="169" text-anchor="middle" fill="#e4c66d" font-family="Georgia,serif" font-size="12" letter-spacing="3">LUXE</text><text x="120" y="183" text-anchor="middle" fill="#eee" font-family="Arial,sans-serif" font-size="6" letter-spacing="1.3">${kind}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const TABS = [
  { key: 'details', label: 'Details' },
  { key: 'notes', label: 'Scent' },
  { key: 'usage', label: 'How to use' },
];

const ProductModal = React.memo(({ product: initialProduct, onClose }) => {
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [currentImage, setCurrentImage] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const { addToCart } = useCart();

  const transformProduct = useCallback((backendProduct) => {
    const isSpray = backendProduct.type === 'spray';
    const category = isSpray ? 'perfume' : 'oil';
    const validSizes = (backendProduct.sizes || []).filter((s) => s.sizeMl !== 3);
    let basePrice = 0;
    if (validSizes.length > 0) {
      const prices = validSizes.map((s) => s.sellingPrice || 0);
      basePrice = Math.min(...prices);
    }
    const notes = toList(backendProduct.notes).flatMap((note) => note.split(/\s+/).filter(Boolean));
    if (notes.length === 0) notes.push('Premium');
    const isNew =
      backendProduct.createdAt &&
      new Date() - new Date(backendProduct.createdAt) < 30 * 24 * 60 * 60 * 1000;
    return {
      id: backendProduct._id,
      name: backendProduct.name,
      category,
      description: backendProduct.description || `${backendProduct.name} – ${backendProduct.sku}`,
      basePrice,
      notes,
      intensity: backendProduct.intensity || (isSpray ? 'medium' : 'strong'),
      bestFor: toList(backendProduct.bestFor).length ? toList(backendProduct.bestFor) : ['all'],
      isNew,
      isBestseller: backendProduct.isBestseller || false,
      isStockOut: backendProduct.isStockOut || false,
      images: [
        backendProduct.mainImage,
        backendProduct.imageUrl,
        backendProduct.image,
        ...(Array.isArray(backendProduct.images) ? backendProduct.images : [backendProduct.images]),
      ].filter(Boolean),
      backendData: backendProduct,
      sizes: validSizes,
    };
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/products/${initialProduct.id}`);
        const fresh = transformProduct(
          response.data?.product || response.data?.data || response.data
        );
        setProduct(fresh);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        setProduct(initialProduct);
      } finally {
        setLoading(false);
      }
    };
    if (initialProduct?.id) fetchProduct();
  }, [initialProduct, transformProduct]);

  const sortedSizes = useMemo(() => {
    const sizes = product.backendData?.sizes || [];
    return [...sizes].filter((s) => s.sizeMl !== 3).sort((a, b) => a.sizeMl - b.sizeMl);
  }, [product.backendData?.sizes]);

  const formatSizeLabel = useCallback(
    (size) => `${size.sizeMl}ml ${size.bottle?.type || size.bottleType || ''}`.trim(),
    []
  );

  const getIntensityIcon = useCallback((intensity) => {
    switch (intensity) {
      case 'light': return '🕯️';
      case 'medium': return '💫';
      case 'strong': return '🔥';
      default: return '✨';
    }
  }, []);

  const getScentNotes = useCallback(
    () => product.notes?.map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join(' • ') || 'Premium Blend',
    [product.notes]
  );

  useEffect(() => {
    if (sortedSizes.length > 0 && !selectedSize) setSelectedSize(sortedSizes[0]);
    if (selectedSize && !sortedSizes.some((s) => s._id === selectedSize._id)) {
      setSelectedSize(sortedSizes[0] || null);
    }
  }, [sortedSizes, selectedSize]);

  useEffect(() => {
    let imageUrl = null;
    if (selectedSize && selectedSize.image) imageUrl = normalizeImageUrl(selectedSize.image);
    else if (product.images && product.images.length > 0) imageUrl = normalizeImageUrl(product.images[0]);
    setCurrentImage(imageUrl);
    setImgError(false);
    setImgLoading(!!imageUrl);
  }, [selectedSize, product.images]);

  const fallbackImage = makeBottleFallback(product.category === 'oil');
  const displayedImage = !imgError && currentImage ? currentImage : fallbackImage;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const addToCartFromModal = useCallback(async () => {
    if (selectedSize && !product.isStockOut) {
      setIsAddingToCart(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      addToCart(product, selectedSize, quantity);
      setIsAddingToCart(false);
      onClose();
    }
  }, [selectedSize, addToCart, product, quantity, onClose]);

  const changeQuantity = useCallback(
    (delta) => setQuantity((prev) => Math.max(1, Math.min(10, prev + delta))),
    []
  );

  const subtotal = selectedSize ? Number(selectedSize.sellingPrice || 0) * quantity : 0;

  // --------------------------------------------------
  // Loading skeleton
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="text-gray-400">Loading product details…</p>
        </div>
      </div>
    );
  }

  const CategoryIcon = product.category === 'oil' ? Droplets : Sparkles;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/75 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Dialog */}
        <motion.div
          className="relative w-full max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[92vh] overflow-hidden rounded-3xl"
          initial={{ scale: 0.94, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.94, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 240 }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-b from-[#0f0e0c] via-[#0a0908] to-[#080807] shadow-[0_40px_100px_-20px_rgba(212,175,55,0.25)]">
            {/* Ambient top glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.14),transparent_70%)]" />

            {/* Stock-out banner */}
            {product.isStockOut && (
              <div className="relative z-10 border-b border-red-500/30 bg-red-500/10 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-red-300">
                Currently out of stock
              </div>
            )}

            {/* ----------------------------------------- */}
            {/* Header                                    */}
            {/* ----------------------------------------- */}
            <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-5 sm:px-7 sm:py-6">
              <div className="flex min-w-0 items-center gap-4">
                <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/[0.06] text-gold">
                  <CategoryIcon size={22} strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-xl font-light tracking-wide text-white sm:text-2xl">
                    {product.name}
                  </h2>
                  <p className="mt-1 truncate text-[11px] uppercase tracking-[0.22em] text-gold/70">
                    {product.category} <span className="mx-1 text-white/20">•</span>
                    <span className="text-gray-400">
                      {getIntensityIcon(product.intensity)} {product.intensity} intensity
                    </span>
                  </p>
                </div>
              </div>

              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.08, rotate: 90 }}
                whileTap={{ scale: 0.92 }}
                className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full border border-white/10 text-gray-300 transition-colors duration-300 hover:border-gold/50 hover:bg-gold hover:text-black"
                aria-label="Close"
              >
                <X size={17} strokeWidth={2.25} />
              </motion.button>
            </div>

            {/* ----------------------------------------- */}
            {/* Body                                      */}
            {/* ----------------------------------------- */}
            <div className="relative z-10 grid max-h-[calc(92vh-96px)] grid-cols-1 gap-6 overflow-y-auto px-5 py-6 sm:px-7 sm:py-7 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
              {/* ================================= */}
              {/* LEFT — image + tabs                */}
              {/* ================================= */}
              <div className="space-y-5">
                {/* Image stage */}
                <motion.div
                  className={`group relative flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.07] sm:h-80 ${
                    product.isStockOut ? 'bg-black/40 grayscale' : 'bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12),transparent_65%)]'
                  }`}
                  whileHover={{ scale: product.isStockOut ? 1 : 1.01 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* subtle gradient sheen */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-gold/[0.05]" />

                  <img
                    src={displayedImage}
                    alt={`${product.name} ${product.category === 'oil' ? 'roll-on' : 'spray'} bottle`}
                    className={`relative z-10 h-full w-full object-contain p-6 transition-all duration-700 ease-out group-hover:scale-[1.05] ${
                      imgLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={() => setImgLoading(false)}
                    onError={() => {
                      setImgError(true);
                      setImgLoading(false);
                    }}
                  />

                  {imgLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                    </div>
                  )}

                  {/* Badges */}
                  {product.isBestseller && (
                    <motion.div
                      className="absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold to-yellow-400 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-black shadow-[0_4px_16px_rgba(212,175,55,0.4)]"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.25, type: 'spring', stiffness: 300 }}
                    >
                      <Award size={11} strokeWidth={2.5} />
                      <span>Bestseller</span>
                    </motion.div>
                  )}

                  {product.isNew && (
                    <motion.div
                      className="absolute right-4 top-4 z-20 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-300 backdrop-blur-md"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.35, type: 'spring', stiffness: 300 }}
                    >
                      New arrival
                    </motion.div>
                  )}
                </motion.div>

                {/* Tabs */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1.5">
                  <div className="grid grid-cols-3 gap-1">
                    {TABS.map((tab) => {
                      const isActive = activeTab === tab.key;
                      return (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`rounded-xl px-3 py-2 text-xs font-medium tracking-wide transition-all duration-300 ${
                            isActive
                              ? 'bg-gold text-black shadow-[0_4px_16px_rgba(212,175,55,0.25)]'
                              : 'text-gray-400 hover:bg-white/[0.03] hover:text-white'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-3 py-4 sm:px-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="min-h-[88px] text-sm leading-6 text-gray-300"
                      >
                        {activeTab === 'details' && (
                          <div className="space-y-3">
                            <p className="text-gray-300/90">{product.description}</p>
                            <div className="flex items-center gap-2 pt-1 text-xs text-gold/80">
                              <Star size={13} fill="currentColor" />
                              <span className="tracking-wide">
                                Best for: {product.bestFor?.join(' • ')}
                              </span>
                            </div>
                          </div>
                        )}
                        {activeTab === 'notes' && (
                          <div className="space-y-2">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-gold/70">
                              Scent profile
                            </p>
                            <p className="text-gray-300/90">{getScentNotes()}</p>
                          </div>
                        )}
                        {activeTab === 'usage' && (
                          <ul className="space-y-1.5 text-gray-300/90">
                            <li className="flex gap-2"><span className="text-gold/70">•</span> Apply to pulse points for lasting fragrance</li>
                            <li className="flex gap-2"><span className="text-gold/70">•</span> Store in a cool, dry place away from sunlight</li>
                            <li className="flex gap-2"><span className="text-gold/70">•</span> Expect 6–8 hours of wear</li>
                          </ul>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* ================================= */}
              {/* RIGHT — selectors + CTA            */}
              {/* ================================= */}
              <div className="space-y-6">
                {/* Size selector */}
                <div>
                  <div className="mb-3 flex items-baseline justify-between">
                    <label className="font-display text-sm tracking-wide text-white">
                      Select your size
                    </label>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                      {sortedSizes.length} option{sortedSizes.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {sortedSizes.map((size) => {
                      const isSelected = selectedSize?._id === size._id;
                      return (
                        <motion.button
                          key={size._id || size.sizeMl}
                          onClick={() => setSelectedSize(size)}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative rounded-xl border p-3 text-left transition-all duration-300 ${
                            isSelected
                              ? 'border-gold bg-gold/[0.08] shadow-[0_8px_24px_-8px_rgba(212,175,55,0.5),inset_0_0_24px_rgba(212,175,55,0.08)]'
                              : 'border-white/[0.07] bg-white/[0.02] hover:border-gold/40 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className={`text-sm font-medium tracking-wide ${isSelected ? 'text-gold' : 'text-white'}`}>
                            {formatSizeLabel(size)}
                          </div>
                          <div className="mt-0.5 text-[11px] text-gray-500">
                            {size.sizeMl}ml
                          </div>
                          <div className={`mt-2 text-base font-medium tracking-tight ${isSelected ? 'text-gold' : 'text-gray-200'}`}>
                            ৳{Number(size.sellingPrice || 0).toLocaleString()}
                          </div>

                          {isSelected && (
                            <motion.div
                              layoutId="size-select-ring"
                              className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gold/40"
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {sortedSizes.length === 0 && (
                    <p className="text-sm text-gray-500">No sizes available for this fragrance.</p>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label className="mb-3 block font-display text-sm tracking-wide text-white">
                    Quantity
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
                    <motion.button
                      onClick={() => changeQuantity(-1)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      disabled={quantity <= 1 || product.isStockOut}
                      className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-black disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:bg-transparent disabled:hover:text-white"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={15} strokeWidth={2.5} />
                    </motion.button>

                    <motion.span
                      key={quantity}
                      initial={{ scale: 1.15, opacity: 0.6 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="min-w-[48px] text-center text-xl font-light text-white"
                    >
                      {quantity}
                    </motion.span>

                    <motion.button
                      onClick={() => changeQuantity(1)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      disabled={quantity >= 10 || product.isStockOut}
                      className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-black disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:bg-transparent disabled:hover:text-white"
                      aria-label="Increase quantity"
                    >
                      <Plus size={15} strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-gold/[0.06] to-transparent p-4">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="uppercase tracking-[0.15em]">Subtotal</span>
                    <span>
                      ৳{Number(selectedSize?.sellingPrice || 0).toLocaleString()}
                      <span className="mx-1.5 text-white/20">×</span>
                      {quantity}
                    </span>
                  </div>
                  <div className="my-3 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400">Total</span>
                    <motion.span
                      key={subtotal}
                      initial={{ scale: 1.06, opacity: 0.7 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-display text-2xl font-light tracking-tight text-gold"
                    >
                      ৳{subtotal.toLocaleString()}
                    </motion.span>
                  </div>
                </div>

                {/* CTA */}
                <motion.button
                  onClick={addToCartFromModal}
                  disabled={isAddingToCart || !selectedSize || product.isStockOut}
                  whileHover={!product.isStockOut && !isAddingToCart ? { y: -2 } : {}}
                  whileTap={!product.isStockOut && !isAddingToCart ? { scale: 0.98 } : {}}
                  className={`group relative w-full overflow-hidden rounded-xl py-4 text-sm font-semibold uppercase tracking-[0.15em] transition-all duration-300 disabled:cursor-not-allowed ${
                    product.isStockOut
                      ? 'bg-white/[0.04] text-gray-500'
                      : 'bg-gradient-to-r from-gold to-yellow-400 text-black shadow-[0_10px_30px_-10px_rgba(212,175,55,0.6)] hover:shadow-[0_14px_40px_-10px_rgba(212,175,55,0.75)] disabled:opacity-60'
                  }`}
                >
                  <motion.div
                    className="flex items-center justify-center gap-2"
                    initial={false}
                    animate={isAddingToCart ? { opacity: 0 } : { opacity: 1 }}
                  >
                    <ShoppingCart size={17} strokeWidth={2.5} />
                    <span>{product.isStockOut ? 'Out of stock' : 'Add to cart'}</span>
                  </motion.div>

                  {/* Shine sweep */}
                  {!product.isStockOut && (
                    <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  )}

                  <AnimatePresence>
                    {isAddingToCart && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/70 border-t-transparent" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Trust row */}
                <div className="flex items-center justify-center gap-5 pt-1 text-[11px] text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Shield size={12} className="text-gold/70" />
                    <span>Premium quality</span>
                  </div>
                  <div className="h-3 w-px bg-white/10" />
                  <div className="flex items-center gap-1.5">
                    <Truck size={12} className="text-gold/70" />
                    <span>Steadfast Courier</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

ProductModal.displayName = 'ProductModal';
export default ProductModal;