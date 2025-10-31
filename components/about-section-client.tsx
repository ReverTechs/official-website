"use client";

import { Card } from "./ui/card";
import { ScrollAnimation } from "./scroll-animation";

interface Skill {
  icon: string;
  title: string;
  description: string;
}

interface AboutSectionClientProps {
  skills: Skill[];
}

export function AboutSectionClient({ skills }: AboutSectionClientProps) {
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      Code: () => <svg className="w-full h-full text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
      Smartphone: () => <svg className="w-full h-full text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
      Palette: () => <svg className="w-full h-full text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
      Rocket: () => <svg className="w-full h-full text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    };
    const IconComponent = icons[iconName];
    return IconComponent ? <IconComponent /> : <div className="w-full h-full text-primary" />;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
      {skills.map((skill: Skill, index: number) => (
        <ScrollAnimation key={index} delay={index * 100}>
          <Card className="p-4 sm:p-5 md:p-6 hover:shadow-lg transition-all duration-300 border-border/50 hover:-translate-y-1 hover:scale-[1.02] sm:hover:scale-105">
            <div className="mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10">
                {getIcon(skill.icon)}
              </div>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1.5 sm:mb-2">{skill.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{skill.description}</p>
          </Card>
        </ScrollAnimation>
      ))}
    </div>
  );
}




