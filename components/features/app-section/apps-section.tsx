import { createPublicClient } from "@/lib/supabase/server";
import { AppsWrapperClient } from "./apps-wrapper-client";

export async function AppsSection() {
  let apps: any[] = [];

  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("apps")
      .select("*")
      .order("display_order");
    
    apps = data || [];
  } catch (error) {
    // Gracefully handle errors (missing env vars, database issues, etc.)
    console.error("Error loading apps:", error);
  }

  return (
    <section id="apps" className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Subtle background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AppsWrapperClient apps={apps} />
      </div>
    </section>
  );
}

