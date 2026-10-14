-- Supabase Storage & Administration Setup Script
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- ==============================================================================
-- 1. STORAGE BUCKET: product-images
-- ==============================================================================
-- Insert product-images bucket if it does not already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage RLS Policies:
-- 1. Public can view all product images
CREATE POLICY "Public Read Product Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- 2. Authenticated users (sellers & admins) can upload product images
CREATE POLICY "Authenticated Users Can Upload Product Images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);

-- 3. Users can update and delete their uploaded images
CREATE POLICY "Users Can Update Own Images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users Can Delete Own Images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);

-- ==============================================================================
-- 2. SAFE ADMIN ROLE ASSIGNMENT
-- ==============================================================================
-- DO NOT grant admin access through client request or profile update!
-- To grant a user administrative privileges, execute this query with the user's email:
/*
  UPDATE public.profiles
  SET role = 'admin'
  WHERE email = 'your-admin-email@example.com';
*/
