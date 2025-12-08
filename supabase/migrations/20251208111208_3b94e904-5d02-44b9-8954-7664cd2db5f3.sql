-- Enable pg_trgm extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create full-text search configuration and index on books table
CREATE INDEX IF NOT EXISTS books_title_search_idx ON public.books USING GIN (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS books_author_search_idx ON public.books USING GIN (to_tsvector('english', author));
CREATE INDEX IF NOT EXISTS books_description_search_idx ON public.books USING GIN (to_tsvector('english', COALESCE(description, '')));

-- Create trigram indexes for fuzzy search
CREATE INDEX IF NOT EXISTS books_title_trgm_idx ON public.books USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS books_author_trgm_idx ON public.books USING GIN (author gin_trgm_ops);

-- Create a combined full-text search function
CREATE OR REPLACE FUNCTION public.search_books(search_query TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  author TEXT,
  description TEXT,
  cover_url TEXT,
  category_id UUID,
  average_rating NUMERIC,
  review_count INTEGER,
  download_count INTEGER,
  publication_year INTEGER,
  pages INTEGER,
  status TEXT,
  rank REAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.title,
    b.author,
    b.description,
    b.cover_url,
    b.category_id,
    b.average_rating,
    b.review_count,
    b.download_count,
    b.publication_year,
    b.pages,
    b.status,
    (
      ts_rank(to_tsvector('english', b.title), plainto_tsquery('english', search_query)) * 3 +
      ts_rank(to_tsvector('english', b.author), plainto_tsquery('english', search_query)) * 2 +
      ts_rank(to_tsvector('english', COALESCE(b.description, '')), plainto_tsquery('english', search_query))
    )::REAL AS rank
  FROM public.books b
  WHERE 
    b.status = 'published' AND
    (
      to_tsvector('english', b.title) @@ plainto_tsquery('english', search_query) OR
      to_tsvector('english', b.author) @@ plainto_tsquery('english', search_query) OR
      to_tsvector('english', COALESCE(b.description, '')) @@ plainto_tsquery('english', search_query) OR
      b.title ILIKE '%' || search_query || '%' OR
      b.author ILIKE '%' || search_query || '%'
    )
  ORDER BY rank DESC, b.download_count DESC NULLS LAST;
END;
$$;

-- Enable realtime for books table
ALTER PUBLICATION supabase_realtime ADD TABLE public.books;