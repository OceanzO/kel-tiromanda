'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { FACILITIES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import type { Facility } from '@/lib/supabase/types';
import SectionTitle from '@/components/ui/SectionTitle';
import { FaBuilding } from 'react-icons/fa';

export default function FacilitiesSection() {
  const { language, t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // default true to prevent layout shift on mobile

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchFacilities = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('facilities')
        .select('*')
        .order('display_order', { ascending: true });

      if (data && data.length > 0) {
        setFacilities(data);
      }
    };

    fetchFacilities();
  }, []);

  const displayData = facilities.length > 0 ? facilities : FACILITIES;
  const limit = isMobile ? 4 : 8;
  const visibleData = isExpanded ? displayData : displayData.slice(0, limit);

  return (
    <section id="facilities" className="relative pt-6 pb-20 md:pt-10 md:pb-28 bg-background-alt overflow-hidden">
      <div className="absolute inset-0 section-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={t('facilities.title')}
          subtitle={t('facilities.subtitle')}
        />

        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {visibleData.map((facility, index) => (
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
                {((facility as any).image_url || ('image' in facility && facility.image)) ? (
                  <Image
                    src={(facility as any).image_url || ('image' in facility ? facility.image : '') || ''}
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

        {displayData.length > limit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 flex justify-center"
          >
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-8 py-3 bg-accent hover:bg-accent-light text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              {isExpanded ? (language === 'id' ? 'Tampilkan Lebih Sedikit' : 'Show Less') : (language === 'id' ? 'Lihat Selengkapnya' : 'See More')}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
