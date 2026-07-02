import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye, ChevronDown } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import API from '../api/axios';

const productEmojis = {
  perfume: '🌸',
  oil: '💧'
};

// Memoized product card component
const ProductCard = React.memo(({ product, wishlist, toggleWishlist, openProductModal, quickAddToCart }) => {
  const isInWishlist = wishlist.includes(product.id);

  return (
    <motion.div
      className="product-card group relative bg-white/5 border border-gold/15 rounded-lg overflow-hidden transition-all duration-400 hover:border-gold hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gold/20"
      whileHover={{ y: -8 }}
      layout
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
          isInWishlist ? 'text-red-500 scale-110' : 'text-white hover:scale-110 hover:text-red-400'
        }`}
      >
        <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
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
          From ৳{product.basePrice || 0}
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
});

ProductCard.displayName = 'ProductCard';

const ProductsGrid = ({ wishlist, toggleWishlist, openProductModal }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(20); // will be set based on screen width
  const { addToCart } = useCart();

  // Determine initial visible count based on screen width
  const getInitialCount = useCallback(() => {
    return window.innerWidth < 768 ? 10 : 20;
  }, []);

  // Set initial visible count on mount and on resize (optional)
  useEffect(() => {
    const updateCount = () => {
      setVisibleCount(getInitialCount());
    };
    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, [getInitialCount]);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(getInitialCount());
  }, [currentFilter, getInitialCount]);

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.get("/products?limit=10000");

      let rawProducts = [];
      if (Array.isArray(response.data)) {
        rawProducts = response.data;
      } else if (Array.isArray(response.data.products)) {
        rawProducts = response.data.products;
      } else if (Array.isArray(response.data.data)) {
        rawProducts = response.data.data;
      } else if (Array.isArray(response.data.items)) {
        rawProducts = response.data.items;
      }

      const transformedProducts = rawProducts
        .filter((product) => product && product._id)
        .map(transformProduct)
        .filter((p) => p.sizes?.length > 0);

      setProducts(transformedProducts);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Transform backend product – exclude 3ml sizes
  const transformProduct = (backendProduct) => {
    const isSpray = backendProduct.type === 'spray';
    const category = isSpray ? 'perfume' : 'oil';

    const validSizes = (backendProduct.sizes || []).filter((s) => s.sizeMl !== 3);
    let basePrice = 0;
    if (validSizes.length > 0) {
      const prices = validSizes.map((s) => s.sellingPrice || 0);
      basePrice = Math.min(...prices);
    }

    const notes =
      backendProduct.notes?.length > 0
        ? backendProduct.notes
        : backendProduct.blendComponents?.map((c) => c.material?.name || '') || ['Premium'];

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
      bestFor: backendProduct.bestFor || ['all'],
      isNew,
      isBestseller: backendProduct.isBestseller || false,
      images: backendProduct.images || [],
      backendData: backendProduct,
      sizes: validSizes,
    };
  };

  // Quick add: find the smallest non-3ml size
  const quickAddToCart = useCallback(
    (product, event) => {
      event?.stopPropagation();
      const sizes = product.sizes || [];
      if (sizes.length === 0) return;
      const sorted = [...sizes].sort((a, b) => a.sizeMl - b.sizeMl);
      addToCart(product, sorted[0]);
    },
    [addToCart]
  );

  // Filter products – memoized
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      switch (currentFilter) {
        case 'perfume':
          return product.category === 'perfume';
        case 'oil':
          return product.category === 'oil';
        case 'new':
          return product.isNew;
        case 'bestsellers':
          return product.isBestseller;
        case 'bestseller-perfume':
          return product.isBestseller && product.category === 'perfume';
        case 'bestseller-oil':
          return product.isBestseller && product.category === 'oil';
        default:
          return true;
      }
    });
  }, [products, currentFilter]);

  // Displayed products – slice based on visibleCount
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  // Load more handler – shows all products
  const loadMore = useCallback(() => {
    setVisibleCount(filteredProducts.length);
  }, [filteredProducts.length]);

  // Check if more products are available
  const hasMore = visibleCount < filteredProducts.length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold text-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading our collection...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-6 py-3 border border-gold text-white hover:bg-gold hover:text-black transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="shop" className="py-20 px-4 lg:px-16 bg-black relative overflow-hidden">
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

        {/* Filter Tabs with product count */}
        <div className="flex flex-col items-center gap-4 mb-16">
          <div className="filter-tabs text-white flex flex-wrap justify-center gap-4">
            {[
              { key: 'all', label: 'All Products' },
              { key: 'perfume', label: 'Perfumes' },
              { key: 'oil', label: 'Essential Oils' },
              { key: 'new', label: 'New Arrivals' },
              { key: 'bestsellers', label: 'Bestsellers' },
              { key: 'bestseller-perfume', label: 'Bestseller Perfume' },
              { key: 'bestseller-oil', label: 'Bestseller Oil' }
            ].map((filter) => {
              const isActive = currentFilter === filter.key;
              return (
                <motion.button
                  key={filter.key}
                  className={`px-7 py-3 border border-gold/30 text-sm tracking-wider uppercase font-light transition-all duration-300 ${
                    isActive
                      ? 'bg-gold text-black border-gold'
                      : 'text-white hover:bg-gold/10 hover:border-gold/60'
                  }`}
                  onClick={() => setCurrentFilter(filter.key)}
                  whileTap={{ scale: 0.95 }}
                >
                  {filter.label}
                </motion.button>
              );
            })}
          </div>
          <p className="text-gray-400 text-sm">
            {filteredProducts.length} product{filteredProducts.length !== 1 && 's'} found
          </p>
        </div>

        {/* Products Grid */}
        {displayedProducts.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            <p className="text-6xl mb-4">🛒</p>
            <p>No products found matching your criteria.</p>
            <button
              onClick={() => setCurrentFilter('all')}
              className="mt-4 text-gold underline hover:text-gold/80"
            >
              Show all products
            </button>
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  openProductModal={openProductModal}
                  quickAddToCart={quickAddToCart}
                />
              ))}
            </motion.div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  className="flex items-center gap-2 px-8 py-4 border border-gold/50 text-gold hover:bg-gold hover:text-black transition-all duration-300 rounded-lg font-medium tracking-wide"
                >
                  <span>Load More</span>
                  <ChevronDown size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProductsGrid;