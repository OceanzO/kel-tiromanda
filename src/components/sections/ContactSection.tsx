'use client';

import { useLanguage } from '@/context/LanguageContext';
import { CONTACTS } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollAnimation from '@/components/ui/ScrollAnimation';
import {
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaTiktok,
  FaYoutube,
};

const COLOR_MAP: Record<string, { bg: string; text: string; gradient: string }> = {
  whatsapp: {
    bg: 'bg-green-500/10',
    text: 'text-green-600',
    gradient: 'from-green-500 to-green-600',
  },
  phone: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    gradient: 'from-primary to-primary-dark',
  },
  email: {
    bg: 'bg-secondary/10',
    text: 'text-secondary',
    gradient: 'from-secondary to-secondary-dark',
  },
  instagram: {
    bg: 'bg-pink-500/10',
    text: 'text-pink-500',
    gradient: 'from-pink-500 to-purple-600',
  },
  tiktok: {
    bg: 'bg-foreground/10',
    text: 'text-foreground',
    gradient: 'from-gray-800 to-gray-900',
  },
  youtube: {
    bg: 'bg-red-500/10',
    text: 'text-red-600',
    gradient: 'from-red-500 to-red-700',
  },
};

export default function ContactSection() {
  const { language, t } = useLanguage();

  return (
    <section
      id="contact"
      className="relative py-20 md:py-28 bg-background-alt overflow-hidden"
    >
      <div className="absolute inset-0 section-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={t('contact.title')}
          subtitle={t('contact.subtitle')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CONTACTS.map((contact, index) => {
            const IconComponent = ICON_MAP[contact.icon] || FaPhone;
            const colors = COLOR_MAP[contact.type] || COLOR_MAP.phone;

            return (
              <ScrollAnimation key={contact.type} variant="fadeUp" delay={index * 0.1}>
                <a
                  href={contact.url}
                  target={
                    contact.type === 'phone' || contact.type === 'email'
                      ? '_self'
                      : '_blank'
                  }
                  rel="noopener noreferrer"
                  className="premium-card group block p-6 hover:scale-[1.03] transition-all duration-300"
                >
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className={`text-2xl ${colors.text}`} />
                  </div>

                  {/* Label */}
                  <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                    {language === 'id' ? contact.label_id : contact.label_en}
                  </h3>

                  {/* Value */}
                  <p className="text-foreground-muted text-sm">
                    {contact.value}
                  </p>

                  {/* Hover accent bar */}
                  <div
                    className={`mt-4 h-1 w-0 group-hover:w-full rounded-full bg-gradient-to-r ${colors.gradient} transition-all duration-500`}
                  />
                </a>
              </ScrollAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
}
