"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/buttons/button";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "./logout-button";

export function AuthButton() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (isMounted) {
          setEmail(data.user?.email ?? null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="text-xs sm:text-sm text-muted-foreground">Loading…</div>;
  }

  return email ? (
    <div className="flex items-center gap-2 sm:gap-4">
      <span className="hidden sm:inline text-xs sm:text-sm text-muted-foreground">Hey, {email}!</span>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-1.5 sm:gap-2">
      <Button asChild size="sm" variant={"outline"} className="text-xs sm:text-sm">
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"} className="text-xs sm:text-sm">
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
