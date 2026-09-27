import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Phone, MapPin, Building2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import API from '../api/axios';
import { useCart } from '../contexts/CartContext';

const CheckoutModal = ({ isOpen, onClose, onSuccess }) => {
  const { cart, getCartTotal, clearCart } = useCart();
  const totals = getCartTotal();

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    address: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name';
    if (!form.mobile.trim() || form.mobile.trim().length < 10) return 'Please enter a valid mobile number';
    if (!form.address.trim()) return 'Please enter your address';
    if (!form.city.trim()) return 'Please enter your city';
    if (cart.length === 0) return 'Your cart is empty';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        customer: {
          name: form.name.trim(),
          mobile: form.mobile.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
        },
        items: cart.map((item) => ({
          product: item.productId,        // MongoDB Product _id
          name: item.name,
          sizeMl: item.size,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        subtotal: totals.subtotal,
        tax: totals.tax,
        shipping: totals.shipping,
        totalAmount: totals.total,
      };

      const { data } = await API.post('/orders', payload);

      setSuccess({
        orderNo: data.orderNo,
        total: totals.total,
      });

      // Clear the cart
      clearCart();

      // Auto close after 4s
      setTimeout(() => {
        if (onSuccess) onSuccess(data.order);
        onClose();
      }, 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={!loading && !success ? onClose : undefined}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gold/30 rounded-2xl shadow-2xl shadow-gold/20 overflow-hidden"
      >
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full border border-gold/30 text-gold flex items-center justify-center hover:bg-gold hover:text-black transition disabled:opacity-50"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border-b border-gold/20 p-6">
          <h2 className="font-display text-2xl text-white font-light tracking-widest uppercase">
            Complete Your Order
          </h2>
          <p className="text-gold/80 text-xs tracking-widest uppercase mt-1">
            Fill in your delivery details
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-display text-white mb-2">Order Placed!</h3>
              <p className="text-gray-400 mb-4">Thank you for your order</p>
              <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 inline-block">
                <p className="text-gold text-sm tracking-widest uppercase">Order No</p>
                <p className="text-white text-xl font-bold">{success.orderNo}</p>
                <p className="text-gray-300 text-sm mt-2">Total: ৳{success.total.toFixed(2)}</p>
              </div>
              <p className="text-gray-500 text-xs mt-6">We'll contact you soon to confirm</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 bg-red-500/20 border border-red-500/40 text-red-300 text-sm rounded-lg px-4 py-3">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-white text-xs tracking-widest uppercase mb-2">Full Name *</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/60" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gold/20 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-gold transition disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-xs tracking-widest uppercase mb-2">Mobile Number *</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/60" />
                  <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gold/20 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-gold transition disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-xs tracking-widest uppercase mb-2">Delivery Address *</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-4 text-gold/60" />
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House / Road / Area"
                    rows="3"
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gold/20 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-gold transition resize-none disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-xs tracking-widest uppercase mb-2">City *</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/60" />
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="e.g. Dhaka"
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gold/20 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-gold transition disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-black/40 border border-gold/15 rounded-lg p-4 mt-6">
                <p className="text-gold text-xs tracking-widest uppercase mb-3">Order Summary</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>৳{totals.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-gray-400"><span>Tax (10%)</span><span>৳{totals.tax.toFixed(2)}</span></div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className={totals.shipping === 0 ? 'text-green-400' : ''}>
                      {totals.shipping === 0 ? 'FREE' : `৳${totals.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-white text-lg font-bold border-t border-gold/20 pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-gold">৳{totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-4 bg-gradient-to-r from-gold to-yellow-600 text-black font-bold text-base tracking-widest uppercase rounded-lg hover:shadow-lg hover:shadow-gold/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Placing Order...
                  </>
                ) : (
                  <>Place Order · ৳{totals.total.toFixed(2)}</>
                )}
              </button>

              <p className="text-center text-gray-500 text-xs">
                Cash on Delivery available · We'll call to confirm
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutModal;