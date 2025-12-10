import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddBookDialog } from "@/components/admin/AddBookDialog";
import { EditBookDialog } from "@/components/admin/EditBookDialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Filter,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useBooks, useDeleteBook, useUpdateBook } from "@/hooks/useBooks";
import { useToast } from "@/hooks/use-toast";

interface Book {
  id: string;
  title: string;
  author: string;
  description?: string | null;
  category_id?: string | null;
  category?: { name: string; slug: string } | null;
  publisher?: string | null;
  publication_year?: number | null;
  isbn?: string | null;
  pages?: number | null;
  language?: string | null;
  status: string;
  cover_url?: string | null;
  file_url?: string | null;
  download_count?: number | null;
  average_rating?: number | null;
}

export default function AdminBooks() {
  const { toast } = useToast();
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const booksPerPage = 10;

  const { data: books = [], isLoading } = useBooks({
    search: searchQuery || undefined,
    sortBy: "created_at",
    sortOrder: "desc",
  });
  const deleteBook = useDeleteBook();
  const updateBook = useUpdateBook();

  const filteredBooks = books.filter((book) => {
    const matchesCategory =
      categoryFilter === "all" || book.category?.name === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || book.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const toggleSelectAll = () => {
    if (selectedBooks.length === paginatedBooks.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(paginatedBooks.map((b) => b.id));
    }
  };

  const toggleSelectBook = (id: string) => {
    setSelectedBooks((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBook.mutateAsync(id);
      toast({
        title: "Book deleted",
        description: "The book has been deleted successfully",
      });
      setSelectedBooks(prev => prev.filter(bookId => bookId !== id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  const handleToggleStatus = async (book: Book) => {
    const newStatus = book.status === "published" ? "draft" : "published";
    try {
      await updateBook.mutateAsync({ id: book.id, status: newStatus });
      toast({
        title: newStatus === "published" ? "Book published" : "Book unpublished",
        description: `"${book.title}" is now ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBulkPublish = async () => {
    try {
      await Promise.all(
        selectedBooks.map(id => updateBook.mutateAsync({ id, status: "published" }))
      );
      toast({
        title: "Books published",
        description: `${selectedBooks.length} books have been published`,
      });
      setSelectedBooks([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBulkUnpublish = async () => {
    try {
      await Promise.all(
        selectedBooks.map(id => updateBook.mutateAsync({ id, status: "draft" }))
      );
      toast({
        title: "Books unpublished",
        description: `${selectedBooks.length} books have been set to draft`,
      });
      setSelectedBooks([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedBooks.map(id => deleteBook.mutateAsync(id)));
      toast({
        title: "Books deleted",
        description: `${selectedBooks.length} books have been deleted`,
      });
      setSelectedBooks([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (book: Book) => {
    setBookToEdit(book);
    setEditDialogOpen(true);
  };

  const uniqueCategories = [...new Set(books.map(b => b.category?.name).filter(Boolean))];

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
              Manage Books
            </h1>
            <p className="mt-2 text-muted-foreground">
              Add, edit, or remove books from the library using Google Drive links
            </p>
          </div>

          <AddBookDialog />
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or author..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={(val) => {
              setCategoryFilter(val);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map(cat => (
                  <SelectItem key={cat} value={cat!}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedBooks.length > 0 && (
          <div className="mb-4 flex items-center gap-2 flex-wrap rounded-lg bg-muted/50 p-3">
            <span className="text-sm text-muted-foreground">
              {selectedBooks.length} book(s) selected
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBulkPublish}
              disabled={updateBook.isPending}
              className="gap-1"
            >
              <Eye className="h-3.5 w-3.5" />
              Publish
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBulkUnpublish}
              disabled={updateBook.isPending}
              className="gap-1"
            >
              <EyeOff className="h-3.5 w-3.5" />
              Unpublish
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleBulkDelete}
              disabled={deleteBook.isPending}
              className="gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        )}

        {/* Books Table */}
        <div className="rounded-lg border border-border/50 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedBooks.length === paginatedBooks.length &&
                      paginatedBooks.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="min-w-[200px]">Title</TableHead>
                <TableHead className="min-w-[120px]">Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Downloads</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBooks.length > 0 ? (
                paginatedBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedBooks.includes(book.id)}
                        onCheckedChange={() => toggleSelectBook(book.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {book.cover_url && (
                          <img 
                            src={book.cover_url} 
                            alt={book.title}
                            className="h-10 w-8 rounded object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <span className="font-medium">{book.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{book.category?.name || "Uncategorized"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          book.status === "published" ? "default" : "secondary"
                        }
                        className="cursor-pointer"
                        onClick={() => handleToggleStatus(book)}
                      >
                        {book.status === "published" ? (
                          <Eye className="mr-1 h-3 w-3" />
                        ) : (
                          <EyeOff className="mr-1 h-3 w-3" />
                        )}
                        {book.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {(book.download_count || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(book)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={`/book/${book.id}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Details
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(book)}>
                            {book.status === "published" ? (
                              <>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Publish
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => {
                              setBookToDelete(book.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">No books found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add your first book using the button above
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedBooks.length} of {filteredBooks.length} books
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <Button 
                    key={page}
                    variant={currentPage === page ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              <Button 
                variant="outline" 
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Edit Book Dialog */}
        <EditBookDialog
          book={bookToEdit}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Book</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this book? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => bookToDelete && handleDelete(bookToDelete)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
