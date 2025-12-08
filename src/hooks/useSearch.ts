import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  title: string;
  author: string;
  description: string | null;
  cover_url: string | null;
  category_id: string | null;
  average_rating: number | null;
  review_count: number | null;
  download_count: number | null;
  publication_year: number | null;
  pages: number | null;
  status: string;
  rank: number;
}

interface SearchFilters {
  categoryId?: string;
  minRating?: number;
  yearFrom?: number;
  yearTo?: number;
  sortBy?: 'relevance' | 'rating' | 'newest' | 'title' | 'downloads';
}

export function useSearch(query: string, filters?: SearchFilters) {
  return useQuery({
    queryKey: ['search', query, filters],
    queryFn: async (): Promise<SearchResult[]> => {
      if (!query || query.trim().length < 2) {
        return [];
      }

      // Use the search_books function for full-text search
      const { data, error } = await supabase
        .rpc('search_books', { search_query: query.trim() });

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      let results = (data || []) as SearchResult[];

      // Apply additional filters
      if (filters?.categoryId) {
        results = results.filter(book => book.category_id === filters.categoryId);
      }

      if (filters?.minRating) {
        results = results.filter(book => 
          (book.average_rating || 0) >= filters.minRating!
        );
      }

      if (filters?.yearFrom) {
        results = results.filter(book => 
          (book.publication_year || 0) >= filters.yearFrom!
        );
      }

      if (filters?.yearTo) {
        results = results.filter(book => 
          (book.publication_year || 9999) <= filters.yearTo!
        );
      }

      // Apply sorting
      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case 'rating':
            results.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
            break;
          case 'newest':
            results.sort((a, b) => (b.publication_year || 0) - (a.publication_year || 0));
            break;
          case 'title':
            results.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case 'downloads':
            results.sort((a, b) => (b.download_count || 0) - (a.download_count || 0));
            break;
          // 'relevance' is default from the function
        }
      }

      return results;
    },
    enabled: query.trim().length >= 2,
    staleTime: 30000, // 30 seconds
  });
}

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: async () => {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const { data, error } = await supabase
        .from('books')
        .select('id, title, author')
        .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
        .eq('status', 'published')
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: query.trim().length >= 2,
    staleTime: 10000,
  });
}

export function usePopularSearches() {
  return useQuery({
    queryKey: ['popular-searches'],
    queryFn: async () => {
      // Get most downloaded books as popular searches
      const { data, error } = await supabase
        .from('books')
        .select('title, author')
        .eq('status', 'published')
        .order('download_count', { ascending: false, nullsFirst: false })
        .limit(6);

      if (error) throw error;
      
      // Extract unique terms
      const terms = new Set<string>();
      data?.forEach(book => {
        if (book.author) terms.add(book.author.split(' ')[0]);
      });
      
      return Array.from(terms).slice(0, 6);
    },
    staleTime: 300000, // 5 minutes
  });
}
