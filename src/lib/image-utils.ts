// Utility functions for handling product images

/**
 * Validates if an image URL is accessible
 * @param url - The image URL to validate
 * @returns Promise resolving to true if image is accessible, false otherwise
 */
export async function isImageUrlValid(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn(`Failed to validate image URL ${url}:`, error);
    return false;
  }
}

/**
 * Gets a fallback image URL
 * @returns A URL to a placeholder image (PNG format)
 */
export function getFallbackImageUrl(): string {
  // Using a free placeholder service that returns PNG images
  return 'https://placehold.co/400x400/png?text=No+Image&font=roboto';
}

/**
 * Ensures an image URL is valid, returning a fallback if not
 * @param url - The image URL to check
 * @param fallbackUrl - Optional fallback URL (defaults to placeholder)
 * @returns A valid image URL
 */
export async function ensureValidImageUrl(
  url: string, 
  fallbackUrl?: string
): Promise<string> {
  // If URL is empty or invalid format, return fallback immediately
  if (!url || typeof url !== 'string') {
    return fallbackUrl || getFallbackImageUrl();
  }
  
  // Check if URL is valid
  try {
    new URL(url);
  } catch (error) {
    console.warn(`Invalid URL format: ${url}`);
    return fallbackUrl || getFallbackImageUrl();
  }
  
  // Check if image URL is accessible
  const isValid = await isImageUrlValid(url);
  if (isValid) {
    return url;
  }
  
  console.warn(`Image URL is not accessible: ${url}`);
  return fallbackUrl || getFallbackImageUrl();
}

/**
 * Generates a product image URL from Supabase storage
 * @param fileName - The name of the file in the products bucket
 * @param supabaseUrl - The base Supabase URL
 * @returns A full URL to the product image
 */
export function generateProductImageUrl(
  fileName: string, 
  supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
): string {
  if (!fileName) {
    return getFallbackImageUrl();
  }
  
  // If it's already a full URL, return as is
  if (fileName.startsWith('http')) {
    return fileName;
  }
  
  // Construct the public URL
  return `${supabaseUrl}/storage/v1/object/public/products/${encodeURIComponent(fileName)}`;
}

/**
 * Uploads an image to Supabase storage and returns the public URL
 * @param file - The file to upload
 * @param fileName - The name to give the file in storage
 * @returns The public URL of the uploaded image
 */
export async function uploadProductImage(
  file: File, 
  fileName: string
): Promise<{ url: string; error: string | null }> {
  try {
    // Initialize Supabase client with service role for direct upload
    // In a real application, this would be done server-side for security
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Upload directly to the products bucket
    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Return the public URL for the uploaded image
    return {
      url: `${supabaseUrl}/storage/v1/object/public/products/${fileName}`,
      error: null
    };
  } catch (error: any) {
    return {
      url: getFallbackImageUrl(),
      error: error?.message || 'Failed to upload image'
    };
  }
}