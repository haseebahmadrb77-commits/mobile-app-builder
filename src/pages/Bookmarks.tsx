import { Layout } from "@/components/layout/Layout";
import { BookCard } from "@/components/shared/BookCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bookmark } from "lucide-react";

// Mock bookmarks data
const bookmarkedBooks = [
  { id: "3", title: "Tales of the Prophets", author: "Ibn Kathir", rating: 4.7, category: "Islamic" },
  { id: "4", title: "The Sealed Nectar", author: "Safiur Rahman", rating: 4.9, category: "Biography" },
];

export default function Bookmarks() {
  return (
    <Layout>
      <div className="container py-6">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Bookmarks
            </h1>
            <p className="mt-2 text-muted-foreground">
              {bookmarkedBooks.length} saved books
            </p>
          </div>

          <Select defaultValue="recent">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="title">A-Z</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bookmarks Grid */}
        {bookmarkedBooks.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {bookmarkedBooks.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                rating={book.rating}
                category={book.category}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Bookmark className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No bookmarked books yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Save books for later by clicking the bookmark icon
            </p>
            <Button className="mt-4" asChild>
              <a href="/categories">Browse Books</a>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
