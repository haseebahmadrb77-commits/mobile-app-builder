import { BookOpen, Download, Star, UserPlus } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "book_added" | "download" | "review" | "user_joined";
  title: string;
  description: string;
  timestamp: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "book_added",
    title: "New Book Added",
    description: '"The Book of Wisdom" was added to Islamic Books',
    timestamp: "2 minutes ago",
  },
  {
    id: "2",
    type: "download",
    title: "Book Downloaded",
    description: '"Rumi\'s Poetry" was downloaded 50 times today',
    timestamp: "15 minutes ago",
  },
  {
    id: "3",
    type: "user_joined",
    title: "New User Registered",
    description: "Ahmed Hassan joined the library",
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    type: "review",
    title: "New Review",
    description: '"The Book of Knowledge" received a 5-star review',
    timestamp: "2 hours ago",
  },
  {
    id: "5",
    type: "book_added",
    title: "New Book Added",
    description: '"Tales from the East" was added to Fiction',
    timestamp: "3 hours ago",
  },
];

const iconMap = {
  book_added: BookOpen,
  download: Download,
  review: Star,
  user_joined: UserPlus,
};

const colorMap = {
  book_added: "text-primary bg-primary/10",
  download: "text-blue-500 bg-blue-500/10",
  review: "text-secondary bg-secondary/10",
  user_joined: "text-green-500 bg-green-500/10",
};

export function RecentActivityFeed() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = iconMap[activity.type];
        return (
          <div key={activity.id} className="flex items-start gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${colorMap[activity.type]}`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                {activity.title}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {activity.description}
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                {activity.timestamp}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
