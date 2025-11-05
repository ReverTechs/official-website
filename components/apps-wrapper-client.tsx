"use client";

import { AppCard } from "./app-card";
import { ScrollAnimation } from "./scroll-animation";

interface AppsWrapperClientProps {
  apps: any[];
}

export function AppsWrapperClient({ apps }: AppsWrapperClientProps) {
  // Get the first app as featured, rest as regular apps
  const featuredApp = apps.length > 0 ? apps[0] : null;
  const regularApps = apps.length > 1 ? apps.slice(1) : [];

  // If no apps, show empty state
  if (apps.length === 0) {
    return (
      <>
        <ScrollAnimation>
          <div className="mb-12 sm:mb-16 md:mb-20 space-y-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="space-y-3">
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  My Apps
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  Discover my collection of mobile and web applications designed to enhance your digital life.
                </p>
              </div>
            </div>
          </div>
        </ScrollAnimation>
        <ScrollAnimation delay={200}>
          <div className="text-center py-16 sm:py-20">
            <p className="text-base sm:text-lg text-muted-foreground">
              Apps will appear here soon. Check back later!
            </p>
          </div>
        </ScrollAnimation>
      </>
    );
  }

  return (
    <>
      {/* Apple-style Header */}
      <ScrollAnimation>
        <div className="mb-12 sm:mb-16 md:mb-20 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-3">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                My Apps
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Discover my collection of mobile and web applications designed to enhance your digital life.
              </p>
            </div>
          </div>
        </div>
      </ScrollAnimation>

      {/* Featured App Section - Apple App Store Hero Style */}
      {featuredApp && (
        <ScrollAnimation delay={100}>
          <div className="mb-12 sm:mb-16 md:mb-20">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                Featured
              </h3>
            </div>
            <AppCard 
              title={featuredApp.title}
              description={featuredApp.description}
              category={featuredApp.category}
              downloadLink={featuredApp.download_link || ""}
              tags={featuredApp.tags || []}
              id={featuredApp.id}
              filePath={featuredApp.file_path}
              imageUrl={featuredApp.image_url}
              imagePath={featuredApp.image_path}
              downloads={featuredApp.downloads || 0}
              featured={true}
            />
          </div>
        </ScrollAnimation>
      )}

      {/* Regular Apps Grid */}
      {regularApps.length > 0 && (
        <>
          <ScrollAnimation delay={200}>
            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                All Apps
              </h3>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {regularApps.map((app, index) => (
              <ScrollAnimation key={app.id} delay={300 + index * 100}>
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
                  downloads={app.downloads || 0}
                  featured={false}
                />
              </ScrollAnimation>
            ))}
          </div>
        </>
      )}

      {/* Footer Message */}
      <ScrollAnimation delay={300 + regularApps.length * 100}>
        <div className="text-center mt-12 sm:mt-16 md:mt-20 pt-8 border-t border-border/50">
          <p className="text-sm sm:text-base text-muted-foreground">
            More apps coming soon! Check back regularly for updates.
          </p>
        </div>
      </ScrollAnimation>
    </>
  );
}




