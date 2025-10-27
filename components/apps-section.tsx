"use client";

import { AppCard } from "./app-card";
import { apps } from "@/data/apps";
import { ScrollAnimation } from "./scroll-animation";

export function AppsSection() {
  return (
    <section id="apps" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">My Apps</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover my collection of mobile and web applications designed to enhance your digital life.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apps.map((app, index) => (
            <ScrollAnimation key={index} delay={index * 100}>
              <AppCard {...app} />
            </ScrollAnimation>
          ))}
        </div>

        <ScrollAnimation delay={300}>
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              More apps coming soon! Check back regularly for updates.
            </p>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}

