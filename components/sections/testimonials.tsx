"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
};

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Working with Blessings was effortless. The attention to detail and product polish felt enterprise-grade.",
    author: "Amelia Hart",
    role: "Head of Product, Northstar",
    avatar: "/images/profile.jpg",
  },
  {
    quote:
      "Shipping velocity without sacrificing quality. Exactly what we needed to hit our launch window.",
    author: "David Cho",
    role: "CTO, Lumen Labs",
  },
  {
    quote:
      "Thoughtful UX and clean architecture. Code reviews became a formality.",
    author: "Priya Singh",
    role: "Engineering Manager, Aether",
  },
];

export function Testimonials({ items = DEFAULT_TESTIMONIALS }: { items?: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 4500);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [items.length, paused]);

  return (
    <section id="testimonials" className="relative py-16 sm:py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">What people say</h2>
          <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-3" />
        </div>

        <div
          className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative px-6 sm:px-10 md:px-14 py-10 sm:py-14 md:py-16">
            {/* Ambient light */}
            <div className="pointer-events-none absolute -inset-x-10 -top-20 h-40 bg-gradient-to-b from-primary/15 to-transparent blur-2xl" />

            {items.map((t, i) => (
              <figure
                key={i}
                className={cn(
                  "transition-opacity duration-700",
                  i === index ? "opacity-100" : "opacity-0 absolute inset-0"
                )}
              >
                <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight tracking-tight text-balance">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4">
                  {t.avatar && (
                    <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden ring-2 ring-primary/20">
                      <Image src={t.avatar} alt={t.author} fill className="object-cover" />
                    </div>
                  )}
                  <div>
                    <div className="text-sm sm:text-base font-semibold">{t.author}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}

            {/* Progress dots */}
            <div className="mt-8 sm:mt-10 flex items-center justify-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 w-6 rounded-full transition-all",
                    i === index ? "bg-primary w-10" : "bg-muted"
                  )}
                />)
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



