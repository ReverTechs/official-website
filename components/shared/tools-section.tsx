"use client";

import { ScrollAnimation } from "./scroll-animation";

interface Tool {
  name: string;
  icon?: string;
  category?: string;
}

interface ToolsSectionProps {
  tools: Tool[];
}

export function ToolsSection({ tools }: ToolsSectionProps) {
  // Popular tech icons mapping - can be extended
  const getTechIcon = (name: string) => {
    const normalizedName = name.toLowerCase().trim();
    const iconMap: Record<string, string> = {
      "flutter": "💙",
      "react": "⚛️",
      "next.js": "▲",
      "nextjs": "▲",
      "typescript": "🔷",
      "javascript": "🟨",
      "node.js": "🟢",
      "nodejs": "🟢",
      "python": "🐍",
      "java": "☕",
      "dart": "🎯",
      "html": "🌐",
      "css": "🎨",
      "tailwind": "🌊",
      "supabase": "⚡",
      "firebase": "🔥",
      "mongodb": "🍃",
      "postgresql": "🐘",
      "git": "📦",
      "github": "🐙",
      "docker": "🐳",
      "kubernetes": "☸️",
      "aws": "☁️",
      "figma": "🎭",
      "android": "🤖",
      "ios": "🍎",
      "vue": "💚",
      "angular": "🔴",
      "svelte": "🧡",
    };
    return iconMap[normalizedName] || "⚡";
  };

  if (!tools || tools.length === 0) {
    return null;
  }

  return (
    <ScrollAnimation delay={200}>
      <div className="mt-12 sm:mt-16 md:mt-20">
        <div className="text-center mb-6 sm:mb-8 md:mb-10 space-y-2">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">Technologies & Tools</h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            Technologies I specialize in and use daily
          </p>
          <div className="w-12 sm:w-16 md:w-20 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
        </div>

        {/* Tools Grid - Stunning responsive design */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {tools.map((tool, index) => (
            <ScrollAnimation key={index} delay={index * 50}>
              <div
                className="
                  group relative
                  px-3 sm:px-4 md:px-5 lg:px-6 
                  py-4 sm:py-5 md:py-6
                  bg-gradient-to-br from-card via-card/95 to-card/80
                  dark:from-card dark:via-card/90 dark:to-card/70
                  border border-border/50 
                  rounded-xl sm:rounded-2xl
                  shadow-sm hover:shadow-2xl
                  transition-all duration-300 ease-out
                  hover:-translate-y-2 hover:scale-105
                  hover:border-primary/50
                  hover:bg-gradient-to-br hover:from-primary/10 hover:via-primary/5 hover:to-card/90
                  dark:hover:from-primary/15 dark:hover:via-primary/10 dark:hover:to-card/80
                  backdrop-blur-sm
                  overflow-hidden
                  cursor-default
                "
              >
                {/* Animated background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-primary/0 transition-all duration-500 -z-10" />
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10" />
                
                <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 relative z-10">
                  {/* Icon with enhanced animation */}
                  <div className="
                    text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                    transition-all duration-300 ease-out
                    group-hover:scale-125 group-hover:rotate-6
                    filter group-hover:drop-shadow-lg
                    relative
                  ">
                    <span className="block group-hover:animate-pulse">
                      {tool.icon || getTechIcon(tool.name)}
                    </span>
                  </div>
                  
                  {/* Tool Name */}
                  <div className="text-center w-full">
                    <span className="
                      text-xs sm:text-sm md:text-base lg:text-lg
                      font-bold
                      text-foreground 
                      group-hover:text-primary 
                      transition-colors duration-300
                      block
                      break-words
                    ">
                      {tool.name}
                    </span>
                    {tool.category && (
                      <span className="
                        text-[9px] sm:text-[10px] md:text-xs 
                        text-muted-foreground 
                        block mt-1
                        opacity-0 group-hover:opacity-100
                        transition-opacity duration-300
                      ">
                        {tool.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Corner accent on hover */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-primary/0 group-hover:bg-primary/10 rounded-bl-full transition-colors duration-300 -z-10" />
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </ScrollAnimation>
  );
}





