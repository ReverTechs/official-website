import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

export async function ensureUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null };

  // Try to fetch minimal profile first
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!existing) {
    // Upsert the user profile with default role 'user'
    // RLS allows insert for own row as per schema grants
    await supabase.from("users").upsert(
      {
        id: user.id,
        email: user.email,
      },
      { onConflict: "id" },
    );
  }

  // Optional: auto-promote admin based on env ADMIN_EMAILS (comma-separated)
  const adminEmailsEnv = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase());
  if (adminEmailsEnv && user.email && adminEmailsEnv.includes(user.email.toLowerCase())) {
    await supabase.from("users").update({ role: "admin" }).eq("id", user.id);
  }

  return { supabase, user };
}
