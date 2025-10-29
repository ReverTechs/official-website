import { createClient } from "@/lib/supabase/server";
import { AboutWrapperClient } from "./about-wrapper-client";

export async function AboutSection() {
  const supabase = await createClient();
  
  const { data: aboutContent } = await supabase
    .from("site_content")
    .select("*")
    .eq("section_name", "about")
    .single();

  const description = aboutContent?.content?.description || 
    "Passionate about creating digital solutions that solve real-world problems. I specialize in developing innovative applications that combine elegant design with robust functionality. With a keen eye for detail and a love for clean code, I bring ideas to life through technology. Whether it's a mobile app, a web application, or a creative tool, I strive to deliver exceptional user experiences that make a meaningful impact.";

  const skills = aboutContent?.content?.skills || [];

  return (
    <section id="about" className="py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AboutWrapperClient description={description} skills={skills} />
      </div>
    </section>
  );
}

