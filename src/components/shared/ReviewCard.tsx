import { Star, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ReviewCardProps {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  helpful?: number;
}

export function ReviewCard({ userName, rating, date, comment, helpful = 0 }: ReviewCardProps) {
  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <div className="border-b border-border pb-4 last:border-0">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">{userName}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
          
          <div className="mt-1 flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < rating
                    ? "fill-secondary text-secondary"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
          
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {comment}
          </p>
          
          <Button variant="ghost" size="sm" className="mt-2 h-8 gap-1 text-xs text-muted-foreground">
            <ThumbsUp className="h-3.5 w-3.5" />
            Helpful ({helpful})
          </Button>
        </div>
      </div>
    </div>
  );
}
