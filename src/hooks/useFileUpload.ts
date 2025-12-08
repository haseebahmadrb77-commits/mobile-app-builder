import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadResult {
  path: string;
  publicUrl: string;
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadBookCover = async (file: File, bookId?: string): Promise<UploadResult | null> => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return null;
    }

    // Max 5MB for cover images
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Cover image must be less than 5MB',
        variant: 'destructive',
      });
      return null;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = bookId 
        ? `${bookId}.${fileExt}` 
        : `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      // Simulate progress (Supabase doesn't provide upload progress)
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const { error: uploadError } = await supabase.storage
        .from('book-covers')
        .upload(filePath, file, { upsert: true });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('book-covers')
        .getPublicUrl(filePath);

      setProgress(100);
      
      return { path: filePath, publicUrl };
    } catch (error: any) {
      console.error('Cover upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload cover image',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const uploadBookFile = async (file: File, bookId: string): Promise<UploadResult | null> => {
    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF file',
        variant: 'destructive',
      });
      return null;
    }

    // Max 100MB for book files
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Book file must be less than 100MB',
        variant: 'destructive',
      });
      return null;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const fileName = `${bookId}.pdf`;
      const filePath = `books/${fileName}`;

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 90));
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from('book-files')
        .upload(filePath, file, { upsert: true });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      setProgress(100);

      // Book files are private, so we return the path only
      return { path: filePath, publicUrl: '' };
    } catch (error: any) {
      console.error('Book file upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload book file',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const getBookDownloadUrl = async (filePath: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('book-files')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) throw error;
      return data.signedUrl;
    } catch (error: any) {
      console.error('Get download URL error:', error);
      toast({
        title: 'Download failed',
        description: 'Could not generate download link',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteFile = async (bucket: 'book-covers' | 'book-files', filePath: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Delete file error:', error);
      return false;
    }
  };

  return {
    isUploading,
    progress,
    uploadBookCover,
    uploadBookFile,
    getBookDownloadUrl,
    deleteFile,
  };
}
