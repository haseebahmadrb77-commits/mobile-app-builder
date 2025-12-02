import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { BookmarkCard } from "@/components/shared/BookmarkCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Bookmark, Search, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Mock bookmarks data
const initialBookmarks = [
  { id: "1", title: "The Book of Knowledge", author: "Imam Al-Ghazali", rating: 4.8, category: "Islamic", dateAdded: "2 days ago" },
  { id: "2", title: "Rumi's Poetry Collection", author: "Jalal ad-Din Rumi", rating: 4.9, category: "Poetry", dateAdded: "1 week ago" },
  { id: "3", title: "Tales of the Prophets", author: "Ibn Kathir", rating: 4.7, category: "Islamic", dateAdded: "2 weeks ago" },
  { id: "4", title: "The Sealed Nectar", author: "Safiur Rahman", rating: 4.9, category: "Biography", dateAdded: "3 weeks ago" },
  { id: "5", title: "Introduction to Arabic", author: "Dr. V. Abdur Rahim", rating: 4.5, category: "Education", dateAdded: "1 month ago" },
];

export default function Bookmarks() {
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const filteredBookmarks = bookmarks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAllSelected = filteredBookmarks.length > 0 && selectedIds.length === filteredBookmarks.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredBookmarks.map(b => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(i => i !== id));
    }
  };

  const handleRemove = (id: string) => {
    const book = bookmarks.find(b => b.id === id);
    setBookmarks(bookmarks.filter(b => b.id !== id));
    setSelectedIds(selectedIds.filter(i => i !== id));
    toast({
      title: "Bookmark removed",
      description: `"${book?.title}" removed from bookmarks`,
    });
  };

  const handleRemoveSelected = () => {
    setBookmarks(bookmarks.filter(b => !selectedIds.includes(b.id)));
    toast({
      title: "Bookmarks removed",
      description: `${selectedIds.length} bookmarks removed`,
    });
    setSelectedIds([]);
  };

  const handleDownload = (bookTitle: string) => {
    toast({
      title: "Download started",
      description: `Downloading "${bookTitle}"...`,
    });
  };

  const handleDownloadSelected = () => {
    toast({
      title: "Downloads started",
      description: `Downloading ${selectedIds.length} books...`,
    });
  };

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
              {bookmarks.length} saved books
            </p>
          </div>
        </div>

        {/* Search & Sort & Actions */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer">
                Select all
              </label>
            </div>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedIds.length} selected
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownloadSelected}
                  className="gap-1"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1 text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove bookmarks?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove {selectedIds.length} books from your bookmarks. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRemoveSelected}>
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Added</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bookmarks Grid */}
        {filteredBookmarks.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredBookmarks.map((book) => (
              <BookmarkCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                rating={book.rating}
                category={book.category}
                dateAdded={book.dateAdded}
                isSelected={selectedIds.includes(book.id)}
                onSelect={(selected) => handleSelect(book.id, selected)}
                onRemove={() => handleRemove(book.id)}
                onDownload={() => handleDownload(book.title)}
              />
            ))}
          </div>
        ) : searchQuery ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No bookmarks found for "{searchQuery}"</p>
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
              <Link to="/categories">Browse Books</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
