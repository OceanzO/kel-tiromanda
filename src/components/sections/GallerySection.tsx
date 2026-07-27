'use client';

import { useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { useLanguage } from '@/context/LanguageContext';
import { GALLERY_IMAGES, GALLERY_CATEGORIES } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';
import { FaSearch, FaExpand } from 'react-icons/fa';

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
    <section id="gallery" className="relative py-20 md:py-28 bg-background-alt overflow-hidden">
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
        <div ref={ref} className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={`${image.src}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  layout: { duration: 0.3 },
                }}
                className="group relative break-inside-avoid overflow-hidden rounded-xl cursor-pointer"
                onClick={() => setLightboxIndex(index)}
              >
                <div className={`relative w-full overflow-hidden bg-gradient-to-br from-primary/15 to-accent/15 ${
                  index % 3 === 0 ? 'aspect-[4/5]' : index % 3 === 1 ? 'aspect-square' : 'aspect-[4/3]'
                }`}>
                  <Image
                    src={image.src}
                    alt={language === 'id' ? image.caption_id : image.caption_en}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4">
                    <FaExpand className="text-white text-2xl mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300" />
                    <p className="text-white text-sm font-medium text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {language === 'id' ? image.caption_id : image.caption_en}
                    </p>
                    <span className="text-white/60 text-xs mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                      {language === 'id'
                        ? GALLERY_CATEGORIES.find((c) => c.id === image.category)?.label_id
                        : GALLERY_CATEGORIES.find((c) => c.id === image.category)?.label_en
                      }
                    </span>
                  </div>
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
