import { Navbar } from "@/components/navbar";
import { HomeHero } from "@/components/home-hero";
import { AboutSection } from "@/components/about-section";
import { AppsSection } from "@/components/apps-section";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HomeHero />
      <AboutSection />
      <AppsSection />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
