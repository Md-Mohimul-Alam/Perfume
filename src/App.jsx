import React, { useState, useEffect, useCallback } from 'react';
import { CartProvider, useCart } from './contexts/CartContext';
import API from './api/axios';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import EnhancedBackground from './components/EnhancedBackground';
import FloatingParticles from './components/FloatingParticles';
import ProductsGrid from './components/ProductsGrid';
import ScentNotes from './components/ScentNotes';
import AIFragranceFinder from './components/AIFragranceFinder';
import Testimonials from './components/Testimonials';
import About from './components/About';
import Philosophy from './components/Philosophy';
import PersonalizedSection from './components/PersonalizedSection';
import SearchSection from './components/SearchSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import WishlistSidebar from './components/WishlistSidebar';
import ProductModal from './components/ProductModal';

// ---------- Helper: normalize image URL ----------
const normalizeImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl =
    import.meta.env.VITE_API_URL ||
    'https://perfume-stock-management-system.onrender.com';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

// ---------- Inner App (needs CartContext access) ----------
const AppContent = () => {
  const { addToCart } = useCart();

  // ---------- Products (hoisted so Wishlist & Grid share data) ----------
  const [productsList, setProductsList] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // ---------- Wishlist ----------
  const [wishlist, setWishlist] = useState([]);

  // ---------- Sidebar / Modal state ----------
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ============================================================
  // Load wishlist from localStorage (once)
  // ============================================================
  useEffect(() => {
    try {
      const saved = localStorage.getItem('storeWishlist');
      if (saved) setWishlist(JSON.parse(saved));
    } catch (_) {
      // ignore
    }
  }, []);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('storeWishlist', JSON.stringify(wishlist));
    } catch (_) {
      // ignore
    }
  }, [wishlist]);

  // ============================================================
  // Fetch products once, transform for the frontend
  // ============================================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await API.get('/products?showOnClient=true&limit=10000');

        let raw = [];
        if (Array.isArray(response.data)) raw = response.data;
        else if (Array.isArray(response.data.products)) raw = response.data.products;
        else if (Array.isArray(response.data.data)) raw = response.data.data;
        else if (Array.isArray(response.data.items)) raw = response.data.items;

        const transformed = raw
          .filter((p) => p && p._id)
          .map((p) => {
            const isSpray = p.type === 'spray';
            const category = isSpray ? 'perfume' : 'oil';
            const validSizes = (p.sizes || []).filter((s) => s.sizeMl !== 3);

            let basePrice = 0;
            if (validSizes.length > 0) {
              basePrice = Math.min(...validSizes.map((s) => s.sellingPrice || 0));
            }

            const notes =
              p.notes?.length > 0
                ? p.notes
                : p.blendComponents?.map((c) => c.material?.name || '') || ['Premium'];

            const isNew =
              p.createdAt &&
              Date.now() - new Date(p.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;

            let mainImage = null;
            if (p.images?.length > 0) mainImage = normalizeImageUrl(p.images[0]);
            else if (validSizes[0]?.image) mainImage = normalizeImageUrl(validSizes[0].image);

            return {
              id: p._id,
              name: p.name,
              sku: p.sku,
              category,
              type: p.type,
              description: p.description || `${p.name} – ${p.sku}`,
              basePrice,
              notes,
              intensity: p.intensity || (isSpray ? 'medium' : 'strong'),
              bestFor: p.bestFor || ['all'],
              isNew,
              isBestseller: p.isBestseller || false,
              isStockOut: p.isStockOut || false,
              images: p.images || [],
              mainImage,
              backendData: p,
              sizes: validSizes,
            };
          })
          .filter((p) => p.sizes.length > 0);

        setProductsList(transformed);
      } catch (err) {
        console.error('Product fetch error:', err);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ============================================================
  // Wishlist handlers
  // ============================================================
  const toggleWishlist = useCallback((productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
  }, []);

  // ============================================================
  // Modal handlers
  // ============================================================
  const openProductModal = useCallback((product) => {
    // Accept both a raw product object and a product with `backendData`
    setSelectedProduct(product);
  }, []);

  const closeProductModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  // ============================================================
  // Quick-add from Wishlist sidebar
  // ============================================================
  const handleWishlistQuickAdd = useCallback(
    (product) => {
      if (!product || product.isStockOut) return;
      const sizes = product.sizes || [];
      if (sizes.length === 0) return;
      const smallest = [...sizes].sort((a, b) => a.sizeMl - b.sizeMl)[0];
      if (smallest) addToCart(product, smallest, 1);
    },
    [addToCart]
  );

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background layers */}
      <EnhancedBackground />
      <FloatingParticles count={30} />

      {/* Header (with wishlist + cart buttons) */}
      <Header
        toggleCart={() => setIsCartOpen(true)}
        wishlist={wishlist}
        onWishlistClick={() => setIsWishlistOpen(true)}
      />

      {/* Main content */}
      <main className="relative z-10">
        <Hero />
        <ProductsGrid
          products={productsList}
          loading={productsLoading}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          openProductModal={openProductModal}
        />
        <SearchSection />
        <ScentNotes />
        <AIFragranceFinder openProductModal={openProductModal} />
        <Testimonials />
        <About />
        <Philosophy />
        <PersonalizedSection />
        <Contact />
      </main>

      <Footer />

      {/* Cart slide-in */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Wishlist slide-in */}
      <WishlistSidebar
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        products={productsList}
        onRemove={removeFromWishlist}
        onViewProduct={openProductModal}
        onAddToCart={handleWishlistQuickAdd}
      />

      {/* Product details modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={closeProductModal}
        />
      )}
    </div>
  );
};

// ---------- Root App (with CartProvider) ----------
const App = () => {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
};

export default App;