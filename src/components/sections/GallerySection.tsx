'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Lightbox from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import 'yet-another-react-lightbox/styles.css';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { GALLERY_CATEGORIES } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';
import { FaExpand, FaSpinner, FaPlayCircle } from 'react-icons/fa';
import { createClient } from '@/lib/supabase/client';
import type { GalleryImage } from '@/lib/supabase/types';

const isVideo = (url: string) => {
  if (!url) return false;
  const urlWithoutParams = url.split('?')[0];
  const ext = urlWithoutParams.split('.').pop()?.toLowerCase() || '';
  return ['mp4', 'mov', 'webm', 'ogg', 'quicktime'].includes(ext);
};

export default function GallerySection() {
  const { language, t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [showAll, setShowAll] = useState(false);
  const [images, setImages] = useState<{src: string, category: string, caption_id: string, caption_en: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    const fetchImages = async () => {
      const { data } = await supabase.from('gallery').select('*').order('display_order');
      if (data) {
        setImages(data.map((d: any) => ({
          src: d.image_url,
          category: d.category,
          caption_id: d.caption_id,
          caption_en: d.caption_en
        })));
      }
      setLoading(false);
    };
    
    fetchImages();

    // Berlangganan (subscribe) ke pembaruan real-time dari Supabase
    const channel = supabase
      .channel('realtime-gallery')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gallery' },
        (payload) => {
          // Re-fetch data setiap kali ada perubahan (insert/update/delete) di admin
          fetchImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredImages = activeCategory === 'all'
    ? images
    : images.filter((img) => img.category === activeCategory);
    
  const displayedImages = showAll ? filteredImages : filteredImages.slice(0, 12);

  const lightboxSlides = displayedImages.map((img) => {
    if (isVideo(img.src)) {
      const ext = img.src.split('?')[0].split('.').pop()?.toLowerCase() || 'mp4';
      const type = ext === 'mov' || ext === 'quicktime' ? 'video/quicktime' : `video/${ext}`;
      return {
        type: "video" as const,
        width: 1280,
        height: 720,
        autoPlay: true,
        sources: [
          {
            src: img.src,
            type: type,
          },
        ],
      };
    }
    return {
      src: img.src,
      alt: language === 'id' ? img.caption_id : img.caption_en,
    };
  });

  // Reset showAll when category changes
  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  return (
    <section id="gallery" ref={ref} className="relative min-h-screen pt-6 pb-20 md:pt-10 md:pb-28 bg-background-alt overflow-hidden">
      <div className="absolute inset-0 section-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={t('gallery.title')}
          subtitle={t('gallery.subtitle')}
        />

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {GALLERY_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-accent text-white shadow-md shadow-accent/30 scale-105'
                  : 'bg-transparent text-primary border-2 border-primary hover:border-accent hover:text-accent'
              }`}
            >
              {language === 'id' ? category.label_id : category.label_en}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-4xl text-accent" />
          </div>
        ) : (
          <>
            {/* Grid Layout (Row by Row) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <AnimatePresence mode="popLayout">
                {displayedImages.map((image, index) => (
                  <motion.div
                    key={`${image.src}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.03,
                    }}
                    className="group relative rounded-xl overflow-hidden cursor-pointer bg-muted/50 border border-transparent shadow-sm hover:shadow-md transition-shadow"
                    onClick={() => setLightboxIndex(index)}
                  >
                    {/* Natural Aspect Ratio Image/Video */}
                    {isVideo(image.src) ? (
                      <div className="relative w-full aspect-video">
                        <video src={image.src} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" muted loop playsInline autoPlay={false} />
                        <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5 backdrop-blur-sm z-10">
                          <FaPlayCircle className="text-white text-lg" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full aspect-video bg-black/10">
                        <Image
                          src={image.src}
                          alt={language === 'id' ? image.caption_id : image.caption_en}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 transform-gpu will-change-transform"
                          priority={index < 2}
                        />
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <FaExpand className="text-white text-2xl md:text-3xl transform scale-50 group-hover:scale-100 transition-transform duration-300" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* See More / Show Less Button */}
            {filteredImages.length > 12 && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-8 py-3 bg-accent hover:bg-accent-light text-white font-bold rounded-full shadow-md transition-all hover:scale-105 hover:shadow-lg"
                >
                  {showAll 
                    ? (language === 'id' ? 'Tampilkan Lebih Sedikit' : 'Show Less')
                    : (language === 'id' ? 'Lihat Selengkapnya' : 'See More')}
                </button>
              </div>
            )}
            
            {displayedImages.length === 0 && (
              <div className="mt-12 text-center text-foreground-muted">
                Tidak ada data di kategori ini.
              </div>
            )}
          </>
        )}

        {/* Lightbox */}
        <Lightbox
          plugins={[Video]}
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          index={lightboxIndex}
          slides={lightboxSlides}
        />
      </div>
    </section>
  );
}
