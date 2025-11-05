import { redirect } from "next/navigation";
import { ensureUserProfile } from "@/lib/supabase/server";
import { MessagesList } from "@/components/features/admin/messages-list";

export default async function AdminMessagesPage() {
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

  // Fetch messages
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="border-b border-border pb-3 sm:pb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Messages & Notifications</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          View and respond to messages from visitors
        </p>
      </div>

      <MessagesList messages={messages || []} />
    </div>
  );
}



