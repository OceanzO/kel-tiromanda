'use client';

import { useLanguage } from '@/context/LanguageContext';
import { LOCATION, CONTACTS } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollAnimation from '@/components/ui/ScrollAnimation';
import { FaMapMarkerAlt, FaClock, FaPhone, FaEnvelope, FaExternalLinkAlt, FaDirections } from 'react-icons/fa';

export default function LocationSection() {
  const { language, t } = useLanguage();

  const phoneContact = CONTACTS.find((c) => c.type === 'phone');
  const emailContact = CONTACTS.find((c) => c.type === 'email');

  return (
    <section id="location" className="relative py-20 md:py-28 bg-background overflow-hidden">
      <div className="absolute inset-0 section-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={t('location.title')}
          subtitle={t('location.subtitle')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Google Maps Embed */}
          <ScrollAnimation variant="slideLeft">
            <div className="premium-card overflow-hidden h-full min-h-[400px]">
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
          </ScrollAnimation>

          {/* Location Info */}
          <ScrollAnimation variant="slideRight">
            <div className="space-y-6">
              {/* Address Card */}
              <div className="premium-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-primary text-xl" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                      {t('location.address')}
                    </h3>
                    <p className="text-foreground-light text-sm leading-relaxed">
                      {language === 'id' ? LOCATION.address_id : LOCATION.address_en}
                    </p>
                  </div>
                </div>
              </div>

              {/* Office Hours Card */}
              <div className="premium-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <FaClock className="text-accent text-xl" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                      {t('location.office_hours')}
                    </h3>
                    <p className="text-foreground-light text-sm">
                      {language === 'id' ? LOCATION.office_hours_id : LOCATION.office_hours_en}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info Card */}
              <div className="premium-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-secondary text-xl" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-foreground mb-3">
                      {t('location.contact_info')}
                    </h3>
                    <div className="space-y-2">
                      {phoneContact && (
                        <a
                          href={phoneContact.url}
                          className="flex items-center gap-2 text-foreground-light text-sm hover:text-primary transition-colors"
                        >
                          <FaPhone className="text-xs text-primary/60" />
                          {phoneContact.value}
                        </a>
                      )}
                      {emailContact && (
                        <a
                          href={emailContact.url}
                          className="flex items-center gap-2 text-foreground-light text-sm hover:text-primary transition-colors"
                        >
                          <FaEnvelope className="text-xs text-primary/60" />
                          {emailContact.value}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={LOCATION.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <FaExternalLinkAlt className="text-xs" />
                  {t('location.open_maps')}
                </a>
                <a
                  href={LOCATION.directions_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-accent hover:bg-accent-dark text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <FaDirections className="text-xs" />
                  {t('location.get_directions')}
                </a>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
