import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScentNotes = () => {
  const [activeNote, setActiveNote] = useState(null);

  const notes = [
    {
      id: 'floral',
      icon: '🌸',
      title: 'Floral',
      description: 'Floral fragrances are characterized by the scents of various flowers. They can range from light and airy to rich and intoxicating. Common floral notes include rose, jasmine, lily, and violet. These scents are often associated with femininity, romance, and elegance.'
    },
    {
      id: 'woody',
      icon: '🌲',
      title: 'Woody',
      description: 'Woody fragrances feature scents derived from woods and mosses. They are often warm, dry, and earthy. Common woody notes include sandalwood, cedar, patchouli, and vetiver. These scents evoke feelings of sophistication, strength, and connection to nature.'
    },
    {
      id: 'citrus',
      icon: '🍊',
      title: 'Citrus',
      description: 'Citrus fragrances are fresh, bright, and energizing. They typically feature notes from citrus fruits like lemon, orange, bergamot, and grapefruit. These scents are often used as top notes in fragrance compositions and are associated with cleanliness, vitality, and freshness.'
    },
    {
      id: 'oriental',
      icon: '🕌',
      title: 'Oriental',
      description: 'Oriental fragrances are warm, spicy, and often exotic. They feature notes like vanilla, amber, spices, and resins. These rich, sensual scents are known for their longevity and depth, often creating an aura of mystery, luxury, and sophistication.'
    }
  ];

  return (
    <section className="scent-notes py-20 px-4 bg-black relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10 text-center">
        <motion.h2 
          className="font-display text-4xl lg:text-5xl text-white mb-4 tracking-widest uppercase font-light"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Explore Scent Notes
        </motion.h2>
        
        <motion.p
          className="text-gray-400 text-lg mb-16 tracking-widest font-light"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Click on a note to learn more about its characteristics
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {notes.map((note) => (
            <motion.div
              key={note.id}
              className="scent-note-item text-center cursor-pointer group"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              onClick={() => setActiveNote(activeNote === note.id ? null : note.id)}
              whileHover={{ scale: 1.05 }}
            >
              <div className={`scent-note-circle w-24 h-24 bg-gold/10 border-2 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 transition-all duration-300 group-hover:bg-gold/20 ${
                activeNote === note.id ? 'bg-gold border-gold scale-110' : 'border-gold/30'
              }`}>
                {note.icon}
              </div>
              <h3 className="text-white text-lg font-medium">{note.title}</h3>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {activeNote && (
            <motion.div
              className="scent-note-description max-w-2xl mx-auto p-8 bg-white/5 border border-gold/20 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-gold text-2xl font-display mb-4">
                {notes.find(n => n.id === activeNote)?.title} Notes
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {notes.find(n => n.id === activeNote)?.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ScentNotes;