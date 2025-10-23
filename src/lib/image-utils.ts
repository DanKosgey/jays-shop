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
 * @param path - The path to store the file (e.g., 'products/product-name.jpg')
 * @returns The public URL of the uploaded image
 */
export async function uploadProductImage(
  file: File, 
  path: string
): Promise<{ url: string; error: string | null }> {
  try {
    // This would typically use the Supabase client
    // For now, we'll return a placeholder
    console.warn('Image upload functionality needs to be implemented with Supabase client');
    return {
      url: `http://localhost:54321/storage/v1/object/public/products/${path}`,
      error: null
    };
  } catch (error: any) {
    return {
      url: getFallbackImageUrl(),
      error: error?.message || 'Failed to upload image'
    };
  }
}