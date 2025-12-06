import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  icon: string | null;
  book_count: number;
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  cover_url: string | null;
  file_url: string | null;
  category_id: string | null;
  isbn: string | null;
  publisher: string | null;
  publication_year: number | null;
  pages: number | null;
  language: string;
  status: "draft" | "published";
  download_count: number;
  average_rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface BookFilters {
  categoryId?: string;
  search?: string;
  status?: "draft" | "published";
  sortBy?: "created_at" | "title" | "download_count" | "average_rating";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

// Fetch all categories
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Category[];
    },
  });
}

// Fetch parent categories only
export function useParentCategories() {
  return useQuery({
    queryKey: ["categories", "parents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .is("parent_id", null)
        .order("name");

      if (error) throw error;
      return data as Category[];
    },
  });
}

// Fetch subcategories by parent slug
export function useSubcategories(parentSlug: string) {
  return useQuery({
    queryKey: ["categories", "subcategories", parentSlug],
    queryFn: async () => {
      // First get the parent category
      const { data: parent, error: parentError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", parentSlug)
        .maybeSingle();

      if (parentError) throw parentError;
      if (!parent) return [];

      // Then get subcategories
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("parent_id", parent.id)
        .order("name");

      if (error) throw error;
      return data as Category[];
    },
    enabled: !!parentSlug,
  });
}

// Fetch category by slug
export function useCategory(slug: string) {
  return useQuery({
    queryKey: ["categories", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data as Category | null;
    },
    enabled: !!slug,
  });
}

// Fetch books with filters
export function useBooks(filters: BookFilters = {}) {
  return useQuery({
    queryKey: ["books", filters],
    queryFn: async () => {
      let query = supabase
        .from("books")
        .select("*, category:categories(*)");

      // Apply filters
      if (filters.categoryId) {
        query = query.eq("category_id", filters.categoryId);
      }

      if (filters.status) {
        query = query.eq("status", filters.status);
      }

      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,author.ilike.%${filters.search}%`
        );
      }

      // Sorting
      const sortBy = filters.sortBy || "created_at";
      const sortOrder = filters.sortOrder || "desc";
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      // Pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Book[];
    },
  });
}

// Fetch single book by ID
export function useBook(id: string) {
  return useQuery({
    queryKey: ["books", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*, category:categories(*)")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Book | null;
    },
    enabled: !!id,
  });
}

// Fetch featured/recent books
export function useFeaturedBooks(limit = 10) {
  return useQuery({
    queryKey: ["books", "featured", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*, category:categories(*)")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Book[];
    },
  });
}

// Fetch popular books
export function usePopularBooks(limit = 10) {
  return useQuery({
    queryKey: ["books", "popular", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*, category:categories(*)")
        .eq("status", "published")
        .order("download_count", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Book[];
    },
  });
}

// Admin: Create book
export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (book: Omit<Book, "id" | "created_at" | "updated_at" | "category" | "download_count" | "average_rating" | "review_count">) => {
      const { data, error } = await supabase
        .from("books")
        .insert(book)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

// Admin: Update book
export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...book }: Partial<Book> & { id: string }) => {
      const { data, error } = await supabase
        .from("books")
        .update(book)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["books", variables.id] });
    },
  });
}

// Admin: Delete book
export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("books").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

// Search books
export function useSearchBooks(query: string) {
  return useQuery({
    queryKey: ["books", "search", query],
    queryFn: async () => {
      if (!query.trim()) return [];

      const { data, error } = await supabase
        .from("books")
        .select("*, category:categories(*)")
        .eq("status", "published")
        .or(`title.ilike.%${query}%,author.ilike.%${query}%,description.ilike.%${query}%`)
        .order("download_count", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as Book[];
    },
    enabled: query.trim().length > 0,
  });
}
