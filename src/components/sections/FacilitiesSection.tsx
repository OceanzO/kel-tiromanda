'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FACILITIES } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';
import { FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';

export default function FacilitiesSection() {
  const { language, t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="facilities" className="relative py-20 md:py-28 bg-background-alt overflow-hidden">
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
              className="group premium-card overflow-hidden"
            >
              {/* Image Area */}
              <div className="relative h-36 overflow-hidden bg-gradient-to-br from-primary/15 to-accent/15">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaBuilding className="text-4xl text-primary/20 group-hover:text-primary/40 group-hover:scale-110 transition-all duration-500" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Counter Badge */}
                <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-primary/90 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-heading font-bold text-sm text-foreground mb-1.5 group-hover:text-accent transition-colors duration-300 line-clamp-1">
                  {language === 'id' ? facility.name_id : facility.name_en}
                </h3>
                <p className="text-foreground-muted text-xs leading-relaxed mb-3 line-clamp-2">
                  {language === 'id' ? facility.description_id : facility.description_en}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-primary/70 group-hover:text-accent/80 transition-colors">
                  <FaMapMarkerAlt className="text-[10px] flex-shrink-0" />
                  <span className="line-clamp-1">{facility.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
