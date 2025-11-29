import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

const Bottle = () => {
  const bottleRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (bottleRef.current) {
      if (!isHovered) {
        bottleRef.current.rotation.y += delta * 0.2;
      }
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <group 
        ref={bottleRef}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        {/* Main bottle body */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.8, 1, 2.5, 32]} />
          <meshPhysicalMaterial
            color="#d4af37"
            transmission={0.8}
            thickness={0.5}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={1}
          />
        </mesh>
        
        {/* Bottle cap */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
          <meshStandardMaterial color="#b8941f" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Liquid inside */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.75, 0.95, 1.8, 32]} />
          <meshPhysicalMaterial
            color="#8b4513"
            transmission={0.9}
            thickness={1}
            roughness={0.2}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>
    </Float>
  );
};

export default Bottle;