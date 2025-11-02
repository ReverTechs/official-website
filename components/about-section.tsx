import { createClient } from "@/lib/supabase/server";
import { AboutWrapperClient } from "./about-wrapper-client";

export async function AboutSection() {
  let description = "Passionate about creating digital solutions that solve real-world problems. I specialize in developing innovative applications that combine elegant design with robust functionality. With a keen eye for detail and a love for clean code, I bring ideas to life through technology. Whether it's a mobile app, a web application, or a creative tool, I strive to deliver exceptional user experiences that make a meaningful impact.";
  let skills: string[] = [];

  try {
    const supabase = await createClient();
    const { data: aboutContent } = await supabase
      .from("site_content")
      .select("*")
      .eq("section_name", "about")
      .single();

    if (aboutContent) {
      description = aboutContent.content?.description || description;
      skills = aboutContent.content?.skills || [];
    }
  } catch (error) {
    // Gracefully handle errors (missing env vars, database issues, etc.)
    console.error("Error loading about content:", error);
  }

  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AboutWrapperClient description={description} skills={skills} />
      </div>
    </section>
  );
}

