'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { FACILITIES } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';
import { FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';

export default function FacilitiesSection() {
  const { language, t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="facilities" className="relative pt-12 pb-20 md:pt-16 md:pb-28 bg-background-alt overflow-hidden">
      <div className="absolute inset-0 section-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={t('facilities.title')}
          subtitle={t('facilities.subtitle')}
        />

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {FACILITIES.map((facility, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: index * 0.06,
                ease: 'easeOut',
              }}
              className="group relative h-48 sm:h-56 overflow-hidden rounded-2xl shadow-md cursor-pointer"
            >
              {/* Image Background */}
              {facility.image ? (
                <Image
                  src={facility.image}
                  alt={language === 'id' ? facility.name_id : facility.name_en}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                  <FaBuilding className="text-4xl text-primary/40" />
                </div>
              )}

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Counter Badge */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-white text-xs font-bold shadow-md border border-white/10 group-hover:bg-primary transition-colors duration-300 z-10">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end z-10">
                <h3 className="text-white font-heading font-bold text-sm sm:text-base drop-shadow-md group-hover:-translate-y-1 transition-transform duration-300 line-clamp-2">
                  {language === 'id' ? facility.name_id : facility.name_en}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
