import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { BookmarkCard } from "@/components/shared/BookmarkCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Bookmark, Search, Trash2, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useUserBookmarks, useRemoveBookmark, useAddToLibrary } from "@/hooks/useUserLibrary";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

export default function Bookmarks() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: bookmarks = [], isLoading } = useUserBookmarks();
  const removeBookmark = useRemoveBookmark();
  const addToLibrary = useAddToLibrary();
  const { getSignedUrl } = useFileUpload();
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Redirect if not authenticated
  if (!user) {
    navigate("/login");
    return null;
  }

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.book?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.book?.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort bookmarks
  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return (a.book?.title || "").localeCompare(b.book?.title || "");
      case "rating":
        return (b.book?.average_rating || 0) - (a.book?.average_rating || 0);
      case "category":
        return (a.book?.category?.name || "").localeCompare(b.book?.category?.name || "");
      default: // recent
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const isAllSelected = sortedBookmarks.length > 0 && selectedIds.length === sortedBookmarks.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(sortedBookmarks.map(b => b.book_id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (bookId: string, selected: boolean) => {
    if (selected) {
      setSelectedIds([...selectedIds, bookId]);
    } else {
      setSelectedIds(selectedIds.filter(i => i !== bookId));
    }
  };

  const handleRemove = async (bookId: string) => {
    const bookmark = bookmarks.find(b => b.book_id === bookId);
    try {
      await removeBookmark.mutateAsync(bookId);
      setSelectedIds(selectedIds.filter(i => i !== bookId));
      toast({
        title: "Bookmark removed",
        description: `"${bookmark?.book?.title}" removed from bookmarks`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveSelected = async () => {
    try {
      await Promise.all(selectedIds.map(id => removeBookmark.mutateAsync(id)));
      toast({
        title: "Bookmarks removed",
        description: `${selectedIds.length} bookmarks removed`,
      });
      setSelectedIds([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (bookId: string, fileUrl: string | null, title: string) => {
    if (!fileUrl) {
      toast({
        title: "File not available",
        description: "This book's file is not available for download",
        variant: "destructive",
      });
      return;
    }

    setDownloadingId(bookId);
    try {
      await addToLibrary.mutateAsync(bookId);
      const signedUrl = await getSignedUrl(fileUrl);
      if (signedUrl) {
        window.open(signedUrl, "_blank");
        toast({
          title: "Download started",
          description: `Downloading "${title}"...`,
        });
      }
    } catch (error: any) {
      if (!error.message.includes("already in library")) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setDownloadingId(null);
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
        {sortedBookmarks.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {sortedBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                id={bookmark.book_id}
                title={bookmark.book?.title || "Unknown"}
                author={bookmark.book?.author || "Unknown"}
                rating={bookmark.book?.average_rating || 0}
                category={bookmark.book?.category?.name}
                dateAdded={formatDistanceToNow(new Date(bookmark.created_at), { addSuffix: true })}
                coverUrl={bookmark.book?.cover_url || undefined}
                isSelected={selectedIds.includes(bookmark.book_id)}
                onSelect={(selected) => handleSelect(bookmark.book_id, selected)}
                onRemove={() => handleRemove(bookmark.book_id)}
                onDownload={() => handleDownload(
                  bookmark.book_id, 
                  bookmark.book?.file_url || null, 
                  bookmark.book?.title || "Book"
                )}
                isDownloading={downloadingId === bookmark.book_id}
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
