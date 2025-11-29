import React from 'react';
import { motion } from 'framer-motion';

const ScentJourney = () => {
  const steps = [
    {
      icon: '🌿',
      title: 'Sourcing',
      description: 'We source the finest ingredients from sustainable growers worldwide, ensuring purity and quality.'
    },
    {
      icon: '🔬',
      title: 'Extraction',
      description: 'Using both traditional and modern extraction methods to capture the essence of each ingredient.'
    },
    {
      icon: '👃',
      title: 'Blending',
      description: 'Our master perfumers create unique scent profiles through meticulous blending and testing.'
    },
    {
      icon: '💎',
      title: 'Bottling',
      description: 'Each fragrance is carefully bottled in our signature luxury packaging, ready for your enjoyment.'
    }
  ];

  return (
    <section className="scent-journey py-20 px-4 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent animate-pulse" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2 
          className="scent-journey-title font-display text-4xl lg:text-5xl text-center text-white mb-16 tracking-widest uppercase font-light"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          The LUXE Scent Journey
        </motion.h2>
        
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-20 left-1/4 right-1/4 h-0.5 bg-gold/30" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="scent-step text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="scent-step-icon w-20 h-20 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center text-2xl mx-auto mb-6 group-hover:bg-gold group-hover:scale-110 transition-all duration-300">
                  {step.icon}
                </div>
                <h3 className="scent-step-title text-white text-xl font-medium mb-4">
                  {step.title}
                </h3>
                <p className="scent-step-description text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScentJourney;