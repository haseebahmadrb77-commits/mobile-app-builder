import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Download, BookmarkMinus } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookmarkCardProps {
  id: string;
  title: string;
  author: string;
  rating?: number;
  category?: string;
  coverUrl?: string;
  dateAdded?: string;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  onRemove?: () => void;
  onDownload?: () => void;
}

export function BookmarkCard({
  id,
  title,
  author,
  rating,
  category,
  coverUrl,
  dateAdded,
  isSelected = false,
  onSelect,
  onRemove,
  onDownload,
}: BookmarkCardProps) {
  return (
    <Card className={cn(
      "group overflow-hidden border-border/50 transition-all hover:border-primary/30",
      isSelected && "border-primary ring-1 ring-primary"
    )}>
      <div className="relative">
        <Link to={`/book/${id}`}>
          <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10">
            {coverUrl ? (
              <img src={coverUrl} alt={title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-display text-4xl text-muted-foreground/30">
                  {title.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Checkbox for selection */}
        <div className="absolute left-2 top-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="h-5 w-5 border-2 border-background bg-background/80"
          />
        </div>

        {/* Category Badge */}
        {category && (
          <Badge 
            variant="secondary" 
            className="absolute right-2 top-2 text-xs"
          >
            {category}
          </Badge>
        )}
      </div>

      <CardContent className="p-3">
        <Link to={`/book/${id}`}>
          <h3 className="truncate font-medium text-sm text-foreground hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="truncate text-xs text-muted-foreground">{author}</p>
        
        <div className="mt-2 flex items-center justify-between">
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              <span className="text-xs font-medium">{rating}</span>
            </div>
          )}
          {dateAdded && (
            <span className="text-xs text-muted-foreground">{dateAdded}</span>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <Button 
            onClick={onDownload} 
            size="sm" 
            className="flex-1 gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
          <Button 
            onClick={onRemove} 
            variant="outline" 
            size="icon"
            className="h-8 w-8 shrink-0"
          >
            <BookmarkMinus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
