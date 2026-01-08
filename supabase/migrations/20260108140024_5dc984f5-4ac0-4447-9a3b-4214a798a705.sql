-- Add conducted_by column to achievements table
ALTER TABLE public.achievements 
ADD COLUMN conducted_by TEXT;