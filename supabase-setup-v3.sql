-- This script is for setting up a fresh, new database.
-- It will create the necessary tables, policies, and functions.

-- 1. Create the pdf_exports table for the history
CREATE TABLE public.pdf_exports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes to improve performance
CREATE INDEX idx_pdf_exports_user_id ON public.pdf_exports(user_id);
CREATE INDEX idx_pdf_exports_created_at ON public.pdf_exports(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.pdf_exports ENABLE ROW LEVEL SECURITY;

-- 4. Create security policies for the pdf_exports table
CREATE POLICY "Users can view their own exports" ON public.pdf_exports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exports" ON public.pdf_exports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exports" ON public.pdf_exports
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Reminder for Storage Policies
-- The following policies must be created or updated manually in the Supabase Dashboard
-- under Storage > Policies for the 'pdfs' bucket.

-- Policy: "Users can upload their own files"
-- Operation: INSERT
-- Condition: auth.uid()::text = (storage.foldername(name))[1]

-- Policy: "Users can view their own files"
-- Operation: SELECT
-- Condition: auth.uid()::text = (storage.foldername(name))[1]

-- Policy: "Users can delete their own files"
-- Operation: DELETE
-- Condition: auth.uid()::text = (storage.foldername(name))[1]

-- 6. Utility function to clean up old exports (optional)
CREATE OR REPLACE FUNCTION public.cleanup_old_exports()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete exports older than 30 days
  DELETE FROM public.pdf_exports 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;

-- 7. Function to get user statistics (optional)
CREATE OR REPLACE FUNCTION public.get_user_export_stats()
RETURNS TABLE (
  total_exports bigint,
  exports_last_week bigint,
  exports_last_month bigint,
  first_export timestamp with time zone,
  last_export timestamp with time zone
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM public.pdf_exports WHERE user_id = auth.uid()) as total_exports,
    (SELECT COUNT(*) FROM public.pdf_exports WHERE user_id = auth.uid() AND created_at >= NOW() - INTERVAL '7 days') as exports_last_week,
    (SELECT COUNT(*) FROM public.pdf_exports WHERE user_id = auth.uid() AND created_at >= NOW() - INTERVAL '30 days') as exports_last_month,
    (SELECT MIN(created_at) FROM public.pdf_exports WHERE user_id = auth.uid()) as first_export,
    (SELECT MAX(created_at) FROM public.pdf_exports WHERE user_id = auth.uid()) as last_export;
END;
$$;