
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import CollaborationSection from "@/components/CollaborationSection";
import GallerySection from "@/components/GallerySection";
import CoverageSection from "@/components/CoverageSection";
import ClosingSection from "@/components/ClosingSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />

      <HeroSection />

      <AboutSection />

      <FacilitiesSection />

      <CollaborationSection />

      <GallerySection />

      <CoverageSection />

      <ClosingSection />

      <Footer />
    </main>
  );
}
