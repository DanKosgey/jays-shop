-- Update the image_url constraint to allow empty strings
ALTER TABLE public.products 
DROP CONSTRAINT IF EXISTS chk_products_image_url_format;

ALTER TABLE public.products 
ADD CONSTRAINT chk_products_image_url_format CHECK (image_url = '' OR image_url ~* '^https?://');