import { Layout } from "@/components/layout/Layout";
import { BookCard } from "@/components/shared/BookCard";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Mock data - will be replaced with Supabase data
const featuredBooks = [
  { id: "1", title: "The Book of Knowledge", author: "Imam Al-Ghazali", rating: 4.8, category: "Islamic" },
  { id: "2", title: "Rumi's Poetry Collection", author: "Jalal ad-Din Rumi", rating: 4.9, category: "Poetry" },
  { id: "3", title: "Tales of the Prophets", author: "Ibn Kathir", rating: 4.7, category: "Islamic" },
  { id: "4", title: "The Sealed Nectar", author: "Safiur Rahman", rating: 4.9, category: "Biography" },
];

const recentBooks = [
  { id: "5", title: "Introduction to Arabic", author: "Dr. V. Abdur Rahim", rating: 4.5, downloadCount: 1250 },
  { id: "6", title: "Stories of the Sahaba", author: "Various Authors", rating: 4.6, downloadCount: 890 },
  { id: "7", title: "Islamic Art & Calligraphy", author: "Mohamed Zakariya", rating: 4.4, downloadCount: 560 },
  { id: "8", title: "Fortress of the Muslim", author: "Sa'id bin Wahf", rating: 4.8, downloadCount: 2100 },
];

export default function Index() {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
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
          <CategoryCard
            id="general"
            name="Books"
            description="General literature, fiction, non-fiction, and more"
            bookCount={2500}
            icon={BookOpen}
            variant="featured"
            className="min-h-[140px]"
          />
          <CategoryCard
            id="islamic"
            name="Islamic Books"
            description="Quran, Hadith, Fiqh, Tafsir, and Islamic sciences"
            bookCount={2500}
            icon={Sparkles}
            variant="featured"
            className="min-h-[140px] bg-gradient-to-br from-secondary to-secondary/80"
          />
        </div>
      </section>

      {/* Featured Books */}
      <section className="container py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground md:text-2xl">
            Featured Books
          </h2>
          <Link to="/books/featured">
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
          {featuredBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              rating={book.rating}
              category={book.category}
            />
          ))}
        </div>
      </section>

      {/* Recent Additions */}
      <section className="container py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground md:text-2xl">
            Recent Additions
          </h2>
          <Link to="/books/recent">
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
          {recentBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              rating={book.rating}
              downloadCount={book.downloadCount}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}
