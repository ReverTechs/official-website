"use client";

import { Card } from "./ui/card";
import { ScrollAnimation } from "./scroll-animation";
import { AboutSectionClient } from "./about-section-client";
import Image from "next/image";

interface AboutWrapperClientProps {
  description: string;
  skills: any[];
}

export function AboutWrapperClient({ description, skills }: AboutWrapperClientProps) {
  return (
    <>
      <ScrollAnimation>
        <div className="text-center mb-8 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">About Me</h2>
          <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
        </div>
      </ScrollAnimation>

      <ScrollAnimation delay={100}>
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
            {/* Profile Image */}
            <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden ring-2 ring-primary/20 shadow-xl bg-gradient-to-br from-primary/30 to-secondary/30">
                <Image
                  src="/images/profile.jpg"
                  alt="Blessings Chilemba"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 192px, 256px"
                />
              </div>
            </div>

            {/* Description Card */}
            <div className="flex-1 bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>
          </div>
        </div>
      </ScrollAnimation>

      <AboutSectionClient skills={skills} />
    </>
  );
}




