import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { useAuth } from "@/contexts/AuthContext";
import {
  Settings,
  BookOpen,
  Bookmark,
  Download,
  ChevronRight,
  Clock,
  LogOut,
  HelpCircle,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

// Mock recent activity (will be replaced with real data later)
const recentActivity = [
  { id: "1", action: "Downloaded", book: "The Book of Knowledge", time: "2 hours ago" },
  { id: "2", action: "Bookmarked", book: "Rumi's Poetry Collection", time: "5 hours ago" },
  { id: "3", action: "Started reading", book: "Tales of the Prophets", time: "1 day ago" },
];

// Mock stats (will be replaced with real data later)
const stats = {
  downloaded: 12,
  bookmarks: 8,
  reading: 3,
};

export default function Profile() {
  const { user, profile, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleProfileUpdate = async (data: { name: string }) => {
    const { error } = await updateProfile({ display_name: data.name });
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
    }
  };

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "User";
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <Layout>
      <div className="container max-w-2xl py-6">
        {/* Profile Header */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <Avatar className="h-24 w-24 ring-4 ring-primary/10">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="font-display text-xl font-semibold text-foreground">
                  {displayName}
                </h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Member since {joinDate}
                </p>
                <div className="mt-3">
                  <EditProfileDialog
                    user={{
                      name: displayName,
                      email: user?.email || "",
                      avatarUrl: profile?.avatar_url,
                    }}
                    onSave={handleProfileUpdate}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Download className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-2 font-display text-2xl font-bold text-foreground">
                {stats.downloaded}
              </p>
              <p className="text-xs text-muted-foreground">Downloaded</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Bookmark className="mx-auto h-5 w-5 text-secondary" />
              <p className="mt-2 font-display text-2xl font-bold text-foreground">
                {stats.bookmarks}
              </p>
              <p className="text-xs text-muted-foreground">Bookmarks</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <BookOpen className="mx-auto h-5 w-5 text-teal-600" />
              <p className="mt-2 font-display text-2xl font-bold text-foreground">
                {stats.reading}
              </p>
              <p className="text-xs text-muted-foreground">Reading</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {activity.action}{" "}
                    <span className="text-primary">{activity.book}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-6 space-y-2">
          <h3 className="mb-3 font-display text-sm font-medium text-muted-foreground">
            Library
          </h3>
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
        </div>

        {/* Account Links */}
        <div className="mt-6 space-y-2">
          <h3 className="mb-3 font-display text-sm font-medium text-muted-foreground">
            Account
          </h3>
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

          <Card className="border-border/50 transition-colors hover:bg-muted/50">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Privacy & Security</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card className="border-border/50 transition-colors hover:bg-muted/50">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Help & Support</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer border-border/50 transition-colors hover:bg-destructive/5"
            onClick={handleSignOut}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <LogOut className="h-5 w-5 text-destructive" />
                <span className="font-medium text-destructive">Sign Out</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
