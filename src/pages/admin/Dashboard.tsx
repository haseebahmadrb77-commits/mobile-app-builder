import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RecentActivityFeed } from "@/components/admin/RecentActivityFeed";
import {
  BookOpen,
  Users,
  Download,
  TrendingUp,
  Plus,
  Upload,
  Settings,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Total Books",
    value: "5,420",
    icon: BookOpen,
    change: "+12%",
    changeType: "positive" as const,
    description: "from last month",
  },
  {
    title: "Total Users",
    value: "10,234",
    icon: Users,
    change: "+8%",
    changeType: "positive" as const,
    description: "from last month",
  },
  {
    title: "Downloads",
    value: "45,678",
    icon: Download,
    change: "+23%",
    changeType: "positive" as const,
    description: "from last month",
  },
  {
    title: "Active Readers",
    value: "3,456",
    icon: TrendingUp,
    change: "+5%",
    changeType: "positive" as const,
    description: "from last month",
  },
];

const topBooks = [
  { title: "The Book of Knowledge", downloads: 1234, category: "Islamic" },
  { title: "Rumi's Poetry Collection", downloads: 987, category: "Poetry" },
  { title: "Tales of the Prophets", downloads: 876, category: "Islamic" },
  { title: "The Art of Living", downloads: 654, category: "Self-Help" },
];

export default function AdminDashboard() {
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
                <p className="mt-1 text-xs">
                  <span className="text-green-600">{stat.change}</span>{" "}
                  <span className="text-muted-foreground">{stat.description}</span>
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
              >
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-secondary" />
                  <span className="font-medium">Bulk Upload</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Import multiple books
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-auto w-full flex-col items-start gap-1 p-4"
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Settings</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Configure library settings
                </span>
              </Button>
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
              Top Downloads This Month
            </CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBooks.map((book, index) => (
                <div
                  key={book.title}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{book.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {book.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">
                      {book.downloads.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">downloads</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
