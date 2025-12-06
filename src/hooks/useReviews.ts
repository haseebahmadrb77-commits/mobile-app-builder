import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Review {
  id: string;
  user_id: string;
  book_id: string;
  rating: number;
  content: string | null;
  created_at: string;
  updated_at: string;
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

// Fetch reviews for a book
export function useBookReviews(bookId: string) {
  return useQuery({
    queryKey: ["reviews", bookId],
    queryFn: async () => {
      // First get reviews
      const { data: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("book_id", bookId)
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;

      // Then get profiles for each reviewer
      const userIds = reviews.map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", userIds);

      // Combine reviews with profiles
      const reviewsWithProfiles = reviews.map((review) => ({
        ...review,
        profile: profiles?.find((p) => p.id === review.user_id) || null,
      }));

      return reviewsWithProfiles as Review[];
    },
    enabled: !!bookId,
  });
}

// Fetch user's review for a book
export function useUserReview(bookId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["reviews", bookId, "user", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("book_id", bookId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Review | null;
    },
    enabled: !!user && !!bookId,
  });
}

// Create or update review
export function useSubmitReview() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      bookId,
      rating,
      content,
    }: {
      bookId: string;
      rating: number;
      content?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("reviews")
        .upsert(
          {
            user_id: user.id,
            book_id: bookId,
            rating,
            content: content || null,
          },
          { onConflict: "user_id,book_id" }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.bookId] });
      queryClient.invalidateQueries({ queryKey: ["books", variables.bookId] });
    },
  });
}

// Delete review
export function useDeleteReview() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (bookId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("user_id", user.id)
        .eq("book_id", bookId);

      if (error) throw error;
    },
    onSuccess: (_, bookId) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", bookId] });
      queryClient.invalidateQueries({ queryKey: ["books", bookId] });
    },
  });
}
