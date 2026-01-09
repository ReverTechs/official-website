import { createPublicClient } from "@/lib/supabase/server";
import Image from "next/image";
import { Spotlight } from "../shared/spotlight";
import TypedDescription from "./typed-description";

export async function HomeHero() {
  let title = "Blessings Chilemba";
  let subtitle = "Fullstack Developer & UX Designer";
  let description =
    "Crafting digital experiences that make a difference. Building innovative apps and solutions that empower users.";

  try {
    const supabase = createPublicClient();
    const { data: homeContent } = await supabase
      .from("site_content")
      .select("*")
      .eq("section_name", "home_hero")
      .single();

    if (homeContent) {
      title = homeContent.title || title;
      subtitle = homeContent.subtitle || subtitle;
      description = homeContent.content?.description || description;
    }
  } catch (error) {
    // Gracefully handle errors (missing env vars, database issues, etc.)
    console.error("Error loading home content:", error);
  }

  return (
    <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-8 sm:pb-0">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      {/* Interactive spotlight */}
      <Spotlight className="absolute inset-0" />

      {/* Animated Circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Profile Image */}
        <div className="mb-8 sm:mb-12 animate-fade-in flex justify-center">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden ring-4 ring-primary/20 ring-offset-4 ring-offset-background shadow-2xl bg-gradient-to-br from-primary/30 to-secondary/30">
            <Image
              src="/images/rever-2.jpg"
              alt="Blessings Chilemba"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
            />
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-light px-2">
            {subtitle}
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-8 animate-fade-in-up">
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
            <TypedDescription text={description} />
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center pt-4">
            <a
              href="#about"
              className="w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md text-sm"
            >
              Learn More
            </a>
            <a
              href="#apps"
              className="w-full sm:w-auto px-6 py-2.5 border border-border/50 bg-background/50 backdrop-blur-sm text-foreground rounded-full font-medium hover:bg-accent/50 hover:border-border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md text-sm"
            >
              View My Apps
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
          <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
