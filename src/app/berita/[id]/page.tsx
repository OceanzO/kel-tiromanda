'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import { NEWS_ITEMS, NewsItem } from '@/lib/constants';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function NewsDetail() {
  const { id } = useParams();
  const { language } = useLanguage();

  const newsItem = NEWS_ITEMS.find((item: NewsItem) => item.id === id);



  if (!newsItem) {
    return (
      <>
        <Navbar forceBackground />
        <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-background">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {language === 'id' ? 'Berita tidak ditemukan' : 'News not found'}
          </h1>
          <Link
            href="/#news"
            scroll={false}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            {language === 'id' ? 'Kembali' : 'Go Back'}
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar forceBackground />
      <main className="min-h-screen bg-background relative">
        
        {/* Full Screen Hero Image — lighter gradient so photo is visible */}
        <div className="relative w-full h-[55vh] md:h-[65vh] lg:h-[72vh] bg-background overflow-hidden group">
          <Image
            src={newsItem.image}
            alt={language === 'id' ? newsItem.title_id : newsItem.title_en}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          
          {/* Lighter gradient — only bottom third fades out, top stays clear */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          {/* Date Badge positioned over the image */}
          <div className="absolute top-28 right-4 md:right-8 bg-accent/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 font-bold text-sm tracking-wider uppercase">
            <FaCalendarAlt />
            <span>{language === 'id' ? newsItem.date_id : newsItem.date_en}</span>
          </div>
        </div>

        {/* Header Content — sits BELOW the image, not overlaid */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground leading-tight">
            {language === 'id' ? newsItem.title_id : newsItem.title_en}
          </h1>

          <div className="mt-4 h-1 w-16 bg-primary rounded-full" />
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <article className="prose prose-lg dark:prose-invert max-w-none">
            {(language === 'id' ? newsItem.description_id : newsItem.description_en)
              .split('\n')
              .map((paragraph: string, index: number) => (
                <p key={index} className="text-foreground-light leading-relaxed mb-6 text-justify text-lg md:text-xl">
                  {paragraph}
                </p>
              ))}
          </article>

          {/* Bottom back button */}
          <div className="mt-10 pt-8 border-t border-foreground/10">
            <Link
              href="/#news"
              scroll={false}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-white shadow-lg hover:bg-primary/90 active:scale-95 transition-all duration-200 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
              {language === 'id' ? 'Kembali ke Berita' : 'Back to News'}
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
