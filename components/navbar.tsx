"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { MobileMenu } from "./mobile-menu";
import { ProfileAvatar } from "./profile-avatar";
import { Home, Info, AppWindow, Mail, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function loadRole() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
      setIsAdmin(data?.role === "admin");
    }
    loadRole();
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border" 
          : "bg-background/80 backdrop-blur-md border-b border-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <ProfileAvatar />
            <Link 
              href="/" 
              className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:opacity-80 transition-opacity flex items-center gap-2 group"
            >
              <Home className="h-6 w-6 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              <span className="group-hover:translate-x-2 transition-transform duration-200">Blessings Chilemba</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAdmin && (
              <Link 
                href="/admin" 
                className="text-sm font-medium hover:text-primary transition-all duration-200 hover:scale-105 flex items-center gap-1.5 group"
              >
                <Shield className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>Admin</span>
              </Link>
            )}
            <Link 
              href="#about" 
              className="text-sm font-medium hover:text-primary transition-all duration-200 hover:scale-105 flex items-center gap-1.5 group"
            >
              <Info className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span>About</span>
            </Link>
            <Link 
              href="#apps" 
              className="text-sm font-medium hover:text-primary transition-all duration-200 hover:scale-105 flex items-center gap-1.5 group"
            >
              <AppWindow className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span>Apps</span>
            </Link>
            <Link 
              href="#contact" 
              className="text-sm font-medium hover:text-primary transition-all duration-200 hover:scale-105 flex items-center gap-1.5 group"
            >
              <Mail className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span>Contact</span>
            </Link>
            <ThemeSwitcher />
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}

