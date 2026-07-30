'use client';

import { useLanguage } from '@/context/LanguageContext';
import { ABOUT_DATA } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollAnimation from '@/components/ui/ScrollAnimation';
import StatCounter from '@/components/ui/StatCounter';
import { FaEye, FaBullseye, FaCheckCircle, FaRulerCombined, FaUsers, FaHome, FaMap, FaInfoCircle } from 'react-icons/fa';

export default function AboutSection() {
  const { language, t } = useLanguage();

  const profile = language === 'id' ? ABOUT_DATA.profile_id : ABOUT_DATA.profile_en;
  const vision = language === 'id' ? ABOUT_DATA.vision_id : ABOUT_DATA.vision_en;
  const missions = language === 'id' ? ABOUT_DATA.mission_id : ABOUT_DATA.mission_en;
  const geography = language === 'id' ? ABOUT_DATA.geography_id : ABOUT_DATA.geography_en;

  return (
    <section id="about" className="relative pt-12 pb-20 md:pt-16 md:pb-28 bg-background overflow-hidden">
      {/* Subtle pattern background */}
      <div className="absolute inset-0 section-pattern opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={t('about.title')}
          subtitle={t('about.subtitle')}
        />

        {/* Profile + Video Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-stretch">
          {/* Profile Text */}
          <ScrollAnimation variant="slideLeft">
            <div className="space-y-4 h-full flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                  <FaInfoCircle className="text-accent text-lg" />
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground">
                  {language === 'id' ? 'Sekilas Tiromanda' : 'Tiromanda at a Glance'}
                </h3>
              </div>
              <p className="text-foreground-light text-base md:text-lg leading-relaxed text-justify">
                {profile}
              </p>
            </div>
          </ScrollAnimation>

          {/* Video Profile */}
          <ScrollAnimation variant="slideRight">
            <div className="space-y-4 h-full flex flex-col justify-center">
              <h3 className="font-heading font-bold text-xl text-foreground flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  🎬
                </span>
                {t('about.video_title')}
              </h3>
              <div className="premium-card overflow-hidden w-full">
                <div className="relative w-full pt-[56.25%]">
                  <iframe
                    src={ABOUT_DATA.video_url}
                    title="Video Profile Kelurahan Tiromanda"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>

        {/* Vision & Mission Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-stretch">
          {/* Vision */}
          <ScrollAnimation variant="slideLeft" delay={0.1}>
            <div className="premium-card p-6 border-l-4 border-accent h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                  <FaEye className="text-accent text-lg" />
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground">
                  {t('about.vision')}
                </h3>
              </div>
              <p className="text-foreground-light text-sm leading-relaxed pl-[52px]">
                {vision}
              </p>
            </div>
          </ScrollAnimation>

          {/* Mission */}
          <ScrollAnimation variant="slideRight" delay={0.1}>
            <div className="premium-card p-6 border-l-4 border-primary h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FaBullseye className="text-primary text-lg" />
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground">
                  {t('about.mission')}
                </h3>
              </div>
              <ul className="space-y-2.5 pl-[52px]">
                {missions.map((mission, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-foreground-light text-sm leading-relaxed">
                    <FaCheckCircle className="text-accent mt-0.5 flex-shrink-0 text-xs" />
                    {mission}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollAnimation>
        </div>

        {/* Statistics Row */}
        <ScrollAnimation variant="fadeUp" delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatCounter
              value={language === 'id' ? '(Belum diketahui)' : '(Unknown)'}
              label={language === 'id' ? 'Luas Wilayah' : 'Total Area'}
              icon={<FaRulerCombined />}
            />
            <StatCounter
              value={language === 'id' ? '(Belum diketahui)' : '(Unknown)'}
              label={language === 'id' ? 'Jumlah Penduduk' : 'Population'}
              icon={<FaUsers />}
            />
            <StatCounter
              value="4"
              label={language === 'id' ? 'Lingkungan' : 'Neighborhoods'}
              icon={<FaMap />}
            />
            <StatCounter
              value="8"
              label="RT"
              icon={<FaHome />}
            />
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
