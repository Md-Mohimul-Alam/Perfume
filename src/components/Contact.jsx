import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="contact-section py-20 px-4 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.h2 
          className="font-display text-4xl lg:text-5xl text-center text-gold mb-4 tracking-widest uppercase font-light"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Get In Touch
        </motion.h2>
        
        <motion.p
          className="text-gray-400 text-lg text-center mb-12 tracking-widest font-light"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          We'd love to hear from you
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="contact-form space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/5 border border-gold/30 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-colors"
            required
          />
          
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/5 border border-gold/30 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-colors"
            required
          />
          
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleInputChange}
            rows="6"
            className="w-full px-4 py-3 bg-white/5 border border-gold/30 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-colors resize-vertical"
            required
          />
          
          <motion.button
            type="submit"
            className="w-full py-4 bg-gold text-black text-lg font-bold tracking-wider uppercase hover:bg-gold/90 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Send Message
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;