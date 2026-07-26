'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { HERO_SLIDES } from '@/lib/constants';
import { FaMapMarkerAlt, FaInfoCircle, FaChevronDown } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HeroSection() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Background Slider */}
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        speed={1200}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="absolute inset-0 w-full h-full"
      >
        {HERO_SLIDES.map((slide, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            <div className={`absolute inset-0 transition-transform duration-[8000ms] ease-out ${
              activeIndex === index ? 'scale-110' : 'scale-100'
            }`}>
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />

      {/* Toraja Pattern Overlay */}
      <div className="absolute inset-0 z-10 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10L60 30L50 50L40 30Z' fill='white'/%3E%3Cpath d='M20 50L30 70L20 90L10 70Z' fill='white'/%3E%3Cpath d='M80 50L90 70L80 90L70 70Z' fill='white'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 100px'
      }} />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6">
        {/* Logo KKN & Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6 flex flex-col items-center gap-3"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 relative drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo-kkn.png"
              alt="Logo KKN-T 116 Desa Tiromanda"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium shadow-lg">
            <FaMapMarkerAlt className="text-accent" />
            KKN-T 116 Gelombang 116 • Makale Selatan, Tana Toraja
          </span>
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
            onClick={() => handleNavClick('location')}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-light text-white rounded-xl font-semibold text-base shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all duration-300 hover:scale-105"
          >
            <FaMapMarkerAlt className="group-hover:animate-bounce" />
            {t('hero.btn_location')}
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/25 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105"
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => handleNavClick('about')}
      >
        <span className="text-white/50 text-xs tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FaChevronDown className="text-white/50 text-lg" />
        </motion.div>
      </motion.div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:flex items-center gap-2 text-white/50 text-sm font-mono">
        <span className="text-accent font-bold text-lg">{String(activeIndex + 1).padStart(2, '0')}</span>
        <span>/</span>
        <span>{String(HERO_SLIDES.length).padStart(2, '0')}</span>
      </div>
    </section>
  );
}
