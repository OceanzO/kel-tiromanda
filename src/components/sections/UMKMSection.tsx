'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { UMKM_PRODUCTS } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';
import { FaWhatsapp, FaShoppingBag } from 'react-icons/fa';

export default function UMKMSection() {
  const { language, t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="umkm" className="relative py-20 md:py-28 bg-background overflow-hidden">
      <div className="absolute inset-0 section-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={t('umkm.title')}
          subtitle={t('umkm.subtitle')}
        />

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {UMKM_PRODUCTS.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="group premium-card overflow-hidden flex flex-col"
            >
              {/* Product Image Area */}
              <div className="relative h-44 overflow-hidden bg-gradient-to-br from-accent/15 via-primary/10 to-secondary/15">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaShoppingBag className="text-5xl text-accent/20 group-hover:text-accent/40 group-hover:scale-110 transition-all duration-500" />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-xs font-medium">
                    {language === 'id' ? product.description_id : product.description_en}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-heading font-bold text-base text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {language === 'id' ? product.name_id : product.name_en}
                </h3>
                <p className="text-foreground-muted text-xs leading-relaxed mb-4 flex-1 line-clamp-2">
                  {language === 'id' ? product.description_id : product.description_en}
                </p>

                {/* WhatsApp CTA */}
                <a
                  href={`https://wa.me/${product.contact.replace(/[\s\-\+]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-xl text-xs font-semibold transition-all duration-300 group-hover:shadow-md group-hover:shadow-accent/25"
                >
                  <FaWhatsapp className="text-sm" />
                  {t('umkm.contact_btn')}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
