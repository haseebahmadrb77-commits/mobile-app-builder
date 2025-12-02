import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { BookCard } from "@/components/shared/BookCard";
import { ReviewCard } from "@/components/shared/ReviewCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Star, Download, Bookmark, BookmarkCheck, Share2, Calendar, User, BookOpen, FileText, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock book data
const mockBook = {
  id: "1",
  title: "The Book of Knowledge",
  author: "Imam Al-Ghazali",
  description: "A comprehensive treatise on the importance of knowledge in Islam. This masterpiece explores the virtues of learning, the ethics of teaching, and the responsibilities that come with knowledge. Imam Al-Ghazali provides profound insights into the spiritual and practical aspects of pursuing knowledge.",
  rating: 4.8,
  reviewCount: 245,
  category: "Islamic",
  subcategory: "Spirituality",
  publishYear: 1095,
  pages: 320,
  language: "Arabic/English",
  downloadCount: 5420,
  tableOfContents: [
    "Chapter 1: The Excellence of Knowledge",
    "Chapter 2: Types of Knowledge",
    "Chapter 3: The Ethics of Learning",
    "Chapter 4: The Ethics of Teaching",
    "Chapter 5: The Intellect and Its Excellence",
    "Chapter 6: Knowledge and Action",
  ],
};

const mockReviews = [
  {
    id: "1",
    userName: "Ahmad Hassan",
    rating: 5,
    date: "2 weeks ago",
    comment: "An absolutely essential read for anyone seeking knowledge. Imam Al-Ghazali's insights are timeless and profound. The way he explains the relationship between knowledge and action is transformative.",
    helpful: 24,
  },
  {
    id: "2",
    userName: "Fatima Ali",
    rating: 5,
    date: "1 month ago",
    comment: "This book changed my perspective on learning. The chapter on ethics of teaching is particularly enlightening for educators.",
    helpful: 18,
  },
  {
    id: "3",
    userName: "Muhammad Yusuf",
    rating: 4,
    date: "2 months ago",
    comment: "A deep and scholarly work. Some sections require multiple readings to fully appreciate, but it's worth the effort.",
    helpful: 12,
  },
];

const relatedBooks = [
  { id: "2", title: "Ihya Ulum al-Din", author: "Imam Al-Ghazali", rating: 4.9 },
  { id: "3", title: "The Alchemy of Happiness", author: "Imam Al-Ghazali", rating: 4.7 },
  { id: "4", title: "Deliverance from Error", author: "Imam Al-Ghazali", rating: 4.6 },
  { id: "5", title: "The Path to Guidance", author: "Imam Al-Ghazali", rating: 4.5 },
];

export default function BookDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked 
        ? "Book removed from your bookmarks" 
        : "Book saved to your bookmarks for later",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Sign in required",
      description: "Please sign in to download this book",
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: mockBook.title,
        text: `Check out "${mockBook.title}" by ${mockBook.author}`,
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

  const handleSubmitReview = () => {
    if (!userRating || !reviewText.trim()) {
      toast({
        title: "Incomplete review",
        description: "Please add a rating and comment",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    });
    setUserRating(0);
    setReviewText("");
  };

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
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/books/islamic">Islamic Books</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{mockBook.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Book Info */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cover & Actions */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden border-border/50 sticky top-20">
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="flex h-full items-center justify-center">
                  <span className="font-display text-6xl text-muted-foreground/30">
                    {mockBook.title.charAt(0)}
                  </span>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <Button onClick={handleDownload} className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download Book
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant={isBookmarked ? "secondary" : "outline"} 
                    className="flex-1 gap-2"
                    onClick={handleBookmark}
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
              <Badge variant="secondary">{mockBook.category}</Badge>
              <Badge variant="outline">{mockBook.subcategory}</Badge>
            </div>

            <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              {mockBook.title}
            </h1>

            <p className="mt-2 text-lg text-muted-foreground">
              by {mockBook.author}
            </p>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(mockBook.rating)
                        ? "fill-secondary text-secondary"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{mockBook.rating}</span>
              <span className="text-muted-foreground">
                ({mockBook.reviewCount} reviews)
              </span>
            </div>

            {/* Metadata */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{mockBook.publishYear}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{mockBook.pages} pages</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{mockBook.language}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span>{mockBook.downloadCount.toLocaleString()}</span>
              </div>
            </div>

            {/* Tabs for Description, Contents, Reviews */}
            <Tabs defaultValue="description" className="mt-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description" className="gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Description</span>
                </TabsTrigger>
                <TabsTrigger value="contents" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Contents</span>
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
                      {mockBook.description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contents" className="mt-4">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Table of Contents</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ol className="space-y-2">
                      {mockBook.tableOfContents.map((chapter, index) => (
                        <li key={index} className="flex items-center gap-3 text-sm">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="text-muted-foreground">{chapter}</span>
                        </li>
                      ))}
                    </ol>
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
                    <Button onClick={handleSubmitReview}>Submit Review</Button>
                  </CardContent>
                </Card>

                {/* Reviews List */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Reader Reviews ({mockReviews.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockReviews.map((review) => (
                      <ReviewCard key={review.id} {...review} />
                    ))}
                    <Button variant="outline" className="w-full">
                      Load More Reviews
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Books */}
        <section className="mt-12">
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
            Related Books
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {relatedBooks.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                rating={book.rating}
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
