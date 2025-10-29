import { redirect } from "next/navigation";
import { ensureUserProfile } from "@/lib/supabase/server";
import { ContentManager } from "@/components/admin/content-manager";

export default async function AdminContentPage() {
  const { supabase, user } = await ensureUserProfile();
  
  if (!user) {
    redirect("/auth/login");
  }

  // Admin role no longer required

  // Fetch all content
  const { data: homeContent } = await supabase
    .from("site_content")
    .select("*")
    .eq("section_name", "home_hero")
    .single();

  const { data: aboutContent } = await supabase
    .from("site_content")
    .select("*")
    .eq("section_name", "about")
    .single();

  const { data: contactContent } = await supabase
    .from("site_content")
    .select("*")
    .eq("section_name", "contact")
    .single();

  const { data: apps } = await supabase
    .from("apps")
    .select("*")
    .order("display_order");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-4">
        <h1 className="text-4xl font-bold mb-2">Content Management</h1>
        <p className="text-muted-foreground">
          Edit all sections of your website in one place
        </p>
      </div>

      <ContentManager
        homeContent={homeContent}
        aboutContent={aboutContent}
        contactContent={contactContent}
        apps={apps || []}
        profile={profile}
      />
    </div>
  );
}



