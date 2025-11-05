"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Info, AppWindow, Mail, Sun, Moon, Laptop, HomeIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "#home", label: "Home", icon: HomeIcon },
  { href: "#about", label: "About", icon: Info },
  { href: "#apps", label: "Apps", icon: AppWindow },
  { href: "#contact", label: "Contact", icon: Mail },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-accent/50 transition-all duration-300 z-50"
        aria-label="Toggle menu"
      >
        <div className="relative w-6 h-6">
          <Menu
            size={24}
            className={cn(
              "absolute inset-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              isOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
            )}
          />
          <X
            size={24}
            className={cn(
              "absolute inset-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
            )}
          />
        </div>
      </button>

      {/* Full-screen overlay with backdrop blur */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          onClick={handleClose}
        />
      )}

      {/* Main mobile menu panel */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-full opacity-0 pointer-events-none"
        )}
      >
        {/* Menu content */}
        <div 
          className="flex-1 flex flex-col justify-center items-center px-6 py-16 bg-background/95 dark:bg-background/95 backdrop-blur-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Menu items */}
          <nav className="flex flex-col items-center gap-2 w-full max-w-sm">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClose}
                  className={cn(
                    "group relative w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl",
                    "text-base sm:text-lg font-medium text-foreground",
                    "hover:bg-accent/50 hover:text-primary",
                    "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    "transform hover:scale-105 active:scale-95",
                    "border border-transparent hover:border-primary/20",
                    isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{
                    transitionDelay: isOpen ? `${index * 100}ms` : "0ms",
                  }}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-all duration-300",
                      "group-hover:scale-110 group-hover:rotate-12"
                    )}
                  />
                  <span className="relative">
                    {item.label}
                    <span
                      className={cn(
                        "absolute bottom-0 left-0 w-0 h-0.5 bg-primary",
                        "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                        "group-hover:w-full"
                      )}
                    />
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Theme switcher section */}
          <div
            className={cn(
              "mt-8 pt-6 border-t border-border/50 w-full max-w-sm",
              "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
              isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{
              transitionDelay: isOpen ? `${menuItems.length * 100 + 100}ms` : "0ms",
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs font-medium text-muted-foreground mb-1">Theme</p>
              <div className="flex gap-3">
                {mounted &&
                  themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = theme === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={cn(
                          "relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg",
                          "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                          "hover:bg-accent/50 hover:scale-110 active:scale-95",
                          "border-2 transition-colors",
                          isActive
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary"
                        )}
                        aria-label={`Switch to ${option.label} theme`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-medium">{option.label}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
