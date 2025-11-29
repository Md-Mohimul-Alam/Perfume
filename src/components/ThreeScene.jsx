import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    // Get the container element
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer with proper configuration
    const renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
      stencil: false,
      depth: false,
      alpha: true
    });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    // Configure texture loading to reduce warnings
    THREE.Texture.DEFAULT_ANISOTROPY = 1;
    THREE.Texture.DEFAULT_MAG_FILTER = THREE.LinearFilter;
    THREE.Texture.DEFAULT_MIN_FILTER = THREE.LinearMipmapLinearFilter;

    // Add renderer to DOM
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add a simple cube for demonstration
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xd4af37,
      transparent: true,
      opacity: 0.8
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-64 bg-black rounded-lg overflow-hidden"
    />
  );
};

export default ThreeScene;