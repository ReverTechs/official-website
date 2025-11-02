import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import Image from "next/image";
import { formatDownloads } from "@/lib/utils";

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
}

export function AppCard({ title, description, category, downloadLink, tags, id, filePath, imageUrl, imagePath, downloads = 0 }: AppCardProps) {
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

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 group hover:-translate-y-1 sm:hover:-translate-y-2">
      {/* App Image */}
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative overflow-hidden">
        {hasImage && displayImage ? (
          <>
            <Image
              src={displayImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-bold text-primary/50 group-hover:scale-110 transition-transform duration-300">
              {title.charAt(0)}
            </div>
          </>
        )}
      </div>

      <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 group-hover:text-primary transition-colors truncate">{title}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs sm:text-sm text-muted-foreground">{category}</p>
              {downloads > 0 && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 dark:bg-primary/20 text-xs sm:text-sm">
                  <Download className="h-3 w-3 text-primary" />
                  <span className="font-semibold text-primary">{formatDownloads(downloads)}</span>
                  <span className="text-muted-foreground">downloads</span>
                </div>
              )}
            </div>
          </div>
          {tags[0] && (
            <Badge variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex-shrink-0 text-xs sm:text-sm">
              {tags[0]}
            </Badge>
          )}
        </div>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">{description}</p>

        {tags.length > 1 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {tags.slice(1).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="pt-2 sm:pt-4">
          <Button 
            onClick={handleDownload}
            className="w-full group-hover:bg-primary transition-all duration-300 group-hover:scale-105 text-sm sm:text-base h-9 sm:h-10"
          >
            <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Download
          </Button>
        </div>
      </div>
    </Card>
  );
}

