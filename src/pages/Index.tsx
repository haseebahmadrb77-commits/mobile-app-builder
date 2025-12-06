import { Layout } from "@/components/layout/Layout";
import { BookCard } from "@/components/shared/BookCard";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { FeaturedCarousel } from "@/components/shared/FeaturedCarousel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Sparkles, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useFeaturedBooks, usePopularBooks, useParentCategories } from "@/hooks/useBooks";

export default function Index() {
  const navigate = useNavigate();
  const { data: featuredBooks, isLoading: featuredLoading } = useFeaturedBooks(6);
  const { data: recentBooks, isLoading: recentLoading } = usePopularBooks(8);
  const { data: categories } = useParentCategories();

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // Map categories to icons
  const categoryIcons: Record<string, typeof BookOpen> = {
    general: BookOpen,
    islamic: Sparkles,
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-teal-light islamic-pattern">
        <div className="container py-12 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Your Digital Islamic Library</span>
            </div>
            
            <h1 className="font-display text-3xl font-bold text-primary-foreground md:text-5xl">
              Discover Sacred Knowledge
            </h1>
            
            <p className="mt-4 text-primary-foreground/80 md:text-lg">
              Access thousands of Islamic books and scholarly works from the comfort of your device.
            </p>

            {/* Search Bar */}
            <div className="mt-8">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search books, authors, topics..."
                className="mx-auto max-w-lg"
              />
            </div>

            {/* Quick Stats */}
            <div className="mt-8 flex items-center justify-center gap-8 text-primary-foreground/80">
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-primary-foreground">5,000+</p>
                <p className="text-sm">Books</p>
              </div>
              <div className="h-8 w-px bg-primary-foreground/20" />
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-primary-foreground">50+</p>
                <p className="text-sm">Categories</p>
              </div>
              <div className="h-8 w-px bg-primary-foreground/20" />
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-primary-foreground">10K+</p>
                <p className="text-sm">Readers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories */}
      <section className="container py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground md:text-2xl">
            Browse Categories
          </h2>
          <Link to="/categories">
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {categories?.map((category, index) => (
            <CategoryCard
              key={category.id}
              id={category.slug}
              name={category.name}
              description={category.description || ""}
              bookCount={category.book_count}
              icon={categoryIcons[category.slug] || BookOpen}
              variant="featured"
              className={`min-h-[140px] ${index === 1 ? "bg-gradient-to-br from-secondary to-secondary/80" : ""}`}
            />
          )) || (
            <>
              <CategoryCard
                id="general"
                name="Books"
                description="General literature, fiction, non-fiction, and more"
                bookCount={0}
                icon={BookOpen}
                variant="featured"
                className="min-h-[140px]"
              />
              <CategoryCard
                id="islamic"
                name="Islamic Books"
                description="Quran, Hadith, Fiqh, Tafsir, and Islamic sciences"
                bookCount={0}
                icon={Sparkles}
                variant="featured"
                className="min-h-[140px] bg-gradient-to-br from-secondary to-secondary/80"
              />
            </>
          )}
        </div>
      </section>

      {/* Featured Books */}
      <section className="container py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground md:text-2xl">
            Featured Books
          </h2>
          <Link to="/categories">
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {featuredLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-[200px] shrink-0 space-y-3">
                <Skeleton className="h-[280px] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : featuredBooks && featuredBooks.length > 0 ? (
          <FeaturedCarousel
            books={featuredBooks.map((book) => ({
              id: book.id,
              title: book.title,
              author: book.author,
              rating: book.average_rating,
              category: book.category?.name,
              coverUrl: book.cover_url,
            }))}
          />
        ) : (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No books available yet</p>
            <p className="text-sm text-muted-foreground/70">
              Check back later for new additions
            </p>
          </div>
        )}
      </section>

      {/* Recent Additions */}
      <section className="container py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground md:text-2xl">
            Popular Books
          </h2>
          <Link to="/categories">
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {recentLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : recentBooks && recentBooks.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {recentBooks.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                rating={book.average_rating}
                downloadCount={book.download_count}
                coverUrl={book.cover_url}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No books available yet</p>
          </div>
        )}
      </section>
    </Layout>
  );
}
