import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookOpen, MoreVertical, Trash2, Download, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface LibraryBookCardProps {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  progress?: number;
  lastRead?: string;
  onRemove?: () => void;
  onRead?: () => void;
}

export function LibraryBookCard({
  id,
  title,
  author,
  coverUrl,
  progress = 0,
  lastRead,
  onRemove,
  onRead,
}: LibraryBookCardProps) {
  return (
    <Card className="group overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-md">
      <Link to={`/book/${id}`}>
        <div className="relative aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10">
          {coverUrl ? (
            <img src={coverUrl} alt={title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-display text-4xl text-muted-foreground/30">
                {title.charAt(0)}
              </span>
            </div>
          )}
          
          {/* Progress Overlay */}
          {progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-2">
              <Progress value={progress} className="h-1.5" />
              <span className="mt-1 text-xs text-foreground/80">{progress}% complete</span>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium text-sm text-foreground">{title}</h3>
            <p className="truncate text-xs text-muted-foreground">{author}</p>
            {lastRead && (
              <p className="mt-1 text-xs text-muted-foreground/70">Last read: {lastRead}</p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onRead} className="gap-2">
                <BookOpen className="h-4 w-4" />
                Continue Reading
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/book/${id}`} className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-destructive" onClick={onRemove}>
                <Trash2 className="h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button 
          onClick={onRead} 
          size="sm" 
          className="mt-3 w-full gap-2"
        >
          <BookOpen className="h-4 w-4" />
          {progress > 0 ? "Continue" : "Read"}
        </Button>
      </CardContent>
    </Card>
  );
}
