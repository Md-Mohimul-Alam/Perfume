import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AIFragranceFinder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});

  const steps = [
    {
      id: 1,
      question: "What mood are you seeking to create?",
      options: [
        { value: 'confident', label: 'Confident & Powerful' },
        { value: 'romantic', label: 'Romantic & Sensual' },
        { value: 'fresh', label: 'Fresh & Energized' },
        { value: 'calm', label: 'Calm & Serene' }
      ]
    },
    {
      id: 2,
      question: "Which scent family resonates with you?",
      options: [
        { value: 'woody', label: 'Woody & Earthy' },
        { value: 'floral', label: 'Floral & Delicate' },
        { value: 'citrus', label: 'Citrus & Fresh' },
        { value: 'oriental', label: 'Oriental & Spicy' }
      ]
    },
    {
      id: 3,
      question: "When will you primarily wear this fragrance?",
      options: [
        { value: 'day', label: 'Daytime & Office' },
        { value: 'evening', label: 'Evening & Events' },
        { value: 'special', label: 'Special Occasions' },
        { value: 'all', label: 'All Day & Everyday' }
      ]
    }
  ];

  const selectOption = (stepId, value) => {
    setAnswers(prev => ({ ...prev, [stepId]: value }));
    
    // Auto-advance to next step after a delay
    setTimeout(() => {
      if (stepId < steps.length) {
        setCurrentStep(stepId + 1);
      }
    }, 500);
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <section className="ai-fragrance-finder py-20 px-4 bg-black/80 relative overflow-hidden border-y border-gold/20">
      <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-purple-900/10 animate-pulse" />
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.h2 
          className="font-display text-4xl text-white mb-4 tracking-widest uppercase font-light"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          AI Fragrance Finder
        </motion.h2>
        
        <motion.p
          className="text-gray-400 text-lg mb-12 tracking-widest font-light"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Our advanced AI will help you discover your perfect scent
        </motion.p>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gold/20 rounded-full mb-12 overflow-hidden">
          <motion.div 
            className="h-full bg-gold"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {steps.map((step) => (
            currentStep === step.id && (
              <motion.div
                key={step.id}
                className="ai-finder-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="ai-finder-question text-2xl text-white mb-8 font-light tracking-wide">
                  {step.question}
                </div>
                
                <div className="ai-finder-options flex flex-wrap justify-center gap-4">
                  {step.options.map((option) => (
                    <motion.button
                      key={option.value}
                      className={`px-6 py-3 border text-sm tracking-wider uppercase font-light transition-all duration-300 ${
                        answers[step.id] === option.value
                          ? 'border-gold bg-gold text-black'
                          : 'border-gold/30 text-white hover:border-gold'
                      }`}
                      onClick={() => selectOption(step.id, option.value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Results Button */}
        {currentStep > steps.length && (
          <motion.button
            className="mt-8 px-8 py-4 bg-gold text-black text-lg tracking-wider uppercase font-light hover:bg-gold/90 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => alert('AI Recommendations would be generated here!')}
          >
            Find My Perfect Scent
          </motion.button>
        )}
      </div>
    </section>
  );
};

export default AIFragranceFinder;