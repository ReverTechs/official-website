import { Navbar } from "@/components/navbar";
import { HomeHero } from "@/components/home-hero";
import { AboutSection } from "@/components/about-section";
import { AppsSection } from "@/components/apps-section";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";

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
