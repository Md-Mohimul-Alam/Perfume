import React from 'react';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "This is not just a perfume house. LUXE is an experience of feeling truly special. Every scent is crafted to perfection.",
      author: "Amira K., Returning Customer"
    },
    {
      quote: "The service and sophistication are world-class. Clean, modern, and deeply memorable fragrances.",
      author: "Rami S., Artist"
    }
  ];

  return (
    <section className="testimonials-section py-20 px-4 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-purple-900/5" />
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          className="testimonials-subtitle text-gold text-sm tracking-widest uppercase mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Testimonials
        </motion.div>

        <div className="space-y-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <blockquote className="testimonial-quote text-2xl lg:text-3xl text-gray-800 leading-relaxed font-light mb-6 relative">
                "{testimonial.quote}"
              </blockquote>
              <div className="testimonial-author text-gray-600 text-lg">
                {testimonial.author}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;