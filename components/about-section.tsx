"use client";

import { Code, Smartphone, Palette, Rocket } from "lucide-react";
import { Card } from "./ui/card";
import { ScrollAnimation } from "./scroll-animation";

const skills = [
  {
    icon: Code,
    title: "Web Development",
    description: "Building responsive and performant web applications with modern frameworks.",
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Creating native and cross-platform mobile apps with excellent UX.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Designing beautiful and intuitive user interfaces that users love.",
  },
  {
    icon: Rocket,
    title: "Innovation",
    description: "Always exploring new technologies and pushing the boundaries of what's possible.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">About Me</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={100}>
          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Passionate about creating digital solutions that solve real-world problems. 
                I specialize in developing innovative applications that combine elegant design 
                with robust functionality. With a keen eye for detail and a love for clean code, 
                I bring ideas to life through technology.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether it&apos;s a mobile app, a web application, or a creative tool, I strive 
                to deliver exceptional user experiences that make a meaningful impact.
              </p>
            </div>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <ScrollAnimation key={index} delay={index * 100}>
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border/50 hover:-translate-y-1 hover:scale-105">
                  <div className="mb-4">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                  <p className="text-sm text-muted-foreground">{skill.description}</p>
                </Card>
              </ScrollAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
}

