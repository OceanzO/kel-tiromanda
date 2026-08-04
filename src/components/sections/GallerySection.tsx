'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { useLanguage } from '@/context/LanguageContext';
import { GALLERY_IMAGES, GALLERY_CATEGORIES } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';
import { FaExpand } from 'react-icons/fa';

export default function GallerySection() {
  const { language, t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const filteredImages = activeCategory === 'all'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter((img) => img.category === activeCategory);

  const lightboxSlides = filteredImages.map((img) => ({
    src: img.src,
    alt: language === 'id' ? img.caption_id : img.caption_en,
  }));

  return (
    <section id="gallery" className="relative min-h-screen pt-12 pb-20 md:pt-16 md:pb-28 bg-background-alt overflow-hidden">
      <div className="absolute inset-0 section-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={t('gallery.title')}
          subtitle={t('gallery.subtitle')}
        />

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {GALLERY_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-accent text-white shadow-md shadow-accent/30 scale-105'
                  : 'bg-transparent text-primary border-2 border-primary hover:border-accent hover:text-accent'
              }`}
            >
              {language === 'id' ? category.label_id : category.label_en}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div ref={ref} className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={`${image.src}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.03,
                }}
                className="group relative break-inside-avoid rounded-xl overflow-hidden cursor-pointer bg-muted/50 border border-transparent shadow-sm hover:shadow-md transition-shadow"
                onClick={() => setLightboxIndex(index)}
              >
                {/* Natural Aspect Ratio Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={language === 'id' ? image.caption_id : image.caption_en}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <FaExpand className="text-white text-2xl md:text-3xl transform scale-50 group-hover:scale-100 transition-transform duration-300" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox */}
        <Lightbox
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          index={lightboxIndex}
          slides={lightboxSlides}
        />
      </div>
    </section>
  );
}
