"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-accent transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <>
          {/* Dim overlay behind the menu */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Main mobile menu with blur effect */}
          <div
            className="
              fixed top-16 right-0 w-64 h-full
              bg-background/98 dark:bg-background/98
              backdrop-blur-xl
              border-l border-border
              z-50 p-4 space-y-4 shadow-xl
              text-foreground
            "
          >
            <Link
              href="#about"
              className="block py-3 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="#apps"
              className="block py-3 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Apps
            </Link>
            <Link
              href="#contact"
              className="block py-3 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 border-t border-border">
              <ThemeSwitcher />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
