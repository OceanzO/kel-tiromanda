'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { FACILITIES } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';
import { FaBuilding } from 'react-icons/fa';

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
              className="bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col group cursor-pointer border border-transparent"
            >
              {/* Image Area */}
              <div className="relative h-48 sm:h-52 w-full shrink-0 overflow-hidden">
                {facility.image ? (
                  <Image
                    src={facility.image}
                    alt={language === 'id' ? facility.name_id : facility.name_en}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                    <FaBuilding className="text-4xl text-muted-foreground/40" />
                  </div>
                )}
              </div>
              
              {/* Text Area */}
              <div className="px-4 py-3 flex-grow flex items-center justify-center text-center">
                <h3 className="text-foreground font-medium text-sm sm:text-base line-clamp-2">
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
