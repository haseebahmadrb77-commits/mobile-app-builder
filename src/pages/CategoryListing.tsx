import { useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { BookCard } from "@/components/shared/BookCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SlidersHorizontal } from "lucide-react";

// Mock data
const mockBooks = [
  { id: "1", title: "The Book of Knowledge", author: "Imam Al-Ghazali", rating: 4.8, category: "Islamic" },
  { id: "2", title: "Rumi's Poetry Collection", author: "Jalal ad-Din Rumi", rating: 4.9, category: "Poetry" },
  { id: "3", title: "Tales of the Prophets", author: "Ibn Kathir", rating: 4.7, category: "Islamic" },
  { id: "4", title: "The Sealed Nectar", author: "Safiur Rahman", rating: 4.9, category: "Biography" },
  { id: "5", title: "Introduction to Arabic", author: "Dr. V. Abdur Rahim", rating: 4.5, downloadCount: 1250 },
  { id: "6", title: "Stories of the Sahaba", author: "Various Authors", rating: 4.6, downloadCount: 890 },
  { id: "7", title: "Islamic Art & Calligraphy", author: "Mohamed Zakariya", rating: 4.4, downloadCount: 560 },
  { id: "8", title: "Fortress of the Muslim", author: "Sa'id bin Wahf", rating: 4.8, downloadCount: 2100 },
];

export default function CategoryListing() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const subcategory = searchParams.get("subcategory");

  const categoryTitle = category === "islamic" ? "Islamic Books" : "General Books";

  return (
    <Layout>
      <div className="container py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
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
              <BreadcrumbPage>{categoryTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {categoryTitle}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {mockBooks.length} books
              {subcategory && ` in ${subcategory}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select defaultValue="newest">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="title">A-Z</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {mockBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              rating={book.rating}
              category={book.category}
              downloadCount={book.downloadCount}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
