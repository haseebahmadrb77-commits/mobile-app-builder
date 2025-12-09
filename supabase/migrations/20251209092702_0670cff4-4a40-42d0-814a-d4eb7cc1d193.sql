-- Fix security issues: Update RLS policies for better data protection

-- 1. Update profiles SELECT policy to require authentication
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 2. Update reviews SELECT policy to require authentication  
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Authenticated users can view reviews" 
ON public.reviews 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 3. Add UPDATE policy for user_books
CREATE POLICY "Users can update their own library" 
ON public.user_books 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Add UPDATE policy for bookmarks
CREATE POLICY "Users can update their own bookmarks" 
ON public.bookmarks 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Add DELETE policy for reading_progress
CREATE POLICY "Users can delete their own progress" 
ON public.reading_progress 
FOR DELETE 
USING (auth.uid() = user_id);

-- 6. Add DELETE policy for profiles (GDPR compliance)
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);