'use client';

import { useLanguage } from '@/context/LanguageContext';
import { ABOUT_DATA } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollAnimation from '@/components/ui/ScrollAnimation';
import StatCounter from '@/components/ui/StatCounter';
import { FaEye, FaBullseye, FaCheckCircle, FaRulerCombined, FaUsers, FaGlobeAsia } from 'react-icons/fa';

export default function AboutSection() {
  const { language, t } = useLanguage();

  const profile = language === 'id' ? ABOUT_DATA.profile_id : ABOUT_DATA.profile_en;
  const vision = language === 'id' ? ABOUT_DATA.vision_id : ABOUT_DATA.vision_en;
  const missions = language === 'id' ? ABOUT_DATA.mission_id : ABOUT_DATA.mission_en;
  const geography = language === 'id' ? ABOUT_DATA.geography_id : ABOUT_DATA.geography_en;

  return (
    <section id="about" className="relative pt-12 pb-20 md:pt-16 md:pb-28 bg-background overflow-hidden">
      {/* Gradient fade from Hero section at the top */}
      <div
        className="absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(15,23,18,0.85) 0%, transparent 100%)',
        }}
      />

      {/* Subtle pattern background */}
      <div className="absolute inset-0 section-pattern opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={t('about.title')}
          subtitle={t('about.subtitle')}
        />

        {/* Profile + Video Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Profile Text */}
          <ScrollAnimation variant="slideLeft">
            <div className="space-y-6">
              <p className="text-foreground-light text-base md:text-lg leading-relaxed">
                {profile}
              </p>

              {/* Vision */}
              <div className="premium-card p-6 border-l-4 border-accent">
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

              {/* Mission */}
              <div className="premium-card p-6 border-l-4 border-primary">
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
            </div>
          </ScrollAnimation>

          {/* Video Profile */}
          <ScrollAnimation variant="slideRight">
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-xl text-foreground flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  🎬
                </span>
                {t('about.video_title')}
              </h3>
              <div className="premium-card overflow-hidden">
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

        {/* Statistics Row */}
        <ScrollAnimation variant="fadeUp" delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCounter
              value={ABOUT_DATA.area}
              label={t('about.area')}
              icon={<FaRulerCombined />}
            />
            <StatCounter
              value={ABOUT_DATA.population}
              label={t('about.population')}
              icon={<FaUsers />}
              suffix={` ${t('about.people')}`}
            />
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-md border border-primary/10 hover:shadow-lg hover:border-accent/20 transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <FaGlobeAsia className="text-primary text-2xl" />
              </div>
              <span className="font-heading text-lg font-bold text-accent mb-2">
                {t('about.geography')}
              </span>
              <span className="text-foreground-muted text-xs leading-relaxed">
                {geography}
              </span>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
