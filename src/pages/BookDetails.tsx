import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { BookCard } from "@/components/shared/BookCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Star, Download, Bookmark, Share2, Calendar, User, BookOpen } from "lucide-react";

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
};

const relatedBooks = [
  { id: "2", title: "Ihya Ulum al-Din", author: "Imam Al-Ghazali", rating: 4.9 },
  { id: "3", title: "The Alchemy of Happiness", author: "Imam Al-Ghazali", rating: 4.7 },
  { id: "4", title: "Deliverance from Error", author: "Imam Al-Ghazali", rating: 4.6 },
];

export default function BookDetails() {
  const { id } = useParams();

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
            <Card className="overflow-hidden border-border/50">
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="flex h-full items-center justify-center">
                  <span className="font-display text-6xl text-muted-foreground/30">
                    {mockBook.title.charAt(0)}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Button className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
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

            {/* Description */}
            <p className="mt-6 text-muted-foreground leading-relaxed">
              {mockBook.description}
            </p>

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

            {/* Preview Section */}
            <Card className="mt-8 border-border/50">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold">Book Preview</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sign in to preview the first few pages of this book.
                </p>
                <Link to="/login">
                  <Button variant="outline" className="mt-4">
                    Sign in to Preview
                  </Button>
                </Link>
              </CardContent>
            </Card>
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
