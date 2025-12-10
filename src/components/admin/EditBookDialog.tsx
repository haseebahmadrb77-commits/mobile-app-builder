import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link as LinkIcon, Image, AlertCircle } from "lucide-react";
import { useCategories, useUpdateBook } from "@/hooks/useBooks";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Book {
  id: string;
  title: string;
  author: string;
  description?: string | null;
  category_id?: string | null;
  publisher?: string | null;
  publication_year?: number | null;
  isbn?: string | null;
  pages?: number | null;
  language?: string | null;
  status: string;
  cover_url?: string | null;
  file_url?: string | null;
}

interface EditBookDialogProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper to convert Google Drive share link to direct download/view link
const convertGoogleDriveLink = (shareLink: string): string => {
  if (!shareLink) return shareLink;
  
  // Check if already a direct link
  if (shareLink.includes('uc?export=download')) return shareLink;
  
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = shareLink.match(pattern);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
  }

  return shareLink;
};

// Helper to get Google Drive preview link for images
const getGoogleDrivePreviewLink = (shareLink: string): string => {
  if (!shareLink) return shareLink;
  
  // Check if already a preview/thumbnail link
  if (shareLink.includes('thumbnail?id=')) return shareLink;
  
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = shareLink.match(pattern);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
    }
  }

  return shareLink;
};

export function EditBookDialog({ book, open, onOpenChange }: EditBookDialogProps) {
  const { toast } = useToast();
  const { data: categories } = useCategories();
  const updateBook = useUpdateBook();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category_id: "",
    publisher: "",
    publication_year: "",
    isbn: "",
    pages: "",
    language: "English",
    status: "draft" as "draft" | "published",
    cover_url: "",
    file_url: "",
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        description: book.description || "",
        category_id: book.category_id || "",
        publisher: book.publisher || "",
        publication_year: book.publication_year?.toString() || "",
        isbn: book.isbn || "",
        pages: book.pages?.toString() || "",
        language: book.language || "English",
        status: (book.status as "draft" | "published") || "draft",
        cover_url: book.cover_url || "",
        file_url: book.file_url || "",
      });
    }
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!book) return;

    if (!formData.title || !formData.author) {
      toast({
        title: "Missing required fields",
        description: "Please fill in title and author",
        variant: "destructive",
      });
      return;
    }

    try {
      const bookData = {
        id: book.id,
        title: formData.title,
        author: formData.author,
        description: formData.description || null,
        category_id: formData.category_id || null,
        publisher: formData.publisher || null,
        publication_year: formData.publication_year ? parseInt(formData.publication_year) : null,
        isbn: formData.isbn || null,
        pages: formData.pages ? parseInt(formData.pages) : null,
        language: formData.language,
        status: formData.status,
        cover_url: formData.cover_url ? getGoogleDrivePreviewLink(formData.cover_url) : null,
        file_url: formData.file_url ? convertGoogleDriveLink(formData.file_url) : null,
      };

      await updateBook.mutateAsync(bookData);

      toast({
        title: "Book updated successfully",
        description: `"${formData.title}" has been updated`,
      });

      onOpenChange(false);
    } catch (error: any) {
      console.error("Update book error:", error);
      toast({
        title: "Failed to update book",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const allCategories = categories || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-display">Edit Book</DialogTitle>
          <DialogDescription>
            Update the book details. Use Google Drive shareable links for files.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Google Drive Info */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Use Google Drive shareable links. Make sure links are set to "Anyone with the link can view".
              </AlertDescription>
            </Alert>

            {/* Cover URL */}
            <div className="space-y-2">
              <Label htmlFor="edit_cover_url">Cover Image (Google Drive Link)</Label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="edit_cover_url"
                  placeholder="https://drive.google.com/file/d/..."
                  className="pl-10"
                  value={formData.cover_url}
                  onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                />
              </div>
              {formData.cover_url && (
                <div className="mt-2">
                  <img
                    src={getGoogleDrivePreviewLink(formData.cover_url)}
                    alt="Cover preview"
                    className="h-32 w-24 rounded-lg object-cover border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="edit_title">Title *</Label>
              <Input
                id="edit_title"
                placeholder="Enter book title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="edit_author">Author *</Label>
              <Input
                id="edit_author"
                placeholder="Enter author name"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>

            {/* Category */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit_category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.parent_id ? `└ ${cat.name}` : cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_language">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({ ...formData, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Arabic">Arabic</SelectItem>
                    <SelectItem value="Urdu">Urdu</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                placeholder="Enter book description..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Publication Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit_publisher">Publisher</Label>
                <Input
                  id="edit_publisher"
                  placeholder="Publisher name"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_year">Publication Year</Label>
                <Input
                  id="edit_year"
                  type="number"
                  placeholder="2024"
                  value={formData.publication_year}
                  onChange={(e) => setFormData({ ...formData, publication_year: e.target.value })}
                />
              </div>
            </div>

            {/* ISBN & Pages */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit_isbn">ISBN</Label>
                <Input
                  id="edit_isbn"
                  placeholder="978-3-16-148410-0"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_pages">Number of Pages</Label>
                <Input
                  id="edit_pages"
                  type="number"
                  placeholder="200"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                />
              </div>
            </div>

            {/* Book File URL */}
            <div className="space-y-2">
              <Label htmlFor="edit_file_url">Book File (Google Drive Link) *</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="edit_file_url"
                  placeholder="https://drive.google.com/file/d/..."
                  className="pl-10"
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Paste the shareable link from Google Drive (PDF format recommended)
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="edit_status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "draft" | "published") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateBook.isPending}>
              {updateBook.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
