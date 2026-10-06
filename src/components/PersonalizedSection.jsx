import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const INITIAL_PREFERENCES = { format: 'any', intensity: '', note: '', occasion: '' };

const PersonalizedSection = ({ onSavePreferences }) => {
  const [preferences, setPreferences] = useState(() => {
    try {
      const savedPreferences = window.localStorage.getItem('luxeScentPreferences');
      return savedPreferences ? { ...INITIAL_PREFERENCES, ...JSON.parse(savedPreferences) } : INITIAL_PREFERENCES;
    } catch {
      return INITIAL_PREFERENCES;
    }
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    setSaved(false);
    setPreferences((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const profile = { ...preferences, updatedAt: new Date().toISOString() };
    try {
      window.localStorage.setItem('luxeScentPreferences', JSON.stringify(profile));
      onSavePreferences?.(profile);
      setSaved(true);
    } catch (error) {
      console.error('Could not save fragrance preferences:', error);
      setSaved(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#090908] px-4 py-20" aria-labelledby="personalized-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(212,175,55,0.10),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-gold"><Sparkles size={15} /> Your scent profile</p>
          <h2 id="personalized-title" className="font-display text-4xl font-light tracking-wide text-white md:text-5xl">Choose what feels like you.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-gray-400">Save a few fragrance preferences on this device, then use the LUXE Fragrance Finder to explore matching products.</p>
          <p className="mt-4 text-xs text-gray-500">Your preferences stay in this browser; this form does not collect contact details.</p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="grid gap-4 rounded-2xl border border-gold/15 bg-white/[0.035] p-5 sm:p-7">
          <label className="grid gap-2 text-xs uppercase tracking-widest text-gray-400">Preferred format
            <select name="format" value={preferences.format} onChange={handleChange} className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-gold/60">
              <option value="any">No preference</option><option value="spray">Spray</option><option value="roll-on">Roll-on</option>
            </select>
          </label>
          <label className="grid gap-2 text-xs uppercase tracking-widest text-gray-400">Preferred intensity
            <select name="intensity" value={preferences.intensity} onChange={handleChange} className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-gold/60">
              <option value="">Any intensity</option><option value="light">Light</option><option value="medium">Medium</option><option value="strong">Strong</option>
            </select>
          </label>
          <label className="grid gap-2 text-xs uppercase tracking-widest text-gray-400">Scent note
            <select name="note" value={preferences.note} onChange={handleChange} className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-gold/60">
              <option value="">Surprise me</option><option value="woody">Woody</option><option value="floral">Floral</option><option value="citrus">Citrus</option><option value="fresh">Fresh</option><option value="spicy">Spicy</option><option value="sweet">Sweet</option><option value="oriental">Oriental</option>
            </select>
          </label>
          <label className="grid gap-2 text-xs uppercase tracking-widest text-gray-400">When will you wear it?
            <select name="occasion" value={preferences.occasion} onChange={handleChange} className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-gold/60">
              <option value="">Any occasion</option><option value="daytime">Daytime</option><option value="evening">Evening</option><option value="special">Special occasion</option><option value="all">Everyday</option>
            </select>
          </label>
          <button type="submit" className="mt-2 rounded-full bg-gold px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-yellow-300">Save my preferences</button>
          <p className="min-h-5 text-center text-sm text-emerald-300" aria-live="polite">{saved ? 'Preferences saved on this device.' : ''}</p>
        </motion.form>
      </div>
    </section>
  );
};

export default PersonalizedSection;
