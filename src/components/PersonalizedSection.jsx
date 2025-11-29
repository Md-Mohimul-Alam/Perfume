import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PersonalizedSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    age: '',
    style: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage
    localStorage.setItem('luxeUserProfile', JSON.stringify(formData));
    alert('Profile created successfully! You will now receive personalized recommendations.');
    setFormData({ name: '', email: '', gender: '', age: '', style: '' });
  };

  return (
    <section className="personalized-section py-20 px-4 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h2 className="personalized-title font-display text-4xl lg:text-5xl text-white mb-6 tracking-widest uppercase font-light">
              Personalized Experience
            </h2>
            <p className="personalized-subtitle text-gray-400 text-lg leading-relaxed">
              Create your custom fragrance profile for tailored recommendations and exclusive offers. 
              Our AI will learn your preferences to suggest the perfect scents just for you.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="personalized-form space-y-6">
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
              
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-gold/30 text-white focus:outline-none focus:border-gold transition-colors"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
              
              <select
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-gold/30 text-white focus:outline-none focus:border-gold transition-colors"
                required
              >
                <option value="">Select Age Range</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="55+">55+</option>
              </select>
              
              <select
                name="style"
                value={formData.style}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-gold/30 text-white focus:outline-none focus:border-gold transition-colors"
                required
              >
                <option value="">Select Your Style</option>
                <option value="classic">Classic & Timeless</option>
                <option value="modern">Modern & Trendy</option>
                <option value="bohemian">Bohemian & Free-spirited</option>
                <option value="minimalist">Minimalist & Clean</option>
                <option value="luxury">Luxury & Opulent</option>
              </select>
              
              <motion.button
                type="submit"
                className="w-full py-4 bg-transparent border border-gold text-white text-lg tracking-wider uppercase font-light hover:bg-gold hover:text-black transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Create My Profile</span>
                <div className="absolute inset-0 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedSection;