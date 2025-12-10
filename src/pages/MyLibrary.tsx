import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { LibraryBookCard } from "@/components/shared/LibraryBookCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Download, Clock, BookOpen, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useUserLibrary, useRemoveFromLibrary, useReadingProgress } from "@/hooks/useUserLibrary";

import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

export default function MyLibrary() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: library = [], isLoading } = useUserLibrary();
  const { data: allProgress = [] } = useReadingProgress();
  const removeFromLibrary = useRemoveFromLibrary();
  
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  // Redirect if not authenticated
  if (!user) {
    navigate("/login");
    return null;
  }

  // Get progress for each book
  const progressMap = new Map(
    Array.isArray(allProgress) 
      ? allProgress.map(p => [p.book_id, p]) 
      : []
  );

  const libraryWithProgress = library.map(item => ({
    ...item,
    progress: progressMap.get(item.book_id),
  }));

  const filteredLibrary = libraryWithProgress.filter(item =>
    item.book?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.book?.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort library
  const sortedLibrary = [...filteredLibrary].sort((a, b) => {
    switch (sortBy) {
      case "progress":
        return (b.progress?.progress_percent || 0) - (a.progress?.progress_percent || 0);
      case "title":
        return (a.book?.title || "").localeCompare(b.book?.title || "");
      case "author":
        return (a.book?.author || "").localeCompare(b.book?.author || "");
      default: // recent
        return new Date(b.last_opened_at || b.downloaded_at).getTime() - 
               new Date(a.last_opened_at || a.downloaded_at).getTime();
    }
  });

  const recentlyRead = sortedLibrary.filter(item => item.last_opened_at);
  const inProgress = sortedLibrary.filter(
    item => (item.progress?.progress_percent || 0) > 0 && 
            (item.progress?.progress_percent || 0) < 100
  );
  const completed = sortedLibrary.filter(
    item => (item.progress?.progress_percent || 0) >= 100
  );

  const stats = {
    total: library.length,
    inProgress: inProgress.length,
    completed: completed.length,
  };

  const handleRemove = async (bookId: string, bookTitle: string) => {
    try {
      await removeFromLibrary.mutateAsync(bookId);
      toast({
        title: "Book removed",
        description: `"${bookTitle}" has been removed from your library`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRead = async (bookId: string, fileUrl: string | null, bookTitle: string) => {
    if (!fileUrl) {
      toast({
        title: "File not available",
        description: "This book's file is not available",
        variant: "destructive",
      });
      return;
    }

    try {
      window.open(fileUrl, "_blank");
      toast({
        title: "Opening book",
        description: `Opening "${bookTitle}"...`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  const renderBookGrid = (books: typeof sortedLibrary) => {
    if (books.length === 0) {
      return null;
    }

    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {books.map((item) => (
          <LibraryBookCard
            key={item.id}
            id={item.book_id}
            title={item.book?.title || "Unknown"}
            author={item.book?.author || "Unknown"}
            progress={item.progress?.progress_percent || 0}
            lastRead={item.last_opened_at 
              ? formatDistanceToNow(new Date(item.last_opened_at), { addSuffix: true })
              : undefined
            }
            coverUrl={item.book?.cover_url || undefined}
            onRemove={() => handleRemove(item.book_id, item.book?.title || "Book")}
            onRead={() => handleRead(item.book_id, item.book?.file_url || null, item.book?.title || "Book")}
          />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            My Library
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your downloaded books and reading history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Books</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                <BookOpen className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                <Download className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Sort */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search your library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Read</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="author">Author A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="downloaded" className="space-y-6">
          <TabsList>
            <TabsTrigger value="downloaded" className="gap-2">
              <Download className="h-4 w-4" />
              All Books ({library.length})
            </TabsTrigger>
            <TabsTrigger value="recent" className="gap-2">
              <Clock className="h-4 w-4" />
              Recently Read
            </TabsTrigger>
            <TabsTrigger value="reading" className="gap-2">
              <BookOpen className="h-4 w-4" />
              In Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="downloaded">
            {sortedLibrary.length > 0 ? (
              renderBookGrid(sortedLibrary)
            ) : searchQuery ? (
              <div className="py-16 text-center">
                <p className="text-muted-foreground">No books found for "{searchQuery}"</p>
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Download className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No downloaded books yet</p>
                <Button className="mt-4" asChild>
                  <Link to="/categories">Browse Books</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent">
            {recentlyRead.length > 0 ? (
              renderBookGrid(recentlyRead)
            ) : (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No reading history yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start reading to see your history here
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reading">
            {inProgress.length > 0 ? (
              renderBookGrid(inProgress)
            ) : (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No books in progress</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start reading a book to track your progress
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
