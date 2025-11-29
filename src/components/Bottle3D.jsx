import React from 'react';
import { motion } from 'framer-motion';
import Logo from '../assets/logo.svg'; // adjust the path if needed

const Bottle3D = () => {
  return (
    <motion.div
      className="w-70 h-100 mx-auto perspective-1000 flex items-center justify-center"
      animate={{
        rotateY: [0, 90, 180, 270, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.3 },
      }}
    >
      {/* SVG bottle */}
      <motion.img
        src={Logo}
        alt="Perfume bottle"
        className="w-full h-full object-contain drop-shadow-xxl"
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

export default Bottle3D;
