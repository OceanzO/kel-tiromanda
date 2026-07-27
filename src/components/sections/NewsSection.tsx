'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollAnimation from '@/components/ui/ScrollAnimation';

// Dummy data for news
const NEWS_ITEMS = [
  {
    id: 1,
    title_id: 'Kerja Bakti Rutin di Lingkungan Bulaan',
    title_en: 'Routine Community Cleanup in Bulaan Neighborhood',
    description_id: 'Masyarakat Lingkungan Bulaan mengadakan kerja bakti rutin untuk membersihkan lingkungan sekitar.',
    description_en: 'The people of Bulaan Neighborhood held a routine community cleanup to clean the surrounding area.',
    date: '24 Juli 2026',
    image: '/images/hero/hero_community.png'
  },
  {
    id: 2,
    title_id: 'Rapat Koordinasi Persiapan HUT RI ke-81',
    title_en: 'Coordination Meeting for the 81st Independence Day',
    description_id: 'Pemerintah Kelurahan Tiromanda bersama tokoh masyarakat menggelar rapat koordinasi.',
    description_en: 'The government of Tiromanda Village together with community figures held a coordination meeting.',
    date: '20 Juli 2026',
    image: '/images/hero/hero_panorama.png'
  },
  {
    id: 3,
    title_id: 'Kunjungan Wisatawan Mancanegara ke Tongkonan',
    title_en: 'Foreign Tourists Visit Tongkonan',
    description_id: 'Beberapa wisatawan mancanegara mengunjungi rumah adat Tongkonan di Tiromanda.',
    description_en: 'Several foreign tourists visited the traditional Tongkonan house in Tiromanda.',
    date: '15 Juli 2026',
    image: '/images/hero/hero_tongkonan.png'
  }
];

export default function NewsSection() {
  const { language, t } = useLanguage();

  return (
    <section id="news" className="relative py-20 md:py-28 bg-white dark:bg-[#0f1c15] overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={t('news.title')}
          subtitle={t('news.subtitle')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {NEWS_ITEMS.map((item, index) => (
            <ScrollAnimation key={item.id} variant="fadeUp" delay={index * 0.1}>
              <div className="premium-card group h-full flex flex-col bg-background overflow-hidden hover:-translate-y-2 transition-transform duration-300">
                {/* Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={item.image}
                    alt={language === 'id' ? item.title_id : item.title_en}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                    {item.date}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-heading font-bold text-lg text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {language === 'id' ? item.title_id : item.title_en}
                  </h3>
                  <p className="text-foreground-light text-sm flex-1 line-clamp-3">
                    {language === 'id' ? item.description_id : item.description_en}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                    <button className="text-primary font-semibold text-sm hover:text-accent transition-colors">
                      {language === 'id' ? 'Baca Selengkapnya →' : 'Read More →'}
                    </button>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
