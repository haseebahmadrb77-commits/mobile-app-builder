import { Link } from "react-router-dom";
import { Star, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  rating?: number;
  category?: string;
  downloadCount?: number;
  className?: string;
}

export function BookCard({
  id,
  title,
  author,
  coverUrl,
  rating,
  category,
  downloadCount,
  className,
}: BookCardProps) {
  return (
    <Link to={`/book/${id}`}>
      <Card className={cn(
        "group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:shadow-elegant hover:-translate-y-1",
        className
      )}>
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <span className="font-display text-2xl text-muted-foreground/50">
                {title.charAt(0)}
              </span>
            </div>
          )}
          
          {/* Category Badge */}
          {category && (
            <Badge 
              variant="secondary" 
              className="absolute left-2 top-2 bg-secondary/90 text-secondary-foreground"
            >
              {category}
            </Badge>
          )}
        </div>

        <CardContent className="p-3">
          {/* Title */}
          <h3 className="font-display text-sm font-semibold leading-tight text-foreground line-clamp-2">
            {title}
          </h3>
          
          {/* Author */}
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
            {author}
          </p>

          {/* Stats */}
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            {rating !== undefined && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-secondary text-secondary" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
            
            {downloadCount !== undefined && (
              <div className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                <span>{downloadCount}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
