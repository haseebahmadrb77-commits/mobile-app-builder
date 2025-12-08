import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Progress } from "@/components/ui/progress";
import { Plus, Upload, X, FileText, Image } from "lucide-react";
import { useCategories, useCreateBook } from "@/hooks/useBooks";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useToast } from "@/hooks/use-toast";

interface AddBookDialogProps {
  trigger?: React.ReactNode;
}

export function AddBookDialog({ trigger }: AddBookDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { data: categories } = useCategories();
  const createBook = useCreateBook();
  const { isUploading, progress, uploadBookCover, uploadBookFile } = useFileUpload();
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
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
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBookFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBookFile(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      description: "",
      category_id: "",
      publisher: "",
      publication_year: "",
      isbn: "",
      pages: "",
      language: "English",
      status: "draft",
    });
    setCoverFile(null);
    setBookFile(null);
    setCoverPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.author) {
      toast({
        title: "Missing required fields",
        description: "Please fill in title and author",
        variant: "destructive",
      });
      return;
    }

    try {
      // First create the book to get its ID
      const bookData = {
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
        cover_url: null as string | null,
        file_url: null as string | null,
      };

      // Create book first
      const newBook = await createBook.mutateAsync(bookData);

      // Upload cover if provided
      if (coverFile && newBook?.id) {
        const coverResult = await uploadBookCover(coverFile, newBook.id);
        if (coverResult) {
          bookData.cover_url = coverResult.publicUrl;
        }
      }

      // Upload book file if provided
      if (bookFile && newBook?.id) {
        const fileResult = await uploadBookFile(bookFile, newBook.id);
        if (fileResult) {
          bookData.file_url = fileResult.path;
        }
      }

      toast({
        title: "Book added successfully",
        description: `"${formData.title}" has been added to the library`,
      });

      resetForm();
      setOpen(false);
    } catch (error: any) {
      console.error("Add book error:", error);
      toast({
        title: "Failed to add book",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const parentCategories = categories?.filter(c => !c.parent_id) || [];
  const subcategories = formData.category_id
    ? categories?.filter(c => c.parent_id === formData.category_id)
    : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Book
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-display">Add New Book</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new book to the library.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Book Cover Upload */}
            <div className="space-y-2">
              <Label>Book Cover</Label>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverSelect}
              />
              {coverPreview ? (
                <div className="relative">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="h-32 w-24 rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute -right-2 -top-2 h-6 w-6"
                    onClick={() => {
                      setCoverFile(null);
                      setCoverPreview(null);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border/50 bg-muted/20 transition-colors hover:border-primary/50 hover:bg-muted/40"
                >
                  <div className="text-center">
                    <Image className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Click to upload cover image
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter book title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                placeholder="Enter author name"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>

            {/* Category */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter book description..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Publication Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="publisher">Publisher</Label>
                <Input
                  id="publisher"
                  placeholder="Publisher name"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Publication Year</Label>
                <Input
                  id="year"
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
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  placeholder="978-3-16-148410-0"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pages">Number of Pages</Label>
                <Input
                  id="pages"
                  type="number"
                  placeholder="200"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                />
              </div>
            </div>

            {/* Book File Upload */}
            <div className="space-y-2">
              <Label>Book File (PDF) *</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleBookFileSelect}
              />
              {bookFile ? (
                <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{bookFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(bookFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setBookFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border/50 bg-muted/20 transition-colors hover:border-primary/50 hover:bg-muted/40"
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                    <p className="mt-1 text-sm text-muted-foreground">
                      Click to upload PDF file
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
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
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading || createBook.isPending}>
              {isUploading || createBook.isPending ? "Adding..." : "Add Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
