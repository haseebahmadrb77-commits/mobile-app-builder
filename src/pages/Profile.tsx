import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, BookOpen, Bookmark, Download, ChevronRight } from "lucide-react";

// Mock user data
const user = {
  name: "Guest User",
  email: "guest@example.com",
  avatarUrl: null,
  joinDate: "December 2024",
  stats: {
    downloaded: 12,
    bookmarks: 8,
    reading: 3,
  },
};

export default function Profile() {
  return (
    <Layout>
      <div className="container py-6">
        {/* Profile Header */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatarUrl || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="font-display text-xl font-semibold text-foreground">
                  {user.name}
                </h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Joined {user.joinDate}
                </p>
              </div>

              <Link to="/settings">
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Download className="mx-auto h-6 w-6 text-primary" />
              <p className="mt-2 font-display text-2xl font-bold text-foreground">
                {user.stats.downloaded}
              </p>
              <p className="text-xs text-muted-foreground">Downloaded</p>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Bookmark className="mx-auto h-6 w-6 text-secondary" />
              <p className="mt-2 font-display text-2xl font-bold text-foreground">
                {user.stats.bookmarks}
              </p>
              <p className="text-xs text-muted-foreground">Bookmarks</p>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <BookOpen className="mx-auto h-6 w-6 text-teal" />
              <p className="mt-2 font-display text-2xl font-bold text-foreground">
                {user.stats.reading}
              </p>
              <p className="text-xs text-muted-foreground">Reading</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="mt-6 space-y-2">
          <Link to="/my-library">
            <Card className="border-border/50 transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="font-medium">My Library</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/bookmarks">
            <Card className="border-border/50 transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Bookmark className="h-5 w-5 text-secondary" />
                  <span className="font-medium">Bookmarks</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/settings">
            <Card className="border-border/50 transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Settings</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
