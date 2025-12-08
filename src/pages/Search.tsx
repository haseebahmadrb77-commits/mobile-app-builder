import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/shared/SearchBar";
import { BookCard } from "@/components/shared/BookCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Search as SearchIcon, BookOpen, Sparkles } from "lucide-react";
import { useSearch, usePopularSearches } from "@/hooks/useSearch";
import { useParentCategories } from "@/hooks/useBooks";

type SortOption = 'relevance' | 'rating' | 'newest' | 'title' | 'downloads';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: results, isLoading } = useSearch(query, { sortBy });
  const { data: popularSearches = [] } = usePopularSearches();
  const { data: categories } = useParentCategories();

  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery });
  };

  // Filter results by category tab
  const filteredResults = results?.filter(book => {
    if (activeTab === "all") return true;
    
    const category = categories?.find(c => c.id === book.category_id);
    if (activeTab === "islamic") {
      return category?.slug === "islamic-books";
    }
    if (activeTab === "general") {
      return category?.slug === "books";
    }
    return true;
  }) || [];

  const islamicCount = results?.filter(book => {
    const category = categories?.find(c => c.id === book.category_id);
    return category?.slug === "islamic-books";
  }).length || 0;

  const generalCount = results?.filter(book => {
    const category = categories?.find(c => c.id === book.category_id);
    return category?.slug === "books";
  }).length || 0;

  return (
    <Layout>
      <div className="container py-6">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Search Books
          </h1>
          <p className="mt-2 text-muted-foreground">
            Find books by title, author, or topic
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          defaultValue={query}
          placeholder="Search books, authors, topics..."
          autoFocus
          className="mb-8"
        />

        {/* Results */}
        {query ? (
          <>
            {/* Category Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <TabsList>
                  <TabsTrigger value="all" className="gap-2">
                    All <Badge variant="secondary" className="ml-1">{results?.length || 0}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="general" className="gap-2">
                    <BookOpen className="h-4 w-4" /> 
                    Books
                    <Badge variant="outline" className="ml-1">{generalCount}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="islamic" className="gap-2">
                    <Sparkles className="h-4 w-4" /> 
                    Islamic
                    <Badge variant="outline" className="ml-1">{islamicCount}</Badge>
                  </TabsTrigger>
                </TabsList>

                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="downloads">Most Downloaded</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="title">A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <TabsContent value="all" className="mt-6">
                {isLoading ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : filteredResults.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {filteredResults.map((book) => (
                      <BookCard
                        key={book.id}
                        id={book.id}
                        title={book.title}
                        author={book.author}
                        rating={book.average_rating || 0}
                        coverUrl={book.cover_url}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <p className="text-muted-foreground">No results found for "{query}"</p>
                    <p className="mt-2 text-sm text-muted-foreground">Try different keywords or browse our categories</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="general" className="mt-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {filteredResults.map((book) => (
                    <BookCard
                      key={book.id}
                      id={book.id}
                      title={book.title}
                      author={book.author}
                      rating={book.average_rating || 0}
                      coverUrl={book.cover_url}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="islamic" className="mt-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {filteredResults.map((book) => (
                    <BookCard
                      key={book.id}
                      id={book.id}
                      title={book.title}
                      author={book.author}
                      rating={book.average_rating || 0}
                      coverUrl={book.cover_url}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <SearchIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Enter a search term to find books</p>
            <p className="mt-1 text-sm text-muted-foreground">Search by title, author, or topic</p>
            
            {/* Popular Searches */}
            {popularSearches.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-foreground">Popular searches</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularSearches.map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(term)}
                      className="rounded-full"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
