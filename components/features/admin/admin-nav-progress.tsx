"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function AdminNavProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setProgress(30);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 40;
        return next > 90 ? 90 : next;
      });
    }, 200);

    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 300);
    }, 600);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [pathname, searchParams]);

  return (
    <div
      aria-hidden
      className={`fixed top-0 left-0 right-0 h-1 z-50 overflow-hidden pointer-events-none ${
        !isLoading && progress === 0 ? "opacity-0" : "opacity-100"
      } transition-opacity duration-300`}
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary/60 transition-all duration-300 ease-out shadow-lg"
        style={{
          width: `${progress}%`,
          boxShadow:
            progress < 100 ? "0 0 10px rgba(var(--primary), 0.5)" : "none",
        }}
      />
    </div>
  );
}
