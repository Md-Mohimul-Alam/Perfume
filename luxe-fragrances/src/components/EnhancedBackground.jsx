import React from 'react';

const EnhancedBackground = () => {
  return (
    <>
      {/* Main Animated Background */}
      <div className="luxe-background fixed inset-0 bg-layer-1" />
      
      {/* Floating Luxury Particles */}
      <div className="floating-luxury bg-layer-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="luxury-particle" />
        ))}
      </div>
      
      {/* Geometric Pattern Overlay */}
      <div className="geometric-overlay bg-layer-3" />
      
      {/* Shimmer Effect */}
      <div className="shimmer-overlay bg-layer-4" />
      
      {/* Animated Grid */}
      <div className="animated-grid bg-layer-2" />
      
      {/* Texture Overlay */}
      <div className="texture-overlay bg-layer-3" />
    </>
  );
};

export default EnhancedBackground;