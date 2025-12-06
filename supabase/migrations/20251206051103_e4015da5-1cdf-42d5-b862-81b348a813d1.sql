-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  icon TEXT,
  book_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create books table
CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  file_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  isbn TEXT,
  publisher TEXT,
  publication_year INTEGER,
  pages INTEGER,
  language TEXT DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  download_count INTEGER DEFAULT 0,
  average_rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_books table (for tracking downloads/library)
CREATE TABLE public.user_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_opened_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (user_id, book_id)
);

-- Create bookmarks table
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, book_id)
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, book_id)
);

-- Create reading_progress table
CREATE TABLE public.reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  current_page INTEGER DEFAULT 0,
  total_pages INTEGER,
  progress_percent NUMERIC(5,2) DEFAULT 0,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'reading', 'completed')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, book_id)
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

-- Categories RLS (public read, admin write)
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Books RLS (published books public, admin can manage all)
CREATE POLICY "Published books are viewable by everyone"
  ON public.books FOR SELECT
  USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage books"
  ON public.books FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- User books RLS (users can manage their own)
CREATE POLICY "Users can view their own library"
  ON public.user_books FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their library"
  ON public.user_books FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their library"
  ON public.user_books FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Bookmarks RLS (users can manage their own)
CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add bookmarks"
  ON public.bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove bookmarks"
  ON public.bookmarks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Reviews RLS (public read for published reviews, users manage their own)
CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Reading progress RLS (users manage their own)
CREATE POLICY "Users can view their own progress"
  ON public.reading_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create progress"
  ON public.reading_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.reading_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_books_category ON public.books(category_id);
CREATE INDEX idx_books_status ON public.books(status);
CREATE INDEX idx_books_created_at ON public.books(created_at DESC);
CREATE INDEX idx_user_books_user ON public.user_books(user_id);
CREATE INDEX idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX idx_reviews_book ON public.reviews(book_id);
CREATE INDEX idx_reading_progress_user ON public.reading_progress(user_id);

-- Triggers for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reading_progress_updated_at
  BEFORE UPDATE ON public.reading_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment book download count
CREATE OR REPLACE FUNCTION public.increment_download_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.books
  SET download_count = download_count + 1
  WHERE id = NEW.book_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_book_added
  AFTER INSERT ON public.user_books
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_download_count();

-- Function to update book average rating
CREATE OR REPLACE FUNCTION public.update_book_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE public.books
    SET 
      average_rating = COALESCE((
        SELECT AVG(rating)::NUMERIC(2,1)
        FROM public.reviews
        WHERE book_id = OLD.book_id
      ), 0),
      review_count = (
        SELECT COUNT(*)
        FROM public.reviews
        WHERE book_id = OLD.book_id
      )
    WHERE id = OLD.book_id;
    RETURN OLD;
  ELSE
    UPDATE public.books
    SET 
      average_rating = COALESCE((
        SELECT AVG(rating)::NUMERIC(2,1)
        FROM public.reviews
        WHERE book_id = NEW.book_id
      ), 0),
      review_count = (
        SELECT COUNT(*)
        FROM public.reviews
        WHERE book_id = NEW.book_id
      )
    WHERE id = NEW.book_id;
    RETURN NEW;
  END IF;
END;
$$;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_book_rating();

-- Create book covers storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('book-covers', 'book-covers', true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('book-files', 'book-files', false);

-- Storage policies for book covers (public read, admin write)
CREATE POLICY "Book covers are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'book-covers');

CREATE POLICY "Admins can upload book covers"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'book-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update book covers"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'book-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete book covers"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'book-covers' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for book files (authenticated download, admin upload)
CREATE POLICY "Authenticated users can download book files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'book-files');

CREATE POLICY "Admins can upload book files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'book-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update book files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'book-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete book files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'book-files' AND public.has_role(auth.uid(), 'admin'));

-- Insert default categories
INSERT INTO public.categories (name, slug, description, icon) VALUES
  ('Books', 'general', 'General book collection covering various genres and topics', 'book-open'),
  ('Islamic Books', 'islamic', 'Collection of Islamic literature, scholarly works, and religious texts', 'book-heart');

-- Insert subcategories
INSERT INTO public.categories (name, slug, description, parent_id, icon)
SELECT 'Fiction', 'fiction', 'Novels, short stories, and creative literature', id, 'pen-tool'
FROM public.categories WHERE slug = 'general';

INSERT INTO public.categories (name, slug, description, parent_id, icon)
SELECT 'Non-Fiction', 'non-fiction', 'Factual books on various subjects', id, 'file-text'
FROM public.categories WHERE slug = 'general';

INSERT INTO public.categories (name, slug, description, parent_id, icon)
SELECT 'Poetry', 'poetry', 'Collections of poems and poetic works', id, 'feather'
FROM public.categories WHERE slug = 'general';

INSERT INTO public.categories (name, slug, description, parent_id, icon)
SELECT 'Self-Help', 'self-help', 'Personal development and self-improvement books', id, 'sparkles'
FROM public.categories WHERE slug = 'general';

INSERT INTO public.categories (name, slug, description, parent_id, icon)
SELECT 'Quran Studies', 'quran', 'Tafsir, Quran translations, and related studies', id, 'book'
FROM public.categories WHERE slug = 'islamic';

INSERT INTO public.categories (name, slug, description, parent_id, icon)
SELECT 'Hadith', 'hadith', 'Collections of Hadith and related commentary', id, 'scroll'
FROM public.categories WHERE slug = 'islamic';

INSERT INTO public.categories (name, slug, description, parent_id, icon)
SELECT 'Fiqh', 'fiqh', 'Islamic jurisprudence and legal rulings', id, 'scale'
FROM public.categories WHERE slug = 'islamic';

INSERT INTO public.categories (name, slug, description, parent_id, icon)
SELECT 'Seerah', 'seerah', 'Biography of Prophet Muhammad (PBUH) and companions', id, 'users'
FROM public.categories WHERE slug = 'islamic';

INSERT INTO public.categories (name, slug, description, parent_id, icon)
SELECT 'Tasawwuf', 'tasawwuf', 'Islamic spirituality and Sufism', id, 'heart'
FROM public.categories WHERE slug = 'islamic';