-- Drop the security definer view and recreate as a regular view
DROP VIEW IF EXISTS public.member_leaderboard;

-- Create regular view for leaderboard (no SECURITY DEFINER)
CREATE VIEW public.member_leaderboard AS
SELECT 
  p.id as member_id,
  p.full_name,
  p.profile_photo_url,
  p.department,
  COALESCE(SUM(a.points), 0)::integer as total_points,
  COUNT(a.id)::integer as achievement_count
FROM public.profiles p
LEFT JOIN public.achievements a ON p.id = a.member_id AND a.status = 'approved'
GROUP BY p.id, p.full_name, p.profile_photo_url, p.department
HAVING COALESCE(SUM(a.points), 0) > 0
ORDER BY total_points DESC;