'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { OFFICIALS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import type { Official } from '@/lib/supabase/types';
import SectionTitle from '@/components/ui/SectionTitle';
import { FaUserTie } from 'react-icons/fa';

interface OfficialCardProps {
  name: string;
  position: string;
  photo: string;
  featured?: boolean;
  delay?: number;
}

function OfficialCard({ name, position, featured = false, delay = 0 }: OfficialCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={`group premium-card p-6 text-center flex flex-col items-center justify-center ${
        featured ? 'border-2 border-accent/30 shadow-xl' : 'hover:shadow-lg'
      } transition-shadow duration-300`}
    >
      {/* Photo Placeholder */}
      <div className={`relative ${featured ? 'w-32 h-32' : 'w-24 h-24'} rounded-full overflow-hidden mb-5 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-inner`}>
        <FaUserTie className={`${featured ? 'text-5xl' : 'text-4xl'} text-primary/40`} />
        <div className="absolute inset-0 rounded-full border border-primary/20 group-hover:border-accent/50 transition-colors duration-300" />
      </div>


      {/* Info */}
      <h4 className={`font-heading font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors ${featured ? 'text-xl' : 'text-lg'}`}>
        {name}
      </h4>
      <div className={`h-1 rounded-full bg-gradient-to-r from-primary to-accent mb-3 mx-auto ${featured ? 'w-20' : 'w-12'} opacity-70`} />
      <p className={`text-foreground-muted font-medium ${featured ? 'text-base' : 'text-sm'}`}>{position}</p>
    </motion.div>
  );
}

export default function GovernmentSection() {
  const { language, t } = useLanguage();
  const [officials, setOfficials] = useState<Official[]>([]);

  useEffect(() => {
    const fetchOfficials = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('officials')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (data) setOfficials(data);
    };

    fetchOfficials();
  }, []);

  const lurah = officials.find(o => o.type === 'lurah') || {
    name: OFFICIALS.lurah.name,
    position_id: OFFICIALS.lurah.position_id,
    position_en: OFFICIALS.lurah.position_en,
    photo_url: OFFICIALS.lurah.photo
  };

  const staff = officials.filter(o => o.type === 'staff').length > 0 
    ? officials.filter(o => o.type === 'staff')
    : OFFICIALS.staff.map(s => ({
        id: s.name,
        name: s.name,
        position_id: s.position_id,
        position_en: s.position_en,
        photo_url: s.photo,
        type: 'staff' as const,
        phone: '',
        display_order: 0,
        created_at: ''
      }));

  return (
    <section id="government" className="relative pt-12 pb-20 md:pt-16 md:pb-28 bg-background-alt overflow-hidden">
      <div className="absolute inset-0 section-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={t('government.title')}
          subtitle={t('government.subtitle')}
        />

        {/* === LEVEL 1: Village Head === */}
        <div className="mb-6">
          <h3 className="font-heading font-bold text-2xl md:text-3xl text-foreground text-center mb-10">
            {t('government.village_head')}
          </h3>
          <div className="flex justify-center mb-6">
            <div className="w-full max-w-sm">
              <OfficialCard
                name={lurah.name}
                position={language === 'id' ? lurah.position_id : (lurah.position_en || lurah.position_id)}
                photo={lurah.photo_url || ''}
                featured={true}
                delay={0}
              />
            </div>
          </div>
        </div>

        {/* Spacer before Staff */}
        <div className="h-8" />

        {/* === LEVEL 2: Staff === */}
        <div className="mb-8">
          <h3 className="font-heading font-bold text-2xl md:text-3xl text-foreground text-center mb-10">
            {t('government.staff')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-4">
            {staff.map((official, index) => (
              <div key={index} className="relative h-full">
                <OfficialCard
                  name={official.name}
                  position={language === 'id' ? official.position_id : (official.position_en || official.position_id)}
                  photo={official.photo_url || ''}
                  delay={0.1 * (index + 1)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Spacer before Neighborhoods */}
        <div className="h-12" />

        {/* === LEVEL 3: Neighborhoods === */}
        <div className="mb-4">
          <h3 className="font-heading font-bold text-2xl md:text-3xl text-foreground text-center mb-10">
            {t('government.neighborhoods')}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {OFFICIALS.neighborhoods.map((neighborhood, nIndex) => (
              <motion.div
                key={nIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: nIndex * 0.1 }}
                className="premium-card p-6 md:p-8 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Neighborhood Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-6 border-b border-border/50">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shadow-inner border border-primary/10">
                    <span className="text-accent font-black text-xl">{nIndex + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xl text-foreground mb-1.5">
                      {language === 'id' ? neighborhood.name_id : neighborhood.name_en}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-primary/80 uppercase tracking-wide">
                        {language === 'id' ? 'Kepala Lingkungan:' : 'Head of Neighborhood:'}
                      </span>
                      <span className="text-base font-bold text-foreground-muted">{neighborhood.head.name}</span>
                    </div>
                  </div>
                </div>

                {/* RT Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {neighborhood.rts.map((rt, rtIndex) => (
                    <div
                      key={rtIndex}
                      className="group bg-background/50 hover:bg-background rounded-xl p-5 text-center transition-all duration-300 border border-transparent hover:border-accent/40 shadow-sm hover:shadow-md flex flex-col justify-center items-center min-h-[100px]"
                    >
                      <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-bold text-sm mb-2 border border-primary/10">
                        {rt.position}
                      </span>
                      <p className="text-base font-bold text-foreground group-hover:text-accent transition-colors">{rt.name}</p>
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
