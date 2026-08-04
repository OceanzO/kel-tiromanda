'use client';

import { useLanguage } from '@/context/LanguageContext';
import { ABOUT_DATA } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollAnimation from '@/components/ui/ScrollAnimation';
import { 
  FaEye, FaBullseye, FaRulerCombined, 
  FaHome, FaMap, FaInfoCircle, FaUserFriends, 
  FaBriefcase, FaMale, FaFemale, FaUserTie
} from 'react-icons/fa';

interface StatCardProps {
  title: string;
  value?: string | number;
  unit?: string;
  icon: React.ElementType;
  isPlaceholder?: boolean;
}

const StatCard = ({ title, value, unit, icon: Icon, isPlaceholder = false }: StatCardProps) => (
  <div className="premium-card p-6 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-6">
      <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider">{title}</span>
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        <Icon />
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      {isPlaceholder ? (
        <span className="text-sm font-semibold text-primary/80 italic">Edit di Dashboard Admin</span>
      ) : (
        <>
          <span className="text-3xl md:text-4xl font-bold text-foreground">{value}</span>
          {unit && <span className="text-sm font-medium text-foreground-muted">{unit}</span>}
        </>
      )}
    </div>
  </div>
);

export default function AboutSection() {
  const { language, t } = useLanguage();

  const profile = language === 'id' ? ABOUT_DATA.profile_id : ABOUT_DATA.profile_en;
  const vision = language === 'id' ? ABOUT_DATA.vision_id : ABOUT_DATA.vision_en;
  const missions = language === 'id' ? ABOUT_DATA.mission_id : ABOUT_DATA.mission_en;

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

        {/* Vision & Mission Single Frame */}
        <ScrollAnimation variant="fadeUp" delay={0.1}>
          <div className="premium-card p-8 md:p-12 mb-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent via-primary to-accent" />
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* Vision Side */}
              <div className="md:col-span-5 flex flex-col h-full justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center">
                    <FaEye className="text-accent text-xl" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-foreground">
                    {t('about.vision')}
                  </h3>
                </div>
                <p className="text-foreground-light text-lg md:text-xl leading-relaxed font-medium italic border-l-4 border-accent pl-5 py-2">
                  &quot;{vision}&quot;
                </p>
              </div>
              
              {/* Divider for md screens and up */}
              <div className="hidden md:flex md:col-span-1 justify-center h-full">
                <div className="w-px h-full min-h-[200px] bg-gray-200 dark:bg-gray-800" />
              </div>

              {/* Mission Side */}
              <div className="md:col-span-6 flex flex-col h-full justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FaBullseye className="text-primary text-xl" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-foreground">
                    {t('about.mission')}
                  </h3>
                </div>
                <ul className="space-y-5">
                  {missions.map((mission, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-foreground-light text-sm md:text-base leading-relaxed pt-1">
                        {mission}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* Statistics Row */}
        <ScrollAnimation variant="fadeUp" delay={0.2}>
          <div className="mb-8">
            <h3 className="font-heading font-bold text-xl text-foreground mb-2">
              {language === 'id' ? 'Statistik Kependudukan' : 'Population Statistics'}
            </h3>
            <p className="text-foreground-muted text-sm md:text-base">
              {language === 'id' 
                ? 'Gambaran jumlah penduduk, keluarga, dan wilayah administratif Kelurahan Tiromanda.' 
                : 'Overview of population, families, and administrative areas of Tiromanda Village.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <StatCard 
              title={language === 'id' ? 'Total Penduduk' : 'Total Population'} 
              isPlaceholder={true} 
              icon={FaUserFriends} 
            />
            <StatCard 
              title={language === 'id' ? 'Kepala Keluarga' : 'Households'} 
              isPlaceholder={true} 
              icon={FaUserTie} 
            />
            <StatCard 
              title={language === 'id' ? 'Luas Wilayah' : 'Total Area'} 
              isPlaceholder={true} 
              icon={FaRulerCombined} 
            />
            <StatCard 
              title={language === 'id' ? 'Lingkungan' : 'Neighborhoods'} 
              value="4" 
              icon={FaMap} 
            />
            <StatCard 
              title={language === 'id' ? 'Jumlah RT' : 'Number of RT'} 
              value="8" 
              icon={FaHome} 
            />
            <StatCard 
              title={language === 'id' ? 'Mata Pencaharian Dominan' : 'Dominant Livelihood'} 
              value={language === 'id' ? 'Petani' : 'Farmer'} 
              icon={FaBriefcase} 
            />
          </div>

          {/* Gender Composition */}
          <div className="premium-card p-6 md:p-8 mt-6">
            <h4 className="font-bold text-foreground mb-6">
              {language === 'id' ? 'Komposisi Jenis Kelamin' : 'Gender Composition'}
            </h4>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
              {/* Laki-laki */}
              <div className="flex items-center gap-4 w-full">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <FaMale className="text-2xl" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1">
                    {language === 'id' ? 'Laki-laki' : 'Male'}
                  </p>
                  <p className="text-sm font-semibold text-primary/80 italic">Edit di Dashboard Admin</p>
                </div>
              </div>
              
              {/* Perempuan */}
              <div className="flex items-center gap-4 w-full md:justify-end">
                <div className="md:text-right">
                  <p className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1">
                    {language === 'id' ? 'Perempuan' : 'Female'}
                  </p>
                  <p className="text-sm font-semibold text-primary/80 italic">Edit di Dashboard Admin</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <FaFemale className="text-2xl" />
                </div>
              </div>
            </div>
            
            {/* Progress Bar Placeholder */}
            <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
              <div className="h-full bg-blue-500 w-1/2" />
              <div className="h-full bg-accent w-1/2" />
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
