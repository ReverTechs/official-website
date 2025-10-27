import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Download, ExternalLink } from "lucide-react";
import Image from "next/image";

interface AppCardProps {
  title: string;
  description: string;
  category: string;
  downloadLink: string;
  imageUrl?: string;
  tags: string[];
}

export function AppCard({ title, description, category, downloadLink, tags }: AppCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 group hover:-translate-y-2">
      {/* App Image/Icon Placeholder */}
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="relative z-10 text-6xl font-bold text-primary/50 group-hover:scale-110 transition-transform duration-300">
          {title.charAt(0)}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-sm text-muted-foreground">{category}</p>
          </div>
          <Badge variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">{tags[0]}</Badge>
        </div>

        <p className="text-muted-foreground leading-relaxed">{description}</p>

        <div className="flex flex-wrap gap-2">
          {tags.slice(1).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="pt-4">
          <a href={downloadLink} target="_blank" rel="noopener noreferrer">
            <Button className="w-full group-hover:bg-primary transition-all duration-300 group-hover:scale-105">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </a>
        </div>
      </div>
    </Card>
  );
}

