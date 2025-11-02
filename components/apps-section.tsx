import { createClient } from "@/lib/supabase/server";
import { AppsWrapperClient } from "./apps-wrapper-client";

export async function AppsSection() {
  let apps: any[] = [];

  try {
    const supabase = await createClient();
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
    <section id="apps" className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AppsWrapperClient apps={apps} />
      </div>
    </section>
  );
}

