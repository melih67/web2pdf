-- ==============================================================================
-- FINAL SETUP SCRIPT FOR A COMPLETELY NEW AND EMPTY DATABASE
-- ==============================================================================
-- This script is simplified to ensure it runs successfully on a fresh database.
-- It contains only the essential commands.

-- 1. Create the pdf_exports table
-- This is the primary table for storing PDF export history.
CREATE TABLE public.pdf_exports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes on the new table
-- These improve the performance of queries.
CREATE INDEX idx_pdf_exports_user_id ON public.pdf_exports(user_id);
CREATE INDEX idx_pdf_exports_created_at ON public.pdf_exports(created_at DESC);

-- 3. Enable Row Level Security (RLS)
-- This is a critical security step to protect user data.
ALTER TABLE public.pdf_exports ENABLE ROW LEVEL SECURITY;

-- 4. Create the security policies for the table
-- These policies define who can access and modify the data.
CREATE POLICY "Users can view their own exports" ON public.pdf_exports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exports" ON public.pdf_exports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exports" ON public.pdf_exports
  FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- MANUAL SETUP FOR STORAGE
-- ==============================================================================
-- The following policies must be created manually in the Supabase Dashboard
-- for the 'pdfs' storage bucket. This cannot be done via SQL.

-- Policy: "Users can upload their own files"
-- Operation: INSERT
-- Condition: auth.uid()::text = (storage.foldername(name))[1]

-- Policy: "Users can view their own files"
-- Operation: SELECT
-- Condition: auth.uid()::text = (storage.foldername(name))[1]

-- Policy: "Users can delete their own files"
-- Operation: DELETE
-- Condition: auth.uid()::text = (storage.foldername(name))[1]