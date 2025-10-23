'use client'

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Product } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, ListFilter, ArrowRight, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

import { useEffect, useState, useMemo } from 'react';
import { fetchProducts } from "@/lib/data-fetching";
import { transformProductsData } from "@/lib/data-transform";

const SORT_OPTIONS = {
  PRICE_LOW: 'price-low',
  PRICE_HIGH: 'price-high',
  NEWEST: 'newest',
  FEATURED: 'featured',
} as const;

type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];

// Product image component with fallback handling
function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setIsLoading(false);
      setHasError(true);
      // Fallback to placeholder image (PNG format)
      setImgSrc('https://placehold.co/400x400/png?text=No+Image&font=roboto');
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative aspect-square overflow-hidden bg-muted">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={400}
        height={400}
        onError={handleError}
        onLoad={handleLoad}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>(SORT_OPTIONS.FEATURED);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        const response: any = await fetchProducts();
        const products = transformProductsData(response.products);
        setProducts(products);
      } catch (e: any) {
        setError(e?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProductsData();
  }, []);

  const categories = useMemo(() => 
    [...new Set(products.map((p) => p.category))].filter(Boolean) as string[], 
    [products]
  );

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategories.size > 0) {
      result = result.filter(product => 
        product.category && selectedCategories.has(product.category)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case SORT_OPTIONS.PRICE_LOW:
        result.sort((a, b) => a.price - b.price);
        break;
      case SORT_OPTIONS.PRICE_HIGH:
        result.sort((a, b) => b.price - a.price);
        break;
      case SORT_OPTIONS.NEWEST:
        // Assumes items have a date field or are ordered by default
        result.reverse();
        break;
      case SORT_OPTIONS.FEATURED:
        // Default ordering from API
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategories, sortBy]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case SORT_OPTIONS.PRICE_LOW:
        return 'Price: Low to High';
      case SORT_OPTIONS.PRICE_HIGH:
        return 'Price: High to Low';
      case SORT_OPTIONS.NEWEST:
        return 'Newest';
      case SORT_OPTIONS.FEATURED:
        return 'Featured';
      default:
        return 'Sort by';
    }
  };

  const FilterSection = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-foreground mb-4">Categories</h4>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={`${isMobile ? 'mobile-' : ''}${category.toLowerCase()}`}
                checked={selectedCategories.has(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label 
                htmlFor={`${isMobile ? 'mobile-' : ''}${category.toLowerCase()}`}
                className="text-muted-foreground hover:text-accent transition-colors cursor-pointer"
              >
                {category}
              </Label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="bg-background">
      <div className="container max-w-7xl mx-auto py-12 px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-3">
            Shop Accessories
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Find the perfect gear to complement your devices. High-quality accessories for every need.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-1/4 xl:w-1/5">
            <div className="sticky top-24">
              <div className="hidden lg:block">
                <h3 className="text-xl font-semibold font-headline mb-6">Filter Products</h3>
                <FilterSection />
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="w-full lg:w-3/4 xl:w-4/5">
            {/* Toolbar */}
            <div className="flex items-center mb-6 gap-4">
              <div className="relative flex-1">
                <Input 
                  placeholder="Search for products..." 
                  className="pl-10 h-11 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="hidden sm:flex">
                    {getSortLabel(sortBy)}
                    <ListFilter className="ml-2 h-4 w-4"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortBy(SORT_OPTIONS.PRICE_LOW)}>
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy(SORT_OPTIONS.PRICE_HIGH)}>
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy(SORT_OPTIONS.NEWEST)}>
                    Newest
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy(SORT_OPTIONS.FEATURED)}>
                    Featured
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <ListFilter className="h-4 w-4"/>
                      <span className="sr-only">Filters</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <h3 className="text-xl font-semibold font-headline mb-6">Filter Products</h3>
                    <FilterSection isMobile />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            {/* Results count */}
            {!loading && !error && (
              <p className="text-sm text-muted-foreground mb-4">
                Showing {filteredAndSortedProducts.length} of {products.length} products
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {loading && (
                <div className="col-span-full flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              
              {error && (
                <div className="col-span-full text-center text-destructive py-12">
                  {error}
                </div>
              )}
              
              {!loading && !error && filteredAndSortedProducts.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
                  {(searchQuery || selectedCategories.size > 0) && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategories(new Set());
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
              
              {!loading && !error && filteredAndSortedProducts.map((product: Product) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden group flex flex-col border-border/60 hover:shadow-xl hover:border-accent transition-all duration-300"
                >
                  <CardHeader className="p-0">
                    <ProductImage 
                      src={product.imageUrl} 
                      alt={product.name} 
                    />
                  </CardHeader>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
                    <h3 className="text-lg font-bold font-headline mb-4 flex-1 leading-snug">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-2xl font-semibold text-accent">
                        Ksh{product.price.toFixed(2)}
                      </p>
                      <Button asChild size="icon" className="relative group/button">
                        <Link href={`/product/${product.slug}`}>
                          <span className="group-hover/button:opacity-0 transition-opacity">
                            View
                          </span>
                          <ArrowRight className="absolute h-4 w-4 opacity-0 group-hover/button:opacity-100 transition-opacity" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Pagination (dummy) */}
            {!loading && !error && filteredAndSortedProducts.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" disabled>{"<"}</Button>
                  <Button variant="outline">1</Button>
                  <Button variant="ghost">2</Button>
                  <Button variant="ghost">3</Button>
                  <Button variant="outline" size="icon">{">"}</Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}