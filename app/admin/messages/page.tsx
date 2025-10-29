import { redirect } from "next/navigation";
import { ensureUserProfile } from "@/lib/supabase/server";
import { MessagesList } from "@/components/admin/messages-list";

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
    <div className="space-y-8">
      <div className="border-b border-border pb-4">
        <h1 className="text-4xl font-bold mb-2">Messages & Notifications</h1>
        <p className="text-muted-foreground">
          View and respond to messages from visitors
        </p>
      </div>

      <MessagesList messages={messages || []} />
    </div>
  );
}



