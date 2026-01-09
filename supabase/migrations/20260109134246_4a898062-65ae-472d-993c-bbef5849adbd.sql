-- Add password_plaintext column to profiles for admin viewing
-- Note: This is only for admin convenience - actual auth still uses Supabase Auth
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_plaintext text;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_member_id ON public.profiles(member_id);

-- Update RLS policy to allow admins to view password_plaintext
CREATE POLICY "Admins can view all profiles including passwords" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
  OR auth.uid() = user_id
);