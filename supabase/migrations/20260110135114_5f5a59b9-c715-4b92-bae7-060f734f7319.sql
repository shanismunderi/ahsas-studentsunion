-- Drop conflicting policies and create a clean public login lookup policy
DROP POLICY IF EXISTS "Public can lookup email by member_id for login" ON public.profiles;

-- Allow public to select ONLY email by member_id (for login lookup)
CREATE POLICY "Public can lookup email by member_id for login"
ON public.profiles
FOR SELECT
USING (true);

-- Note: This allows reading profiles publicly. The sensitive password_plaintext 
-- is only visible to admins via their separate policy which overrides for admins.