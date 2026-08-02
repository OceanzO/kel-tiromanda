'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { OFFICIALS } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';
import { FaPhone, FaUserTie, FaWhatsapp } from 'react-icons/fa';

interface OfficialCardProps {
  name: string;
  position: string;
  phone: string;
  photo: string;
  featured?: boolean;
  delay?: number;
}

function OfficialCard({ name, position, phone, featured = false, delay = 0 }: OfficialCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={`group premium-card p-5 text-center flex flex-col items-center ${
        featured ? 'border-2 border-accent/30 shadow-lg' : ''
      }`}
    >
      {/* Photo Placeholder */}
      <div className={`relative ${featured ? 'w-28 h-28' : 'w-20 h-20'} rounded-full overflow-hidden mb-4 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300`}>
        <FaUserTie className={`${featured ? 'text-4xl' : 'text-2xl'} text-primary/50`} />
        <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-accent/50 transition-colors duration-300" />
      </div>

      {/* Badge */}
      {featured && (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/15 text-accent-dark text-xs font-semibold mb-2 border border-accent/30">
          ⭐ Lurah
        </span>
      )}

      {/* Info */}
      <h4 className="font-heading font-bold text-sm md:text-base text-foreground mb-1 group-hover:text-primary transition-colors">
        {name}
      </h4>
      <div className={`h-0.5 w-10 rounded-full bg-accent mb-2 mx-auto ${featured ? 'w-16' : 'w-8'}`} />
      <p className="text-foreground-muted text-xs mb-3">{position}</p>
      <a
        href={phone !== '-' ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}` : '#'}
        target={phone !== '-' ? '_blank' : undefined}
        rel={phone !== '-' ? 'noopener noreferrer' : undefined}
        className="flex items-center gap-1.5 text-xs text-primary hover:text-accent transition-colors"
      >
        <FaWhatsapp className="text-[10px]" />
        {phone}
      </a>
    </motion.div>
  );
}

export default function GovernmentSection() {
  const { language, t } = useLanguage();

  return (
    <section id="government" className="relative pt-12 pb-20 md:pt-16 md:pb-28 bg-background-alt overflow-hidden">
      <div className="absolute inset-0 section-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={t('government.title')}
          subtitle={t('government.subtitle')}
        />

        {/* === LEVEL 1: Village Head === */}
        <div className="mb-4">
          <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground text-center mb-8">
            {t('government.village_head')}
          </h3>
          <div className="flex justify-center mb-4">
            <div className="w-full max-w-xs">
              <OfficialCard
                name={OFFICIALS.lurah.name}
                position={language === 'id' ? OFFICIALS.lurah.position_id : OFFICIALS.lurah.position_en}
                phone={OFFICIALS.lurah.phone}
                photo={OFFICIALS.lurah.photo}
                delay={0}
              />
            </div>
          </div>
        </div>

        {/* Spacer before Staff */}
        <div className="h-4" />

        {/* === LEVEL 2: Staff === */}
        <div className="mb-4">
          <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground text-center mb-8">
            {t('government.staff')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
            {OFFICIALS.staff.map((official, index) => (
              <div key={index} className="relative">
                <OfficialCard
                  name={official.name}
                  position={language === 'id' ? official.position_id : official.position_en}
                  phone={official.phone}
                  photo={official.photo}
                  delay={0.1 * (index + 1)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Spacer before Neighborhoods */}
        <div className="h-8" />

        {/* === LEVEL 3: Neighborhoods === */}
        <div className="mb-4">
          <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground text-center mb-8">
            {t('government.neighborhoods')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {OFFICIALS.neighborhoods.map((neighborhood, nIndex) => (
              <motion.div
                key={nIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: nIndex * 0.1 }}
                className="premium-card p-6"
              >
                {/* Neighborhood Header */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-accent font-bold text-sm">{nIndex + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-base text-foreground">
                      {language === 'id' ? neighborhood.name_id : neighborhood.name_en}
                    </h4>
                    <p className="text-xs text-foreground-muted">
                      {neighborhood.head.name === '-' && neighborhood.head.phone === '-' ? (
                        '-'
                      ) : (
                        <>
                          {neighborhood.head.name} - <a href={neighborhood.head.phone !== '-' ? `https://wa.me/${neighborhood.head.phone.replace(/[^0-9]/g, '')}` : '#'} target={neighborhood.head.phone !== '-' ? '_blank' : undefined} rel={neighborhood.head.phone !== '-' ? 'noopener noreferrer' : undefined} className="text-primary hover:underline">{neighborhood.head.phone}</a>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* RT Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {neighborhood.rts.map((rt, rtIndex) => (
                    <div
                      key={rtIndex}
                      className="group bg-background/60 rounded-xl p-4 text-center hover:bg-primary/5 transition-colors duration-300 border border-transparent hover:border-primary/10"
                    >
                      <span className="inline-block px-2 py-0.5 rounded-full bg-accent/15 text-accent-dark text-[10px] font-bold mb-1.5 border border-accent/20">
                        {rt.position}
                      </span>
                      <p className="text-xs font-medium text-foreground">{rt.name}</p>
                      <a
                        href={rt.phone !== '-' ? `https://wa.me/${rt.phone.replace(/[^0-9]/g, '')}` : '#'}
                        target={rt.phone !== '-' ? '_blank' : undefined}
                        rel={rt.phone !== '-' ? 'noopener noreferrer' : undefined}
                        className="flex items-center justify-center gap-1 text-[10px] text-primary mt-1 hover:underline"
                      >
                        <FaWhatsapp className="text-[8px]" />
                        {rt.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
