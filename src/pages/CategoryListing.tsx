import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { BookCard } from "@/components/shared/BookCard";
import { FilterSidebar } from "@/components/shared/FilterSidebar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useBooks, useCategory, useCategories } from "@/hooks/useBooks";

type SortOption = "created_at" | "title" | "download_count" | "average_rating";

export default function CategoryListing() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const subcategory = searchParams.get("subcategory");

  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("created_at");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  const { data: parentCategory } = useCategory(category || "");
  const { data: subcategoryData } = useCategory(subcategory || "");
  const { data: allCategories = [] } = useCategories();
  
  // Get subcategories for filtering
  const subcategories = allCategories.filter(
    c => c.parent_id === parentCategory?.id
  );

  // Determine which category to filter by
  const filterCategoryId = subcategoryData?.id || parentCategory?.id;

  const { data: books = [], isLoading } = useBooks({
    categoryId: filterCategoryId,
    status: "published",
    sortBy,
    sortOrder: sortBy === "title" ? "asc" : "desc",
  });

  const categoryTitle = subcategoryData?.name || parentCategory?.name || "Books";

  // Apply client-side filters
  const filteredBooks = books.filter(book => {
    if (minRating > 0 && (book.average_rating || 0) < minRating) return false;
    if (selectedAuthors.length > 0 && !selectedAuthors.includes(book.author)) return false;
    if (selectedYears.length > 0 && !selectedYears.includes(String(book.publication_year))) return false;
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const clearFilters = () => {
    setSelectedAuthors([]);
    setSelectedYears([]);
    setMinRating(0);
    setCurrentPage(1);
  };

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
            {parentCategory && (
              <>
                <BreadcrumbSeparator />
                {subcategoryData ? (
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/books/${category}`}>
                      {parentCategory.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{parentCategory.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </>
            )}
            {subcategoryData && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{subcategoryData.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {categoryTitle}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {filteredBooks.length} books
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select 
              value={sortBy} 
              onValueChange={(value) => {
                setSortBy(value as SortOption);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Newest First</SelectItem>
                <SelectItem value="title">A-Z</SelectItem>
                <SelectItem value="average_rating">Highest Rated</SelectItem>
                <SelectItem value="download_count">Most Popular</SelectItem>
              </SelectContent>
            </Select>

            <FilterSidebar
              selectedAuthors={selectedAuthors}
              selectedYears={selectedYears}
              minRating={minRating}
              onAuthorChange={(authors) => {
                setSelectedAuthors(authors);
                setCurrentPage(1);
              }}
              onYearChange={(years) => {
                setSelectedYears(years);
                setCurrentPage(1);
              }}
              onRatingChange={(rating) => {
                setMinRating(rating);
                setCurrentPage(1);
              }}
              onClearFilters={clearFilters}
            />
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex gap-6">
          {/* Filter Sidebar - Desktop */}
          <FilterSidebar
            selectedAuthors={selectedAuthors}
            selectedYears={selectedYears}
            minRating={minRating}
            onAuthorChange={(authors) => {
              setSelectedAuthors(authors);
              setCurrentPage(1);
            }}
            onYearChange={(years) => {
              setSelectedYears(years);
              setCurrentPage(1);
            }}
            onRatingChange={(rating) => {
              setMinRating(rating);
              setCurrentPage(1);
            }}
            onClearFilters={clearFilters}
            className="w-64 flex-shrink-0 hidden lg:block"
          />

          {/* Books Grid */}
          <div className="flex-1">
            {isLoading ? (
              <LoadingSpinner />
            ) : paginatedBooks.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {paginatedBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    rating={book.average_rating || 0}
                    category={book.category?.name}
                    downloadCount={book.download_count || 0}
                    coverUrl={book.cover_url || undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No books found in this category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
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
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
