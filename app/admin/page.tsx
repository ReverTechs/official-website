import { redirect } from "next/navigation";
import { ensureUserProfile } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/buttons/button";
import { 
  FileText, 
  MessageSquare, 
  User, 
  Link as LinkIcon,
  ArrowRight 
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const { supabase, user } = await ensureUserProfile();
  
  if (!user) {
    redirect("/auth/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get stats
  const { count: messagesCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true });

  const { count: appsCount } = await supabase
    .from("apps")
    .select("*", { count: "exact", head: true });

  const { count: unreadMessagesCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .is("replied_at", null);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Welcome back, {profile?.full_name || user.email}!</h1>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">Manage your website content and messages</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        <Card className="p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
            <div className="text-xl sm:text-2xl font-bold">{messagesCount || 0}</div>
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground mb-2">Total Messages</div>
          {unreadMessagesCount! > 0 && (
            <div className="text-xs sm:text-sm text-orange-600 font-medium">
              {unreadMessagesCount} unread
            </div>
          )}
        </Card>

        <Card className="p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <FileText className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-600" />
            <div className="text-xl sm:text-2xl font-bold">{appsCount || 0}</div>
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">Active Apps</div>
        </Card>

        <Card className="p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow sm:col-span-2 md:col-span-1">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <User className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-600" />
            <div className="text-xl sm:text-2xl font-bold">Admin</div>
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">Your Role</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        <Card className="p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all border-primary/20 hover:border-primary/40">
          <Link href="/admin/content" className="block">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Manage Content</h3>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Edit your profile information, about section, apps, and contact details
                </p>
              </div>
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 ml-2" />
            </div>
            <ul className="space-y-1.5 sm:space-y-2 mt-3 sm:mt-4 text-xs sm:text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                <span>Edit name and description</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                <span>Update about section</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                <span>Manage apps portfolio</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                <span>Edit contact information</span>
              </li>
            </ul>
          </Link>
        </Card>

        <Card className="p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all border-primary/20 hover:border-primary/40">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="p-2 sm:p-3 rounded-lg bg-orange-500/10 flex-shrink-0">
                    <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">View Messages</h3>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Read and respond to messages from visitors
                </p>
              </div>
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 ml-2" />
            </div>
            {unreadMessagesCount! > 0 && (
              <div className="mt-3 sm:mt-4">
                <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs sm:text-sm font-medium">
                  <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
                  {unreadMessagesCount} new messages
                </div>
              </div>
            )}
            <Button asChild className="mt-3 sm:mt-4 w-full sm:w-auto" variant="outline" size="sm">
              <Link href="/admin/messages">
                View All Messages
              </Link>
            </Button>
        </Card>

        <Card className="p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all border-primary/20 hover:border-primary/40">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="p-2 sm:p-3 rounded-lg bg-green-500/10 flex-shrink-0">
                    <LinkIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">View Website</h3>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  See how your changes look on the public site
                </p>
              </div>
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 ml-2" />
            </div>
            <Button asChild className="mt-3 sm:mt-4 w-full sm:w-auto" variant="outline" size="sm">
              <Link href="/">
                Visit Site
              </Link>
            </Button>
        </Card>

        <Card className="p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all border-primary/20 hover:border-primary/40">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="p-2 sm:p-3 rounded-lg bg-blue-500/10 flex-shrink-0">
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Your Profile</h3>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Edit your personal information and settings
                </p>
              </div>
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 ml-2" />
            </div>
            <Button asChild className="mt-3 sm:mt-4 w-full sm:w-auto" variant="outline" size="sm">
              <Link href="/profile">
                Manage Profile
              </Link>
            </Button>
        </Card>
      </div>
    </div>
  );
}


