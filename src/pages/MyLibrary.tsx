import { Layout } from "@/components/layout/Layout";
import { BookCard } from "@/components/shared/BookCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Download, Clock } from "lucide-react";

// Mock library data
const downloadedBooks = [
  { id: "1", title: "The Book of Knowledge", author: "Imam Al-Ghazali", rating: 4.8 },
  { id: "2", title: "Rumi's Poetry Collection", author: "Jalal ad-Din Rumi", rating: 4.9 },
];

const recentlyRead = [
  { id: "1", title: "The Book of Knowledge", author: "Imam Al-Ghazali", rating: 4.8 },
];

export default function MyLibrary() {
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

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your library..."
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="downloaded" className="space-y-6">
          <TabsList>
            <TabsTrigger value="downloaded" className="gap-2">
              <Download className="h-4 w-4" />
              Downloaded
            </TabsTrigger>
            <TabsTrigger value="recent" className="gap-2">
              <Clock className="h-4 w-4" />
              Recently Read
            </TabsTrigger>
          </TabsList>

          <TabsContent value="downloaded">
            {downloadedBooks.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {downloadedBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    rating={book.rating}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Download className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No downloaded books yet</p>
                <Button className="mt-4" asChild>
                  <a href="/categories">Browse Books</a>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent">
            {recentlyRead.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {recentlyRead.map((book) => (
                  <BookCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    rating={book.rating}
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
        </Tabs>
      </div>
    </Layout>
  );
}
