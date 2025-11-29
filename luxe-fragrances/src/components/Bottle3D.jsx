import React from 'react';
import { motion } from 'framer-motion';

const Bottle3D = () => {
  return (
    <motion.div
      className="bottle-container w-40 h-80 mx-auto perspective-1000"
      animate={{
        rotateY: [0, 90, 180, 270, 360],
        rotateX: [8, 12, 8, 4, 8],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
        ease: 'linear',
      }}
      whileHover={{
        scale: 1.08,
        rotateX: 0,
        transition: { duration: 0.3 },
      }}
    >
      <div className="bottle-3d relative w-full h-full preserve-3d flex items-end justify-center">
        {/* Tall curved body (following first bottle in image) */}
        <div className="relative w-[55%] h-[80%] glass-body rounded-bottle overflow-visible">
          {/* Inner glass volume */}
          <div className="absolute inset-0 bottle-body glass-container rounded-bottle" />

          {/* Inner liquid (slimmer waist, wider base) */}
          <div className="absolute bottom-[6%] left-[12%] w-[76%] h-[60%] liquid-shape bg-gradient-to-b from-gold/35 via-gold/15 to-gold/5" />

          {/* Vertical highlight */}
          <div className="absolute top-[18%] left-[18%] w-[18%] h-[60%] bottle-highlight" />
        </div>

        {/* Faceted cap similar to reference */}
        <div className="bottle-cap-shape absolute -top-7 left-1/2 -translate-x-1/2">
          {/* Neck */}
          <div className="w-8 h-5 rounded-t-md bg-gradient-to-b from-gold/90 to-gold/60 neck-shadow" />
          {/* Faceted gem‑like cap */}
          <div className="mt-[-2px] w-9 h-8 cap-facet" />
        </div>
      </div>
    </motion.div>
  );
};

export default Bottle3D;
