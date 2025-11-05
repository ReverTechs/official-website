"use client";

import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Download, ArrowRight } from "lucide-react";
import Image from "next/image";
import { formatDownloads } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

interface AppCardProps {
  title: string;
  description: string;
  category: string;
  downloadLink: string;
  imageUrl?: string;
  tags: string[];
  id?: string;
  filePath?: string | null;
  imagePath?: string | null;
  downloads?: number;
  featured?: boolean;
}

export function AppCard({ title, description, category, downloadLink, tags, id, filePath, imageUrl, imagePath, downloads = 0, featured = false }: AppCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = cardRef.current;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const rotateMax = 8; // degrees
    const rotateY = ((x / rect.width) - 0.5) * (rotateMax * 2);
    const rotateX = -((y / rect.height) - 0.5) * (rotateMax * 2);
    target.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  };

  const handleMouseLeave = () => {
    const target = cardRef.current;
    if (!target) return;
    target.style.transform = "rotateX(0deg) rotateY(0deg)";
  };
  const handleDownload = () => {
    // If file_path exists, use the download API route
    if (filePath && id) {
      window.location.href = `/api/apps/download?appId=${id}`;
    } else if (downloadLink) {
      // Otherwise, use the external download link
      window.open(downloadLink, "_blank", "noopener,noreferrer");
    }
  };

  // Determine which image to show: uploaded image, external image URL, or fallback to letter
  // If image_url exists, use it (it will be set for both uploaded images and external URLs)
  const hasImage = imageUrl || imagePath;
  const displayImage = imageUrl;

  if (featured) {
    // Featured large card style (Apple App Store hero style)
    return (
      <Card className={cn(
        "overflow-hidden border-0 bg-gradient-to-br from-card to-card/80",
        "hover:shadow-2xl transition-all duration-500 ease-out",
        "group cursor-pointer",
        "rounded-3xl"
      )}>
        <div className="relative">
          {/* App Image - Hero Style */}
          <div className={cn(
            "relative overflow-hidden",
            "bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5",
            featured ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-video"
          )}>
            {hasImage && displayImage ? (
              <>
                <Image
                  src={displayImage}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary/60 group-hover:scale-110 transition-transform duration-700">
                    {title.charAt(0)}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                {tags[0] && (
                  <Badge className="bg-white/90 text-black hover:bg-white transition-colors text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full">
                    {tags[0]}
                  </Badge>
                )}
                <span className="text-white/90 text-xs sm:text-sm font-medium">{category}</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                {title}
              </h3>
              
              <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl line-clamp-2 drop-shadow">
                {description}
              </p>

              <div className="flex items-center gap-4 pt-2">
                {downloads > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm">
                    <Download className="h-3.5 w-3.5" />
                    <span className="font-semibold">{formatDownloads(downloads)}</span>
                  </div>
                )}
                
                <Button 
                  onClick={handleDownload}
                  className="bg-white text-black hover:bg-white/90 transition-all duration-300 rounded-full px-6 py-2.5 h-auto font-semibold text-sm sm:text-base group/btn"
                >
                  Get
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Regular card style (Apple App Store standard cards)
  return (
    <div
      className="[perspective:1000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Card ref={cardRef} className={cn(
      "overflow-hidden border-0 bg-card/50 backdrop-blur-sm",
      "hover:shadow-2xl transition-all duration-500 ease-out",
      "group cursor-pointer",
      "rounded-2xl",
      "hover:-translate-y-2",
      "[transform-style:preserve-3d]"
    )}>
      {/* Dynamic light highlight following the cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, hsl(var(--primary)/0.15), transparent 40%)`
        }}
      />
      {/* App Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5">
        {hasImage && displayImage ? (
          <>
            <Image
              src={displayImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10" />
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary/40 group-hover:scale-110 group-hover:text-primary/60 transition-all duration-500">
                {title.charAt(0)}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold mb-1.5 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">{category}</p>
            </div>
            {tags[0] && (
              <Badge 
                variant="outline" 
                className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 flex-shrink-0 text-xs rounded-full px-2.5 py-1"
              >
                {tags[0]}
              </Badge>
            )}
          </div>
          
          {downloads > 0 && (
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
              <Download className="h-3.5 w-3.5" />
              <span className="font-medium">{formatDownloads(downloads)} downloads</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(1, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs rounded-full px-2.5 py-1 bg-secondary/50"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Download Button */}
        <div className="pt-2">
          <Button 
            onClick={handleDownload}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 rounded-xl h-10 sm:h-11 font-semibold text-sm sm:text-base group/btn shadow-lg hover:shadow-xl"
          >
            Get
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Card>
    </div>
  );
}

