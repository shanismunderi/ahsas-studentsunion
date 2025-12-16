-- Allow members to insert their own achievements
CREATE POLICY "Members can insert their own achievements"
ON public.achievements
FOR INSERT
WITH CHECK (
  member_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Allow members to update their own achievements
CREATE POLICY "Members can update their own achievements"
ON public.achievements
FOR UPDATE
USING (
  member_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Allow members to delete their own achievements
CREATE POLICY "Members can delete their own achievements"
ON public.achievements
FOR DELETE
USING (
  member_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Allow members to insert their own documents
CREATE POLICY "Members can insert their own documents"
ON public.documents
FOR INSERT
WITH CHECK (
  member_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Allow members to update their own documents
CREATE POLICY "Members can update their own documents"
ON public.documents
FOR UPDATE
USING (
  member_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Allow members to delete their own documents
CREATE POLICY "Members can delete their own documents"
ON public.documents
FOR DELETE
USING (
  member_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);