import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import GovernmentSection from '@/components/sections/GovernmentSection';
import PotentialsSection from '@/components/sections/PotentialsSection';
import FacilitiesSection from '@/components/sections/FacilitiesSection';
import UMKMSection from '@/components/sections/UMKMSection';
import GallerySection from '@/components/sections/GallerySection';
import LocationSection from '@/components/sections/LocationSection';
import ContactSection from '@/components/sections/ContactSection';

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
        <UMKMSection />
        <GallerySection />
        <LocationSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
