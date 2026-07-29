'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { FaMapMarkerAlt, FaInfoCircle, FaChevronDown } from 'react-icons/fa';

export default function HeroSection() {
  const { t } = useLanguage();

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Drone Aerial Background HD */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero_drone_aerial.png"
          alt="Pemandangan Drone Tana Toraja - Desa Tiromanda"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={100} // <-- Ini tambahan untuk memaksa render HD 100%
        />
      </div>

      {/* Dark Gradient Overlay — deep forest green */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1F3A2C]/80 via-[#1F3A2C]/40 to-black/65 z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6">
        {/* Welcome Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 backdrop-blur-md border-2 rounded-sm"
            style={{
              background: 'rgba(255,255,255,0.08)',
              borderColor: 'rgba(255,255,255,0.35)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.1) inset, 0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <span className="block w-4 h-[1px]" style={{ background: 'rgba(255,255,255,0.5)' }} />
            <span className="text-white/90 text-[11px] font-bold tracking-[0.22em] uppercase">
              {t('hero.welcome_badge')}
            </span>
            <span className="block w-4 h-[1px]" style={{ background: 'rgba(255,255,255,0.5)' }} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
          className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight"
        >
          {t('hero.title')}
        </motion.h1>

        {/* Accent Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="w-24 h-1 bg-gradient-to-r from-accent via-accent-light to-accent rounded-full mb-6"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-white/80 text-lg sm:text-xl md:text-2xl max-w-3xl leading-relaxed mb-10 font-light"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => handleNavClick('infografis')}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-light text-white rounded-xl font-semibold text-base shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all duration-300 hover:scale-105"
          >
            <FaMapMarkerAlt className="group-hover:animate-bounce" />
            {t('hero.btn_location')}
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/25 rounded-xl font-semibold text-base hover:scale-105"
            style={{ transition: 'background-color 0.3s, transform 0.3s, border-color 0.3s' }}
          >
            <FaInfoCircle />
            {t('hero.btn_about')}
          </button>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
        onClick={() => handleNavClick('about')}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FaChevronDown className="text-white/40 text-xl" />
        </motion.div>
      </motion.div>
    </section>
  );
}