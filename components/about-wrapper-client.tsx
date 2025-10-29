"use client";

import { Card } from "./ui/card";
import { ScrollAnimation } from "./scroll-animation";
import { AboutSectionClient } from "./about-section-client";

interface AboutWrapperClientProps {
  description: string;
  skills: any[];
}

export function AboutWrapperClient({ description, skills }: AboutWrapperClientProps) {
  return (
    <>
      <ScrollAnimation>
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">About Me</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
        </div>
      </ScrollAnimation>

      <ScrollAnimation delay={100}>
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>
        </div>
      </ScrollAnimation>

      <AboutSectionClient skills={skills} />
    </>
  );
}



