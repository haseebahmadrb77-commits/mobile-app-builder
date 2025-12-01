import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface CategoryCardProps {
  id: string;
  name: string;
  description?: string;
  bookCount?: number;
  icon?: LucideIcon;
  imageUrl?: string;
  href?: string;
  variant?: "default" | "featured";
  className?: string;
}

export function CategoryCard({
  id,
  name,
  description,
  bookCount,
  icon: Icon,
  imageUrl,
  href,
  variant = "default",
  className,
}: CategoryCardProps) {
  const linkTo = href || `/books/${id}`;

  if (variant === "featured") {
    return (
      <Link to={linkTo}>
        <Card className={cn(
          "group relative overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80 transition-all duration-300 hover:shadow-elegant hover:-translate-y-1",
          className
        )}>
          {imageUrl && (
            <div className="absolute inset-0 opacity-20">
              <img 
                src={imageUrl} 
                alt={name} 
                className="h-full w-full object-cover"
              />
            </div>
          )}
          
          <CardContent className="relative flex flex-col items-center justify-center p-6 text-center">
            {Icon && (
              <div className="mb-3 rounded-full bg-primary-foreground/20 p-3">
                <Icon className="h-8 w-8 text-primary-foreground" />
              </div>
            )}
            
            <h3 className="font-display text-lg font-semibold text-primary-foreground">
              {name}
            </h3>
            
            {description && (
              <p className="mt-1 text-sm text-primary-foreground/80 line-clamp-2">
                {description}
              </p>
            )}
            
            {bookCount !== undefined && (
              <p className="mt-2 text-xs text-primary-foreground/70">
                {bookCount} books
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={linkTo}>
      <Card className={cn(
        "group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:shadow-card hover:border-primary/30",
        className
      )}>
        <CardContent className="flex items-center gap-4 p-4">
          {Icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-6 w-6" />
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-sm font-semibold text-foreground">
              {name}
            </h3>
            
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                {description}
              </p>
            )}
            
            {bookCount !== undefined && (
              <p className="mt-1 text-xs text-muted-foreground">
                {bookCount} books
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
