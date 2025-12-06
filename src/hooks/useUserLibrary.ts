import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Book } from "./useBooks";

export interface UserBook {
  id: string;
  user_id: string;
  book_id: string;
  downloaded_at: string;
  last_opened_at: string | null;
  book?: Book;
}

export interface Bookmark {
  id: string;
  user_id: string;
  book_id: string;
  created_at: string;
  book?: Book;
}

export interface ReadingProgress {
  id: string;
  user_id: string;
  book_id: string;
  current_page: number;
  total_pages: number | null;
  progress_percent: number;
  status: "not_started" | "reading" | "completed";
  started_at: string | null;
  completed_at: string | null;
  updated_at: string;
}

// Fetch user's library (downloaded books)
export function useUserLibrary() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-library", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_books")
        .select("*, book:books(*, category:categories(*))")
        .eq("user_id", user.id)
        .order("downloaded_at", { ascending: false });

      if (error) throw error;
      return data as UserBook[];
    },
    enabled: !!user,
  });
}

// Add book to library
export function useAddToLibrary() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (bookId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_books")
        .insert({ user_id: user.id, book_id: bookId })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new Error("Book already in library");
        }
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-library"] });
    },
  });
}

// Remove book from library
export function useRemoveFromLibrary() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (bookId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_books")
        .delete()
        .eq("user_id", user.id)
        .eq("book_id", bookId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-library"] });
    },
  });
}

// Check if book is in library
export function useIsInLibrary(bookId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-library", "check", bookId, user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from("user_books")
        .select("id")
        .eq("user_id", user.id)
        .eq("book_id", bookId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!bookId,
  });
}

// Fetch user's bookmarks
export function useUserBookmarks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["bookmarks", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("bookmarks")
        .select("*, book:books(*, category:categories(*))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Bookmark[];
    },
    enabled: !!user,
  });
}

// Add bookmark
export function useAddBookmark() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (bookId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("bookmarks")
        .insert({ user_id: user.id, book_id: bookId })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new Error("Already bookmarked");
        }
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

// Remove bookmark
export function useRemoveBookmark() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (bookId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("book_id", bookId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

// Check if book is bookmarked
export function useIsBookmarked(bookId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["bookmarks", "check", bookId, user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("book_id", bookId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!bookId,
  });
}

// Fetch reading progress
export function useReadingProgress(bookId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["reading-progress", user?.id, bookId],
    queryFn: async () => {
      if (!user) return null;

      if (bookId) {
        const { data, error } = await supabase
          .from("reading_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("book_id", bookId)
          .maybeSingle();

        if (error) throw error;
        return data as ReadingProgress | null;
      }

      const { data, error } = await supabase
        .from("reading_progress")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data as ReadingProgress[];
    },
    enabled: !!user,
  });
}

// Update reading progress
export function useUpdateReadingProgress() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      bookId,
      currentPage,
      totalPages,
    }: {
      bookId: string;
      currentPage: number;
      totalPages?: number;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const progressPercent = totalPages ? (currentPage / totalPages) * 100 : 0;
      const status =
        progressPercent >= 100
          ? "completed"
          : currentPage > 0
          ? "reading"
          : "not_started";

      const { data, error } = await supabase
        .from("reading_progress")
        .upsert(
          {
            user_id: user.id,
            book_id: bookId,
            current_page: currentPage,
            total_pages: totalPages,
            progress_percent: progressPercent,
            status,
            started_at: currentPage > 0 ? new Date().toISOString() : null,
            completed_at: status === "completed" ? new Date().toISOString() : null,
          },
          { onConflict: "user_id,book_id" }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reading-progress"] });
    },
  });
}

// Get user stats
export function useUserStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-stats", user?.id],
    queryFn: async () => {
      if (!user) return { downloaded: 0, bookmarks: 0, reading: 0 };

      const [libraryResult, bookmarksResult, progressResult] = await Promise.all([
        supabase
          .from("user_books")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("bookmarks")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("reading_progress")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", "reading"),
      ]);

      return {
        downloaded: libraryResult.count || 0,
        bookmarks: bookmarksResult.count || 0,
        reading: progressResult.count || 0,
      };
    },
    enabled: !!user,
  });
}
