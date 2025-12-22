-- Create storage bucket for note images
-- Run this in Supabase SQL Editor

-- Create the bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('note-images', 'note-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Users can upload note images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'note-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view their own images
CREATE POLICY "Users can view own note images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'note-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public to view images (for sharing)
CREATE POLICY "Public can view note images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'note-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete own note images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'note-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
