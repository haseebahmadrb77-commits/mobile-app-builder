import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/shared/SearchBar";
import { BookCard } from "@/components/shared/BookCard";
import { FilterSidebar } from "@/components/shared/FilterSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, BookOpen, Sparkles } from "lucide-react";

// Mock search results
const mockResults = [
  { id: "1", title: "The Book of Knowledge", author: "Imam Al-Ghazali", rating: 4.8, category: "Islamic" },
  { id: "2", title: "Rumi's Poetry Collection", author: "Jalal ad-Din Rumi", rating: 4.9, category: "Poetry" },
  { id: "3", title: "Tales of the Prophets", author: "Ibn Kathir", rating: 4.7, category: "Islamic" },
];

const popularSearches = ["Quran", "Hadith", "Rumi", "Al-Ghazali", "Fiqh", "Seerah"];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState(query ? mockResults : []);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery });
    // TODO: Implement actual search with Supabase
    setResults(mockResults);
  };

  const clearFilters = () => {
    setSelectedAuthors([]);
    setSelectedYears([]);
    setMinRating(0);
  };

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
                    All <Badge variant="secondary" className="ml-1">{results.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="general" className="gap-2">
                    <BookOpen className="h-4 w-4" /> Books
                  </TabsTrigger>
                  <TabsTrigger value="islamic" className="gap-2">
                    <Sparkles className="h-4 w-4" /> Islamic
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Most Relevant</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="title">A-Z</SelectItem>
                    </SelectContent>
                  </Select>

                  <FilterSidebar
                    selectedAuthors={selectedAuthors}
                    selectedYears={selectedYears}
                    minRating={minRating}
                    onAuthorChange={setSelectedAuthors}
                    onYearChange={setSelectedYears}
                    onRatingChange={setMinRating}
                    onClearFilters={clearFilters}
                  />
                </div>
              </div>

              <TabsContent value="all" className="mt-6">
                <div className="flex gap-6">
                  <FilterSidebar
                    selectedAuthors={selectedAuthors}
                    selectedYears={selectedYears}
                    minRating={minRating}
                    onAuthorChange={setSelectedAuthors}
                    onYearChange={setSelectedYears}
                    onRatingChange={setMinRating}
                    onClearFilters={clearFilters}
                    className="w-64 flex-shrink-0"
                  />
                  <div className="flex-1">
                    {results.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {results.map((book) => (
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
                    ) : (
                      <div className="py-16 text-center">
                        <p className="text-muted-foreground">No results found for "{query}"</p>
                        <p className="mt-2 text-sm text-muted-foreground">Try different keywords or browse our categories</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="general" className="mt-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {results.filter(b => b.category !== "Islamic").map((book) => (
                    <BookCard key={book.id} {...book} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="islamic" className="mt-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {results.filter(b => b.category === "Islamic").map((book) => (
                    <BookCard key={book.id} {...book} />
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
          </div>
        )}
      </div>
    </Layout>
  );
}
