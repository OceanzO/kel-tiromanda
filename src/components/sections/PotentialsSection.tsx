'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { POTENTIALS } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';
import {
  FaMapMarkedAlt, FaSeedling, FaCoffee, FaTheaterMasks,
  FaPalette, FaUtensils, FaMountain,
} from 'react-icons/fa';
import { GiBuffaloHead } from 'react-icons/gi';

const iconMap: Record<string, React.ReactNode> = {
  FaMapMarkedAlt: <FaMapMarkedAlt />,
  FaSeedling: <FaSeedling />,
  FaCoffee: <FaCoffee />,
  GiBuffaloHead: <GiBuffaloHead />,
  FaTheaterMasks: <FaTheaterMasks />,
  FaPalette: <FaPalette />,
  FaUtensils: <FaUtensils />,
  FaMountain: <FaMountain />,
};

export default function PotentialsSection() {
  const { language, t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="potentials" className="relative pt-12 pb-20 md:pt-16 md:pb-28 bg-background overflow-hidden">
      <div className="absolute inset-0 section-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={t('potentials.title')}
          subtitle={t('potentials.subtitle')}
        />

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POTENTIALS.map((potential, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="group premium-card overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/15">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F3A2C]/70 via-transparent to-transparent z-10" />

                {/* Icon Overlay */}
                <div className="absolute top-4 right-4 z-20 w-12 h-12 rounded-xl bg-accent/20 backdrop-blur flex items-center justify-center text-accent text-xl group-hover:bg-accent group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  {iconMap[potential.icon] || <FaMapMarkedAlt />}
                </div>

                {/* Gradient background as placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-accent/20 group-hover:scale-110 transition-transform duration-700" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-heading font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {language === 'id' ? potential.title_id : potential.title_en}
                </h3>
                <p className="text-foreground-muted text-sm leading-relaxed">
                  {language === 'id' ? potential.description_id : potential.description_en}
                </p>
              </div>

              {/* Bottom Accent Line */}
              <div className="h-1 bg-gradient-to-r from-primary via-accent to-accent-dark transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
