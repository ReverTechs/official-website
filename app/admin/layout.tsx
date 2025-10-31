import { redirect } from "next/navigation";
import { ensureUserProfile } from "@/lib/supabase/server";
import { AdminNavbar } from "@/components/admin/admin-navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabase, user } = await ensureUserProfile();
  
  if (!user) {
    redirect("/auth/login");
  }

  // Require admin role
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!userData || userData.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {children}
      </div>
    </div>
  );
}



