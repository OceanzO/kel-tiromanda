import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import GovernmentSection from '@/components/sections/GovernmentSection';
import PotentialsSection from '@/components/sections/PotentialsSection';
import FacilitiesSection from '@/components/sections/FacilitiesSection';
import InfographicsSection from '@/components/sections/InfographicsSection';
import GallerySection from '@/components/sections/GallerySection';
import NewsSection from '@/components/sections/NewsSection';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <GovernmentSection />
        <PotentialsSection />
        <FacilitiesSection />
        <InfographicsSection />
        <GallerySection />
        <NewsSection />
      </main>
      <Footer />
    </>
  );
}
