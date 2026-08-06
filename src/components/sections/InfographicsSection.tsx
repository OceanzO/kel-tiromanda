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

        <div className="flex flex-col gap-8">
          {/* Infographic Map - Full Width */}
          <ScrollAnimation variant="fadeUp">
            <div className="premium-card overflow-hidden w-full min-h-[400px] lg:min-h-[500px] bg-white flex flex-col">
               <div className="p-4 bg-primary/10 border-b border-primary/20">
                 <h3 className="font-heading font-bold text-lg text-primary text-center">
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

            {/* Geographical Conditions Description */}
            <ScrollAnimation variant="slideRight">
              <div className="premium-card overflow-hidden h-full flex flex-col p-6 lg:p-8 bg-white border border-gray-100">
                <h3 className="font-heading font-bold text-2xl text-primary mb-6 border-b pb-4">
                  {language === 'id' ? 'Kondisi Geografis & Batas Wilayah' : 'Geographical Conditions & Boundaries'}
                </h3>
                
                <div className="space-y-6 flex-1">
                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-2 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      </span>
                      {language === 'id' ? 'Letak Geografis' : 'Geographical Location'}
                    </h4>
                    <p className="text-gray-600 leading-relaxed ml-11">
                      {language === 'id' 
                        ? 'Kelurahan Tiromanda terletak di wilayah yang strategis dengan topografi yang beragam, mencakup area pemukiman dan potensi alam yang kaya.'
                        : 'Tiromanda Village is located in a strategic area with diverse topography, including residential areas and rich natural potential.'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center mr-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                      </span>
                      {language === 'id' ? 'Batas Wilayah' : 'Regional Boundaries'}
                    </h4>
                    <ul className="space-y-3 ml-11">
                      <li className="flex">
                        <span className="font-semibold text-gray-700 w-24">{language === 'id' ? 'Utara' : 'North'}:</span>
                        <span className="text-gray-600">{language === 'id' ? 'Berbatasan dengan ...' : 'Bordered by ...'}</span>
                      </li>
                      <li className="flex">
                        <span className="font-semibold text-gray-700 w-24">{language === 'id' ? 'Timur' : 'East'}:</span>
                        <span className="text-gray-600">{language === 'id' ? 'Berbatasan dengan ...' : 'Bordered by ...'}</span>
                      </li>
                      <li className="flex">
                        <span className="font-semibold text-gray-700 w-24">{language === 'id' ? 'Selatan' : 'South'}:</span>
                        <span className="text-gray-600">{language === 'id' ? 'Berbatasan dengan ...' : 'Bordered by ...'}</span>
                      </li>
                      <li className="flex">
                        <span className="font-semibold text-gray-700 w-24">{language === 'id' ? 'Barat' : 'West'}:</span>
                        <span className="text-gray-600">{language === 'id' ? 'Berbatasan dengan ...' : 'Bordered by ...'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
