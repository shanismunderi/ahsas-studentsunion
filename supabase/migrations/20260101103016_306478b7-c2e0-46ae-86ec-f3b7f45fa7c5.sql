-- Add new columns for approval workflow and points system
ALTER TABLE public.achievements 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS admin_feedback text,
ADD COLUMN IF NOT EXISTS reviewed_by uuid,
ADD COLUMN IF NOT EXISTS reviewed_at timestamp with time zone;

-- Create storage bucket for achievement certificates
INSERT INTO storage.buckets (id, name, public)
VALUES ('achievement-certificates', 'achievement-certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their certificates
CREATE POLICY "Users can upload their own certificates"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'achievement-certificates'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own certificates
CREATE POLICY "Users can update their own certificates"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'achievement-certificates'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own certificates
CREATE POLICY "Users can delete their own certificates"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'achievement-certificates'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow anyone to view certificates (public bucket)
CREATE POLICY "Anyone can view certificates"
ON storage.objects
FOR SELECT
USING (bucket_id = 'achievement-certificates');

-- Create a view for public leaderboard (only approved achievements)
CREATE OR REPLACE VIEW public.member_leaderboard AS
SELECT 
  p.id as member_id,
  p.full_name,
  p.profile_photo_url,
  p.department,
  COALESCE(SUM(a.points), 0) as total_points,
  COUNT(a.id) as achievement_count
FROM public.profiles p
LEFT JOIN public.achievements a ON p.id = a.member_id AND a.status = 'approved'
GROUP BY p.id, p.full_name, p.profile_photo_url, p.department
HAVING COALESCE(SUM(a.points), 0) > 0
ORDER BY total_points DESC;