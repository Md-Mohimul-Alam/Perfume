import React, { useState } from 'react';
import { motion } from 'framer-motion';
import API from '../api/axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const cleanValue =
      name === 'phone' ? value.replace(/[^\d+\-()\s]/g, '') : value;

    setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (success) setSuccess(false);
  };

  const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = 'Please enter your name.';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email))
      nextErrors.email = 'Please enter a valid email address.';
    if (!formData.phone.trim()) nextErrors.phone = 'Please enter your contact number.';
    else if (!validatePhone(formData.phone))
      nextErrors.phone = 'Please enter a valid contact number.';
    if (!formData.message.trim()) nextErrors.message = 'Please write a short message.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      await API.post('/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setErrors({});
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Something went wrong. Please try again.';
      setErrors({ form: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    'w-full px-4 py-3 bg-white/5 border text-white placeholder-gray-400 focus:outline-none transition-colors rounded-xl';

  return (
    <section
      id="contact"
      className="contact-section relative overflow-hidden bg-black px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-2xl">
        <motion.h2
          className="mb-4 text-center font-display text-4xl font-light uppercase tracking-widest text-gold lg:text-5xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          Get In Touch
        </motion.h2>

        <motion.p
          className="mb-12 text-center text-lg font-light tracking-widest text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          We&apos;d love to hear from you
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="contact-form space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, amount: 0.4 }}
          noValidate
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${inputBase} ${
                  errors.name ? 'border-red-400/60' : 'border-gold/30 focus:border-gold'
                }`}
                required
              />
              {errors.name && (
                <p className="mt-1.5 text-xs tracking-wide text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${inputBase} ${
                  errors.email ? 'border-red-400/60' : 'border-gold/30 focus:border-gold'
                }`}
                required
              />
              {errors.email && (
                <p className="mt-1.5 text-xs tracking-wide text-red-400">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Your Contact Number"
              value={formData.phone}
              onChange={handleInputChange}
              inputMode="tel"
              autoComplete="tel"
              className={`${inputBase} ${
                errors.phone ? 'border-red-400/60' : 'border-gold/30 focus:border-gold'
              }`}
              required
            />
            {errors.phone && (
              <p className="mt-1.5 text-xs tracking-wide text-red-400">{errors.phone}</p>
            )}
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleInputChange}
              rows="6"
              className={`${inputBase} resize-vertical ${
                errors.message ? 'border-red-400/60' : 'border-gold/30 focus:border-gold'
              }`}
              required
            />
            {errors.message && (
              <p className="mt-1.5 text-xs tracking-wide text-red-400">{errors.message}</p>
            )}
          </div>

          {errors.form && (
            <p className="text-center text-sm tracking-wide text-red-400">{errors.form}</p>
          )}

          {success && (
            <p className="text-center text-sm tracking-wide text-emerald-400">
              Thank you! Your message has been sent.
            </p>
          )}

          <motion.button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gold py-4 text-lg font-bold uppercase tracking-wider text-black transition-colors hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
            whileHover={!submitting ? { scale: 1.02 } : {}}
            whileTap={!submitting ? { scale: 0.98 } : {}}
          >
            {submitting ? 'Sending…' : 'Send Message'}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;