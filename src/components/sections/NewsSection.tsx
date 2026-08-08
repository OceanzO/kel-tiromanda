'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollAnimation from '@/components/ui/ScrollAnimation';
import Link from 'next/link';

import { NEWS_ITEMS, NewsItem } from '@/lib/constants';

export default function NewsSection() {
  const { language, t } = useLanguage();

  return (
    <section id="news" className="relative min-h-[85vh] flex flex-col pt-6 pb-20 md:pt-10 md:pb-28 bg-background overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={t('news.title')}
          subtitle={t('news.subtitle')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {NEWS_ITEMS.map((item: NewsItem, index: number) => (
            <ScrollAnimation key={item.id} variant="fadeUp" delay={index * 0.1}>
              <div className="premium-card group h-full flex flex-col bg-background overflow-hidden hover:-translate-y-2 transition-transform duration-300">
                {/* Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={item.image}
                    alt={language === 'id' ? item.title_id : item.title_en}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                    {language === 'id' ? item.date_id : item.date_en}
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
                    <Link href={`/berita/${item.id}`} className="text-primary font-semibold text-sm hover:text-accent transition-colors">
                      {language === 'id' ? 'Baca Selengkapnya →' : 'Read More →'}
                    </Link>
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
