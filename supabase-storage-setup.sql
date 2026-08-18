-- 1. Create the bucket (if it doesn't already exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('route-images', 'route-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow everyone to view/download images (Public Read Access)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'route-images');

-- 3. Allow authenticated admin users to upload new images
CREATE POLICY "Auth Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'route-images' 
    AND auth.role() = 'authenticated'
);

-- 4. Allow authenticated admin users to update their uploaded images
CREATE POLICY "Auth Update" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'route-images' 
    AND auth.role() = 'authenticated'
);

-- 5. Allow authenticated admin users to delete images
CREATE POLICY "Auth Delete" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'route-images' 
    AND auth.role() = 'authenticated'
);
