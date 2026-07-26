'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { NAV_ITEMS, CONTACTS, LOCATION } from '@/lib/constants';
import { FaWhatsapp, FaInstagram, FaTiktok, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const socialIcons: Record<string, React.ReactNode> = {
  whatsapp: <FaWhatsapp />,
  instagram: <FaInstagram />,
  tiktok: <FaTiktok />,
  youtube: <FaYoutube />,
  email: <FaEnvelope />,
  phone: <FaPhone />,
};

export default function Footer() {
  const { language, t } = useLanguage();

  const handleNavClick = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialContacts = CONTACTS.filter((c) =>
    ['whatsapp', 'instagram', 'tiktok', 'youtube'].includes(c.type)
  );

  return (
    <footer className="relative bg-primary-dark text-white overflow-hidden">
      {/* Toraja Decorative Top Border */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-secondary" />

      {/* Decorative Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L50 15L40 30L30 15Z' fill='white'/%3E%3Cpath d='M0 40L10 55L0 70L-10 55Z' fill='white'/%3E%3Cpath d='M80 40L90 55L80 70L70 55Z' fill='white'/%3E%3C/svg%3E")`,
        backgroundSize: '80px 80px'
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 rounded-xl bg-white/10 p-1 border border-white/20 flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo-kkn.png"
                  alt="Logo KKN-T 116 Desa Tiromanda"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-heading font-bold text-xl block leading-tight">Tiromanda</span>
                <span className="text-white/50 text-xs leading-tight">Tana Toraja</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex items-start gap-2 text-sm text-white/50">
              <FaMapMarkerAlt className="text-accent mt-0.5 flex-shrink-0" />
              <span>{language === 'id' ? LOCATION.address_id : LOCATION.address_en}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-5 text-accent">
              {t('footer.quick_links')}
            </h4>
            <ul className="space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                    className="text-white/60 hover:text-accent text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-accent transition-colors" />
                    {language === 'id' ? item.label_id : item.label_en}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-5 text-accent">
              {t('footer.contact_info')}
            </h4>
            <ul className="space-y-3">
              {CONTACTS.filter((c) => ['whatsapp', 'phone', 'email'].includes(c.type)).map((contact) => (
                <li key={contact.type}>
                  <a
                    href={contact.url}
                    target={contact.type === 'email' ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-accent text-sm transition-colors duration-200 flex items-center gap-3"
                  >
                    <span className="text-accent/70">{socialIcons[contact.type]}</span>
                    {contact.value}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <p className="text-white/40 text-xs mb-1">
                {language === 'id' ? 'Jam Operasional' : 'Office Hours'}
              </p>
              <p className="text-white/60 text-sm">
                {language === 'id' ? LOCATION.office_hours_id : LOCATION.office_hours_en}
              </p>
            </div>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-5 text-accent">
              {t('footer.social_media')}
            </h4>
            <div className="flex flex-wrap gap-3">
              {socialContacts.map((contact) => (
                <a
                  key={contact.type}
                  href={contact.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-white/10 hover:bg-accent/20 flex items-center justify-center text-white/70 hover:text-accent transition-all duration-300 hover:scale-110"
                  aria-label={contact.type}
                >
                  <span className="text-lg">{socialIcons[contact.type]}</span>
                </a>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-accent text-xs font-semibold mb-1">
                {language === 'id' ? 'Portal Digital' : 'Digital Portal'}
              </p>
              <p className="text-white/50 text-xs leading-relaxed">
                {language === 'id'
                  ? 'Dibangun dengan ❤️ untuk masyarakat Kelurahan Tiromanda'
                  : 'Built with ❤️ for the people of Kelurahan Tiromanda'}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm text-center sm:text-left">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <span>Kelurahan Tiromanda</span>
            <span>•</span>
            <span>Makale Selatan</span>
            <span>•</span>
            <span>Tana Toraja</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
