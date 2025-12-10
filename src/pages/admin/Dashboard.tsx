import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RecentActivityFeed } from "@/components/admin/RecentActivityFeed";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  BookOpen,
  Users,
  Download,
  TrendingUp,
  Plus,
  Upload,
  Settings,
  BarChart3,
  FolderOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useBooks, useCategories } from "@/hooks/useBooks";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const { data: books = [], isLoading: booksLoading } = useBooks({});
  const { data: categories = [] } = useCategories();

  // Fetch user count
  const { data: userCount = 0 } = useQuery({
    queryKey: ["admin-user-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Calculate stats
  const totalBooks = books.length;
  const publishedBooks = books.filter(b => b.status === "published").length;
  const totalDownloads = books.reduce((sum, b) => sum + (b.download_count || 0), 0);
  const totalCategories = categories.filter(c => !c.parent_id).length;

  // Get top downloaded books
  const topBooks = [...books]
    .sort((a, b) => (b.download_count || 0) - (a.download_count || 0))
    .slice(0, 5);

  const stats = [
    {
      title: "Total Books",
      value: totalBooks.toLocaleString(),
      icon: BookOpen,
      subtext: `${publishedBooks} published`,
    },
    {
      title: "Total Users",
      value: userCount.toLocaleString(),
      icon: Users,
      subtext: "registered users",
    },
    {
      title: "Total Downloads",
      value: totalDownloads.toLocaleString(),
      icon: Download,
      subtext: "all time",
    },
    {
      title: "Categories",
      value: totalCategories.toLocaleString(),
      icon: FolderOpen,
      subtext: `${categories.length} total with subcategories`,
    },
  ];

  if (booksLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-muted-foreground">
              Overview of your digital library
            </p>
          </div>
          <Link to="/admin/books">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Book
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-display text-2xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.subtext}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Link to="/admin/books">
                <Button
                  variant="outline"
                  className="h-auto w-full flex-col items-start gap-1 p-4"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="font-medium">Manage Books</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Add, edit, or remove books
                  </span>
                </Button>
              </Link>

              <Button
                variant="outline"
                className="h-auto w-full flex-col items-start gap-1 p-4"
                disabled
              >
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Manage Users</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  View and manage users
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-auto w-full flex-col items-start gap-1 p-4"
                disabled
              >
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-secondary" />
                  <span className="font-medium">Bulk Upload</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Import multiple books (coming soon)
                </span>
              </Button>

              <Link to="/categories">
                <Button
                  variant="outline"
                  className="h-auto w-full flex-col items-start gap-1 p-4"
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Categories</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    View all categories
                  </span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivityFeed />
            </CardContent>
          </Card>
        </div>

        {/* Top Downloads */}
        <Card className="mt-6 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
              Top Downloaded Books
            </CardTitle>
            <Link to="/admin/books">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {topBooks.length > 0 ? (
              <div className="space-y-4">
                {topBooks.map((book, index) => (
                  <div
                    key={book.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {index + 1}
                      </span>
                      <div className="flex items-center gap-3">
                        {book.cover_url && (
                          <img 
                            src={book.cover_url} 
                            alt={book.title}
                            className="h-10 w-8 rounded object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {book.author}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary">
                        {(book.download_count || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">downloads</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No books yet</p>
                <Link to="/admin/books">
                  <Button className="mt-4" size="sm">
                    Add Your First Book
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
