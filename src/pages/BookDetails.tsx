import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { BookCard } from "@/components/shared/BookCard";
import { ReviewCard } from "@/components/shared/ReviewCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Star, Download, Bookmark, BookmarkCheck, Share2, Calendar, User, BookOpen, FileText, MessageSquare, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBook, useBooks } from "@/hooks/useBooks";
import { useAuth } from "@/contexts/AuthContext";
import { useAddBookmark, useRemoveBookmark, useIsBookmarked, useAddToLibrary, useIsInLibrary } from "@/hooks/useUserLibrary";
import { useBookReviews, useSubmitReview } from "@/hooks/useReviews";
import { useFileUpload } from "@/hooks/useFileUpload";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { data: book, isLoading, error } = useBook(id || "");
  const { data: reviews = [], isLoading: reviewsLoading } = useBookReviews(id || "");
  const { data: relatedBooks = [] } = useBooks({ 
    categoryId: book?.category_id || undefined, 
    limit: 4,
    status: "published" 
  });
  
  const { data: isBookmarked = false } = useIsBookmarked(id || "");
  const { data: isInLibrary = false } = useIsInLibrary(id || "");
  
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();
  const addToLibrary = useAddToLibrary();
  const submitReview = useSubmitReview();
  const { getBookDownloadUrl } = useFileUpload();
  
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleBookmark = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark books",
      });
      navigate("/login");
      return;
    }

    try {
      if (isBookmarked) {
        await removeBookmark.mutateAsync(id!);
        toast({
          title: "Removed from bookmarks",
          description: "Book removed from your bookmarks",
        });
      } else {
        await addBookmark.mutateAsync(id!);
        toast({
          title: "Added to bookmarks",
          description: "Book saved to your bookmarks for later",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to download this book",
      });
      navigate("/login");
      return;
    }

    if (!book?.file_url) {
      toast({
        title: "File not available",
        description: "This book's file is not available for download",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);
    try {
      // Add to library if not already there
      if (!isInLibrary) {
        await addToLibrary.mutateAsync(id!);
      }

      // Get signed URL and download
      const signedUrl = await getBookDownloadUrl(book.file_url);
      if (signedUrl) {
        window.open(signedUrl, "_blank");
        toast({
          title: "Download started",
          description: `Downloading "${book.title}"...`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Download failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: book?.title,
        text: `Check out "${book?.title}" by ${book?.author}`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Book link copied to clipboard",
      });
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to submit a review",
      });
      navigate("/login");
      return;
    }

    if (!userRating || !reviewText.trim()) {
      toast({
        title: "Incomplete review",
        description: "Please add a rating and comment",
        variant: "destructive",
      });
      return;
    }

    try {
      await submitReview.mutateAsync({
        bookId: id!,
        rating: userRating,
        content: reviewText,
      });
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      setUserRating(0);
      setReviewText("");
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

  if (error || !book) {
    return (
      <Layout>
        <div className="container py-12">
          <ErrorMessage 
            title="Book not found" 
            message="The book you're looking for doesn't exist or has been removed."
          />
        </div>
      </Layout>
    );
  }

  const filteredRelatedBooks = relatedBooks.filter(b => b.id !== book.id).slice(0, 4);

  return (
    <Layout>
      <div className="container py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
            </BreadcrumbItem>
            {book.category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/books/${book.category.slug}`}>
                    {book.category.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{book.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Book Info */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cover & Actions */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden border-border/50 sticky top-20">
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-secondary/20">
                {book.cover_url ? (
                  <img 
                    src={book.cover_url} 
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-display text-6xl text-muted-foreground/30">
                      {book.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <CardContent className="p-4 space-y-3">
                <Button 
                  onClick={handleDownload} 
                  className="w-full gap-2"
                  disabled={isDownloading || !book.file_url}
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isInLibrary ? "Download Again" : "Download Book"}
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant={isBookmarked ? "secondary" : "outline"} 
                    className="flex-1 gap-2"
                    onClick={handleBookmark}
                    disabled={addBookmark.isPending || removeBookmark.isPending}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                    {isBookmarked ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {book.category && (
                <Badge variant="secondary">{book.category.name}</Badge>
              )}
              <Badge variant="outline">{book.language || "English"}</Badge>
            </div>

            <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              {book.title}
            </h1>

            <p className="mt-2 text-lg text-muted-foreground">
              by {book.author}
            </p>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(book.average_rating || 0)
                        ? "fill-secondary text-secondary"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{book.average_rating?.toFixed(1) || "0.0"}</span>
              <span className="text-muted-foreground">
                ({book.review_count || 0} reviews)
              </span>
            </div>

            {/* Metadata */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {book.publication_year && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{book.publication_year}</span>
                </div>
              )}
              {book.pages && (
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{book.pages} pages</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{book.language || "English"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span>{(book.download_count || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Tabs for Description, Reviews */}
            <Tabs defaultValue="description" className="mt-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description" className="gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Description</span>
                </TabsTrigger>
                <TabsTrigger value="reviews" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Reviews</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {book.description || "No description available."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4 space-y-4">
                {/* Write Review */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Write a Review</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="mb-2 text-sm text-muted-foreground">Your rating</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setUserRating(star)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= userRating
                                  ? "fill-secondary text-secondary"
                                  : "text-muted hover:text-secondary/50"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      placeholder="Share your thoughts about this book..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={3}
                    />
                    <Button 
                      onClick={handleSubmitReview}
                      disabled={submitReview.isPending}
                    >
                      {submitReview.isPending ? "Submitting..." : "Submit Review"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Reviews List */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Reader Reviews ({reviews.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {reviewsLoading ? (
                      <LoadingSpinner />
                    ) : reviews.length > 0 ? (
                      reviews.map((review) => (
                        <ReviewCard
                          key={review.id}
                          id={review.id}
                          userName={review.profile?.display_name || "Anonymous"}
                          rating={review.rating}
                          date={new Date(review.created_at).toLocaleDateString()}
                          comment={review.content || ""}
                        />
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No reviews yet. Be the first to review!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Books */}
        {filteredRelatedBooks.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
              Related Books
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {filteredRelatedBooks.map((relatedBook) => (
                <BookCard
                  key={relatedBook.id}
                  id={relatedBook.id}
                  title={relatedBook.title}
                  author={relatedBook.author}
                  rating={relatedBook.average_rating || 0}
                  coverUrl={relatedBook.cover_url || undefined}
                  category={relatedBook.category?.name}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
