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
import { Link } from "react-router-dom";

// Mock library data
const downloadedBooks = [
  { 
    id: "1", 
    title: "The Book of Knowledge", 
    author: "Imam Al-Ghazali", 
    progress: 65,
    lastRead: "2 hours ago"
  },
  { 
    id: "2", 
    title: "Rumi's Poetry Collection", 
    author: "Jalal ad-Din Rumi", 
    progress: 30,
    lastRead: "Yesterday"
  },
  { 
    id: "3", 
    title: "Tales of the Prophets", 
    author: "Ibn Kathir", 
    progress: 0,
    lastRead: undefined
  },
  { 
    id: "4", 
    title: "The Sealed Nectar", 
    author: "Safiur Rahman", 
    progress: 100,
    lastRead: "Last week"
  },
];

const recentlyRead = [
  { 
    id: "1", 
    title: "The Book of Knowledge", 
    author: "Imam Al-Ghazali", 
    progress: 65,
    lastRead: "2 hours ago"
  },
  { 
    id: "2", 
    title: "Rumi's Poetry Collection", 
    author: "Jalal ad-Din Rumi", 
    progress: 30,
    lastRead: "Yesterday"
  },
];

export default function MyLibrary() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const filteredDownloaded = downloadedBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemove = (bookTitle: string) => {
    toast({
      title: "Book removed",
      description: `"${bookTitle}" has been removed from your library`,
    });
  };

  const handleRead = (bookTitle: string) => {
    toast({
      title: "Opening book",
      description: `Opening "${bookTitle}"...`,
    });
  };

  const stats = {
    total: downloadedBooks.length,
    inProgress: downloadedBooks.filter(b => b.progress > 0 && b.progress < 100).length,
    completed: downloadedBooks.filter(b => b.progress === 100).length,
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
              All Books ({downloadedBooks.length})
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
            {filteredDownloaded.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filteredDownloaded.map((book) => (
                  <LibraryBookCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    progress={book.progress}
                    lastRead={book.lastRead}
                    onRemove={() => handleRemove(book.title)}
                    onRead={() => handleRead(book.title)}
                  />
                ))}
              </div>
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
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {recentlyRead.map((book) => (
                  <LibraryBookCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    progress={book.progress}
                    lastRead={book.lastRead}
                    onRemove={() => handleRemove(book.title)}
                    onRead={() => handleRead(book.title)}
                  />
                ))}
              </div>
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
            {downloadedBooks.filter(b => b.progress > 0 && b.progress < 100).length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {downloadedBooks
                  .filter(b => b.progress > 0 && b.progress < 100)
                  .map((book) => (
                    <LibraryBookCard
                      key={book.id}
                      id={book.id}
                      title={book.title}
                      author={book.author}
                      progress={book.progress}
                      lastRead={book.lastRead}
                      onRemove={() => handleRemove(book.title)}
                      onRead={() => handleRead(book.title)}
                    />
                  ))}
              </div>
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
