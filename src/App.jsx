import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AIFragranceFinder from './components/AIFragranceFinder';
import Philosophy from './components/Philosophy';
import ScentJourney from './components/ScentJourney';
import ScentNotes from './components/ScentNotes';
import PersonalizedSection from './components/PersonalizedSection';
import SearchSection from './components/SearchSection';
import ProductsGrid from './components/ProductsGrid';
import Testimonials from './components/Testimonials';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import CartSidebar from './components/CartSidebar';
import EnhancedBackground from './components/EnhancedBackground';
import { CartProvider } from './contexts/CartContext';
// ❌ Remove: import { products } from './utils/constants';
import './styles/globals.css';

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('luxeWishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const newWishlist = prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      localStorage.setItem('luxeWishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <CartProvider>
      <div className="App">
        <EnhancedBackground />
        
        <Header toggleCart={toggleCart} />
        <Hero />
        <ScentNotes />
        <SearchSection />
        <ProductsGrid 
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          openProductModal={openProductModal}
        />
        <AIFragranceFinder />
        <Philosophy />
        <ScentJourney />
        <PersonalizedSection />
        
        {/* ProductsGrid now fetches data itself */}
        

        
        <Testimonials />
        <About />
        <Contact />
        <Footer />

        {/* Modals */}
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={closeProductModal}
          />
        )}

        <CartSidebar 
          isOpen={isCartOpen} 
          onClose={toggleCart}
        />
      </div>
    </CartProvider>
  );
}

export default App;