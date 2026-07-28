'use client';

import { useLanguage } from '@/context/LanguageContext';
import { LOCATION } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollAnimation from '@/components/ui/ScrollAnimation';

export default function InfographicsSection() {
  const { language, t } = useLanguage();

  return (
    <section id="infografis" className="relative pt-12 pb-20 md:pt-16 md:pb-28 bg-background overflow-hidden">
      <div className="absolute inset-0 section-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={t('infographics.title')}
          subtitle={t('infographics.subtitle')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Infographic Map */}
          <ScrollAnimation variant="slideLeft">
            <div className="premium-card overflow-hidden h-full min-h-[400px] bg-white flex flex-col">
               <div className="p-4 bg-primary/10 border-b border-primary/20">
                 <h3 className="font-heading font-bold text-lg text-primary text-center">
                   {language === 'id' ? 'Peta Infografis' : 'Infographic Map'}
                 </h3>
               </div>
               <div className="flex-1 relative flex items-center justify-center p-4">
                 {/* Replace this with actual infographic map image when available */}
                 <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                   <p className="text-gray-400 font-medium text-center px-6">
                     {language === 'id' ? 'Gambar Peta Infografis Akan Ditampilkan Di Sini' : 'Infographic Map Image Will Be Displayed Here'}
                   </p>
                 </div>
               </div>
            </div>
          </ScrollAnimation>

          {/* Google Maps Embed */}
          <ScrollAnimation variant="slideRight">
            <div className="premium-card overflow-hidden h-full min-h-[400px] flex flex-col">
               <div className="p-4 bg-accent/10 border-b border-accent/20">
                 <h3 className="font-heading font-bold text-lg text-accent text-center">
                   {language === 'id' ? 'Lokasi Google Maps' : 'Google Maps Location'}
                 </h3>
               </div>
               <div className="flex-1">
                 <iframe
                   src={LOCATION.maps_embed}
                   width="100%"
                   height="100%"
                   style={{ border: 0, minHeight: '400px' }}
                   allowFullScreen
                   loading="lazy"
                   referrerPolicy="no-referrer-when-downgrade"
                   title="Google Maps — Kelurahan Tiromanda"
                   className="w-full h-full"
                 />
               </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
