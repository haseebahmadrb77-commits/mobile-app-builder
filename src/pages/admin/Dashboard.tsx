import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Download, TrendingUp } from "lucide-react";

const stats = [
  { title: "Total Books", value: "5,420", icon: BookOpen, change: "+12%" },
  { title: "Total Users", value: "10,234", icon: Users, change: "+8%" },
  { title: "Downloads", value: "45,678", icon: Download, change: "+23%" },
  { title: "Active Readers", value: "3,456", icon: TrendingUp, change: "+5%" },
];

export default function AdminDashboard() {
  return (
    <Layout>
      <div className="container py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Overview of your digital library
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="font-display text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-green-600">{stat.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-6 border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="/admin/books"
              className="flex items-center gap-3 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted"
            >
              <BookOpen className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Manage Books</p>
                <p className="text-sm text-muted-foreground">Add, edit, or remove books</p>
              </div>
            </a>
            <a
              href="/admin/users"
              className="flex items-center gap-3 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted"
            >
              <Users className="h-6 w-6 text-secondary" />
              <div>
                <p className="font-medium">Manage Users</p>
                <p className="text-sm text-muted-foreground">View and manage users</p>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
