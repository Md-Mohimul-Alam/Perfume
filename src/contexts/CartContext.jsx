import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('storeCart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (_) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('storeCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product, size, quantity = 1) => {
    if (!size || typeof size.sellingPrice !== 'number' || size.sellingPrice <= 0) {
      console.warn('❌ Invalid size or missing sellingPrice');
      return;
    }

    const cartItem = {
      id: `${product.id}-${size._id || size.sizeMl}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      category: product.category || (product.type === 'spray' ? 'perfume' : 'oil'),
      size: size.sizeMl,
      sizeLabel: size.sizeMl + 'ml' + (size.bottleType ? ` ${size.bottleType}` : ''),
      price: size.sellingPrice,
      quantity: quantity,
      imageEmoji: product.category === 'perfume' ? '🌸' : '💧',
    };

    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.productId === product.id && item.size === size.sizeMl
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, cartItem];
    });
  }, []);

  const updateCartItemQuantity = useCallback((itemId, delta) => {
    setCart(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // ✅ Tax removed. Shipping is passed in by the caller (based on zone).
  const getCartTotal = useCallback((shippingCharge = 0) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      subtotal,
      shipping: shippingCharge,
      total: subtotal + shippingCharge,
    };
  }, [cart]);

  const getCartCount = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const value = {
    cart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};