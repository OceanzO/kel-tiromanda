'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { NAV_ITEMS, CONTACTS, LOCATION } from '@/lib/constants';
import { FaWhatsapp, FaInstagram, FaTiktok, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaStar } from 'react-icons/fa';

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
    <footer id="footer" className="relative bg-primary-dark text-white overflow-hidden">
      {/* Toraja Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-accent via-secondary to-accent" />



      {/* Decorative radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-accent/5 blur-[80px] pointer-events-none" />

      {/* Footer Brand Header */}
      <div className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Logo */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center shadow-2xl p-2 flex-shrink-0 ring-4 ring-accent/20">
              <Image
                src="/logo-tana-toraja.png"
                alt="Logo Kabupaten Tana Toraja"
                width={88}
                height={88}
                className="w-full h-full object-contain"
              />
            </div>
            {/* Brand Text */}
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <FaStar className="text-accent text-xs" />
                <span className="text-accent text-xs font-semibold uppercase tracking-widest">Portal Resmi</span>
                <FaStar className="text-accent text-xs" />
              </div>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white leading-tight">
                {t('general.village_name')}
              </h2>
              <p className="text-white/60 text-sm mt-1 font-medium">
                {t('general.district')} &bull; {t('general.regency')} &bull; {t('general.province')}
              </p>
              <p className="text-white/40 text-xs mt-2 italic">
                {language === 'id'
                  ? 'Melayani dengan sepenuh hati untuk masyarakat Tiromanda'
                  : 'Serving wholeheartedly for the people of Tiromanda'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1: About */}
          <div className="lg:col-span-1">
            <h4 className="font-heading font-bold text-lg mb-5 text-accent">
              {language === 'id' ? 'Tentang Kami' : 'About Us'}
            </h4>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
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

            <div className="mt-6 p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-white/40 text-xs mb-0.5">
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
                  className="w-11 h-11 rounded-xl bg-secondary/15 hover:bg-accent/25 flex items-center justify-center text-white/60 hover:text-accent transition-all duration-300 hover:scale-110 border border-white/10 hover:border-accent/30"
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
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/40 text-sm text-center sm:text-left">
              {t('footer.copyright')}
            </p>
            <p className="text-white/25 text-xs">
              {t('general.developed_by')}
            </p>
          </div>
          {/* Admin Login - subtle */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/25 text-xs">
              <span>{t('general.village_name')}</span>
              <span>•</span>
              <span>{t('general.district_short')}</span>
              <span>•</span>
              <span>{t('general.regency_name')}</span>
            </div>
            <a
              href="/admin/login"
              className="flex items-center gap-1.5 text-white/20 hover:text-white/50 text-xs transition-colors duration-300 group"
              title="Login Admin"
            >
              <FaLock className="text-[10px] group-hover:text-accent/60 transition-colors" />
              <span>Login Admin</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
