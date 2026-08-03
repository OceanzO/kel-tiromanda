'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { POTENTIALS } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';
import {
  FaMapMarkedAlt, FaSeedling, FaCoffee, FaTheaterMasks,
  FaPalette, FaUtensils, FaMountain, FaTimes
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
  const [selectedPotential, setSelectedPotential] = useState<typeof POTENTIALS[0] | null>(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedPotential) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPotential]);

  return (
    <section id="potentials" className="relative pt-12 pb-20 md:pt-16 md:pb-28 bg-background overflow-hidden">
      <div className="absolute inset-0 section-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={t('potentials.title')}
          subtitle={t('potentials.subtitle')}
        />

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              className="group premium-card overflow-hidden cursor-pointer flex flex-col h-full"
              onClick={() => setSelectedPotential(potential)}
            >
              {/* Image */}
              <div className="relative h-48 shrink-0 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/15">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F3A2C]/70 via-transparent to-transparent z-10" />

                {/* Icon Overlay */}
                <div className="absolute top-4 right-4 z-20 w-12 h-12 rounded-xl bg-accent/20 backdrop-blur flex items-center justify-center text-accent text-xl group-hover:bg-accent group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  {iconMap[potential.icon] || <FaMapMarkedAlt />}
                </div>

                {/* Gradient background as placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-accent/20 group-hover:scale-110 transition-transform duration-700" />
                
                {/* Use potential image if available */}
                {potential.image && (
                  <Image 
                    src={potential.image} 
                    alt={language === 'id' ? potential.title_id : potential.title_en}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-110"
                  />
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="font-heading font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {language === 'id' ? potential.title_id : potential.title_en}
                </h3>
                <p className="text-foreground-muted text-sm leading-relaxed line-clamp-3">
                  {language === 'id' ? potential.description_id : potential.description_en}
                </p>
                <span className="inline-block mt-auto pt-4 text-primary text-sm font-medium group-hover:text-accent transition-colors">
                  {language === 'id' ? 'Baca selengkapnya →' : 'Read more →'}
                </span>
              </div>

              {/* Bottom Accent Line */}
              <div className="h-1 shrink-0 bg-gradient-to-r from-primary via-accent to-accent-dark transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedPotential && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedPotential(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-background rounded-2xl overflow-hidden shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPotential(null)}
                className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-primary transition-colors backdrop-blur-md"
              >
                <FaTimes />
              </button>

              {/* Image Area */}
              <div className="relative h-64 sm:h-80 w-full bg-black">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
                {selectedPotential.image ? (
                  <Image
                    src={selectedPotential.image}
                    alt={language === 'id' ? selectedPotential.title_id : selectedPotential.title_en}
                    fill
                    className="object-cover opacity-90"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-accent/50" />
                )}
                <div className="absolute bottom-6 left-6 sm:left-8 z-20 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-accent text-white flex items-center justify-center text-2xl shadow-lg">
                    {iconMap[selectedPotential.icon] || <FaMapMarkedAlt />}
                  </div>
                  <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white drop-shadow-md">
                    {language === 'id' ? selectedPotential.title_id : selectedPotential.title_en}
                  </h3>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 sm:p-8">
                <h4 className="text-lg font-semibold text-primary mb-3">
                  {language === 'id' ? 'Tentang Potensi Ini' : 'About This Potential'}
                </h4>
                <p className="text-foreground-muted leading-relaxed whitespace-pre-line text-base">
                  {language === 'id' ? selectedPotential.description_id : selectedPotential.description_en}
                </p>
                <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-foreground-muted text-sm italic">
                    {language === 'id' ? 'Konten lengkap untuk potensi ini dapat disesuaikan dan ditambahkan informasinya lebih lanjut melalui dashboard admin nantinya.' : 'Full content for this potential can be customized and updated further via the admin dashboard later.'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
