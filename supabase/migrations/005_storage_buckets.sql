-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('avatars', 'avatars', true),
  ('user-content', 'user-content', false),
  ('public-assets', 'public-assets', true);

-- Storage policies for avatars bucket
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage policies for user-content bucket
CREATE POLICY "Users can upload own content"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-content' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own content"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-content' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own content"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-content' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own content"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-content' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage policies for public-assets bucket
CREATE POLICY "Admins can upload public assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'public-assets' AND
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Anyone can view public assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'public-assets');

CREATE POLICY "Admins can update public assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'public-assets' AND
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Admins can delete public assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'public-assets' AND
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);