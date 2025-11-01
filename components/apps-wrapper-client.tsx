"use client";

import { AppCard } from "./app-card";
import { ScrollAnimation } from "./scroll-animation";

interface AppsWrapperClientProps {
  apps: any[];
}

export function AppsWrapperClient({ apps }: AppsWrapperClientProps) {
  return (
    <>
      <ScrollAnimation>
        <div className="text-center mb-8 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">My Apps</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Discover my collection of mobile and web applications designed to enhance your digital life.
          </p>
          <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
        </div>
      </ScrollAnimation>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {apps.map((app, index) => (
          <ScrollAnimation key={app.id} delay={index * 100}>
            <AppCard 
              title={app.title}
              description={app.description}
              category={app.category}
              downloadLink={app.download_link || ""}
              tags={app.tags || []}
              id={app.id}
              filePath={app.file_path}
              imageUrl={app.image_url}
              imagePath={app.image_path}
            />
          </ScrollAnimation>
        ))}
      </div>

      <ScrollAnimation delay={300}>
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-sm sm:text-base text-muted-foreground">
            More apps coming soon! Check back regularly for updates.
          </p>
        </div>
      </ScrollAnimation>
    </>
  );
}




