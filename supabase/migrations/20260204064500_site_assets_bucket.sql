-- Create storage bucket for general site assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users (admins) to upload to any folder in site-assets
CREATE POLICY "Admins can upload site assets"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'site-assets'
  AND (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  )
);

-- Allow authenticated users (admins) to update site assets
CREATE POLICY "Admins can update site assets"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'site-assets'
  AND (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  )
);

-- Allow authenticated users (admins) to delete site assets
CREATE POLICY "Admins can delete site assets"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'site-assets'
  AND (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  )
);

-- Allow anyone to view site assets (public bucket)
CREATE POLICY "Anyone can view site assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'site-assets');
