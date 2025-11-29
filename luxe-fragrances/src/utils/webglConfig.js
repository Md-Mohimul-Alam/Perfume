// WebGL configuration to suppress warnings
export const configureWebGL = () => {
  // Override WebGL texture methods to handle lazy initialization
  const originalTexImage2D = WebGLRenderingContext.prototype.texImage2D;
  const originalTexSubImage2D = WebGLRenderingContext.prototype.texSubImage2D;
  
  WebGLRenderingContext.prototype.texImage2D = function(...args) {
    try {
      return originalTexImage2D.apply(this, args);
    } catch (error) {
      console.warn('WebGL texImage2D warning:', error);
    }
  };
  
  WebGLRenderingContext.prototype.texSubImage2D = function(...args) {
    try {
      return originalTexSubImage2D.apply(this, args);
    } catch (error) {
      console.warn('WebGL texSubImage2D warning:', error);
    }
  };
};

// Call this function in your main App.js or index.js