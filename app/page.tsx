import { Navbar } from "@/components/ui/layout/navbar";
import { HomeHero } from "@/components/home/home-hero";
import { AboutSection } from "@/components/features/about-section/about-section";
import { AppsSection } from "@/components/features/app-section/apps-section";
import { Testimonials } from "@/components/sections/testimonials";
import { Footer } from "@/components/ui/layout/footer";
import { ScrollToTop } from "@/components/shared/scroll-to-top";

export default async function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HomeHero />
      <AboutSection />
      <AppsSection />
      <Testimonials />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
