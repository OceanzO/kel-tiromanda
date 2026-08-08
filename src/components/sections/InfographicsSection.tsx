'use client';

import { useLanguage } from '@/context/LanguageContext';
import { LOCATION } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollAnimation from '@/components/ui/ScrollAnimation';

export default function InfographicsSection() {
  const { language, t } = useLanguage();

  return (
    <section id="infografis" className="relative pt-6 pb-20 md:pt-10 md:pb-28 bg-background overflow-hidden">
      <div className="absolute inset-0 section-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={t('infographics.title')}
          subtitle={t('infographics.subtitle')}
        />

        <div className="flex flex-col gap-8">
          {/* Infographic Map - Full Width */}
          <ScrollAnimation variant="fadeUp">
            <div className="premium-card overflow-hidden w-full min-h-[400px] lg:min-h-[500px] bg-white flex flex-col">
               <div className="p-4 bg-primary/10 border-b border-primary/20">
                 <h3 className="font-heading font-bold text-lg text-yellow-500 text-center">
                   {language === 'id' ? 'Peta Infografis' : 'Infographic Map'}
                 </h3>
               </div>
               <div className="flex-1 relative flex items-center justify-center p-4 min-h-[400px] lg:min-h-[500px]">
                 {/* Replace this with actual infographic map image when available */}
                 <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                   <p className="text-gray-400 font-medium text-center px-6">
                     {language === 'id' ? 'Gambar Peta Infografis Akan Ditampilkan Di Sini' : 'Infographic Map Image Will Be Displayed Here'}
                   </p>
                 </div>
               </div>
            </div>
          </ScrollAnimation>

          {/* Second Row: Google Maps & Geographic Conditions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Google Maps Embed */}
            <ScrollAnimation variant="slideLeft">
              <div id="lokasi-maps" className="premium-card overflow-hidden h-full min-h-[400px] flex flex-col">
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

            {/* Geographical Conditions & Boundaries */}
            <ScrollAnimation variant="slideRight" className="h-full">
              <div className="flex flex-col gap-6 h-full">
                
                {/* Geographic Conditions Frame */}
                <div className="premium-card flex flex-col p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <h4 className="font-bold text-lg text-foreground">
                      {language === 'id' ? 'Kondisi Geografis' : 'Geographical Conditions'}
                    </h4>
                  </div>
                  <p className="text-foreground-muted leading-relaxed mb-4 text-sm sm:text-base">
                    {language === 'id' 
                      ? 'Kelurahan Tiromanda merupakan wilayah dengan karakteristik geografis sebagai berikut:'
                      : 'Tiromanda Village is an area with the following geographical characteristics:'}
                  </p>
                  <ul className="space-y-3 text-foreground-muted text-sm sm:text-base">
                    <li className="flex items-start">
                      <strong className="w-32 flex-shrink-0 text-foreground">{language === 'id' ? 'Ketinggian' : 'Altitude'}:</strong>
                      <span>±806 mdpl</span>
                    </li>
                    <li className="flex items-start">
                      <strong className="w-32 flex-shrink-0 text-foreground">{language === 'id' ? 'Koordinat' : 'Coordinates'}:</strong>
                      <span>
                        3°6′46.08″ {language === 'id' ? 'LS' : 'S'}, 119°49′48.83″ {language === 'id' ? 'BT' : 'E'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <strong className="w-32 flex-shrink-0 text-foreground">{language === 'id' ? 'Kode Pos' : 'Postal Code'}:</strong>
                      <span>91815</span>
                    </li>
                    <li className="flex items-start">
                      <strong className="w-32 flex-shrink-0 text-foreground">{language === 'id' ? 'Kode Wilayah' : 'Area Code'}:</strong>
                      <span>73.18.29.1001</span>
                    </li>
                    <li className="flex items-start">
                      <strong className="w-32 flex-shrink-0 text-foreground">{language === 'id' ? 'Status' : 'Status'}:</strong>
                      <span>{language === 'id' ? 'Kelurahan' : 'Village'}</span>
                    </li>
                    <li className="flex items-start">
                      <strong className="w-32 flex-shrink-0 text-foreground">{language === 'id' ? 'Zona Waktu' : 'Time Zone'}:</strong>
                      <span>WITA (UTC+08.00)</span>
                    </li>
                  </ul>
                </div>

                {/* Boundaries Frame */}
                <div className="premium-card flex flex-col p-6 lg:p-8 flex-1 justify-center">
                  <h4 className="font-bold text-lg mb-3 flex items-center text-primary">
                    {language === 'id' ? 'Berbatasan / bersebelahan dengan' : 'Bordered / adjacent to'}
                  </h4>
                  <p className="text-foreground-muted text-base sm:text-lg leading-relaxed">
                    {language === 'id' ? 'Kelurahan ' : 'Village of '}Lamunan &middot; Tosapan &middot; Sandabilik &middot; Pasang
                  </p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
