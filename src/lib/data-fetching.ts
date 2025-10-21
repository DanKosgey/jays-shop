// Utility functions for optimized data fetching with caching strategies

// Cache for storing fetched data
const dataCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Function to generate cache key
function getCacheKey(url: string, options: RequestInit = {}): string {
  // Use URL and method for cache key (options.cache is ignored in custom logic)
  const method = (options.method || 'GET').toUpperCase();
  return `${method}_${url}`;
}

// Function to fetch data with caching
export async function fetchWithCache<T>(url: string, options: RequestInit = {}): Promise<T> {
  const cacheKey = getCacheKey(url, options);
  const cached = dataCache.get(cacheKey);
  
  // Check if we have valid cached data
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  
  try {
    // Fetch fresh data (remove cache option as it's not standard)
    const fetchOptions = { ...options };
    delete (fetchOptions as any).cache;
    
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Store in cache
    dataCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data as T;
  } catch (error) {
    // If fetch fails and we have stale cache, return it
    if (cached) {
      console.warn(`Fetch failed, returning stale cache for ${cacheKey}`, error);
      return cached.data as T;
    }
    console.error(`Failed to fetch ${url}:`, error);
    throw error;
  }
}

// Function to fetch tickets with optimized caching and pagination
export async function fetchTickets(ticketNumber?: string, page: number = 1, limit: number = 10) {
  const params = new URLSearchParams();
  if (ticketNumber) params.append('ticketNumber', ticketNumber);
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  const url = `/api/tickets?${params.toString()}`;
    
  return fetchWithCache(url);
}

// Function to fetch products with optimized caching and pagination
export async function fetchProducts(page: number = 1, limit: number = 12) {
  const url = `/api/products?page=${page}&limit=${limit}`;
  
  return fetchWithCache(url);
}

// Function to fetch a single ticket with optimized caching
export async function fetchTicketById(id: string) {
  return fetchWithCache(`/api/tickets/${id}`);
}

// Function to clear cache for a specific key
export function clearCache(url: string, options: RequestInit = {}): void {
  const cacheKey = getCacheKey(url, options);
  dataCache.delete(cacheKey);
}

// Function to clear all cache
export function clearAllCache(): void {
  dataCache.clear();
}