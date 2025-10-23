'use client'

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SecondHandProduct } from "@/lib/types";
import { useEffect, useState, useMemo } from 'react';
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
import { Separator } from "@/components/ui/separator";

const CONDITIONS = ["Like New", "Good", "Fair"] as const;
const SORT_OPTIONS = {
  PRICE_LOW: 'price-low',
  PRICE_HIGH: 'price-high',
  NEWEST: 'newest',
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

export default function MarketplacePage() {
  const [items, setItems] = useState<SecondHandProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedConditions, setSelectedConditions] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>(SORT_OPTIONS.NEWEST);

  useEffect(() => {
    const fetchSecondHandProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/second-hand-products');
        if (!response.ok) {
          throw new Error('Failed to fetch second hand products');
        }
        const data = await response.json();
        setItems(data.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSecondHandProducts();
  }, []);

  const categories = useMemo(() => 
    [...new Set(items.map((p) => p.category))], 
    [items]
  );

  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategories.size > 0) {
      result = result.filter(item => selectedCategories.has(item.category));
    }

    // Apply condition filter
    if (selectedConditions.size > 0) {
      result = result.filter(item => selectedConditions.has(item.condition));
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
        // Assumes items are already sorted by newest by default
        break;
    }

    return result;
  }, [items, searchQuery, selectedCategories, selectedConditions, sortBy]);

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

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev => {
      const next = new Set(prev);
      if (next.has(condition)) {
        next.delete(condition);
      } else {
        next.add(condition);
      }
      return next;
    });
  };

  const FilterSection = ({ isMobile = false }) => (
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
      <Separator />
      <div>
        <h4 className="font-semibold text-foreground mb-4">Condition</h4>
        <ul className="space-y-3">
          {CONDITIONS.map((condition) => (
            <li key={condition} className="flex items-center space-x-2">
              <Checkbox 
                id={`${isMobile ? 'mobile-' : ''}${condition.toLowerCase().replace(' ', '-')}`}
                checked={selectedConditions.has(condition)}
                onCheckedChange={() => toggleCondition(condition)}
              />
              <Label 
                htmlFor={`${isMobile ? 'mobile-' : ''}${condition.toLowerCase().replace(' ', '-')}`}
                className="text-muted-foreground hover:text-accent transition-colors cursor-pointer"
              >
                {condition}
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
            Second-Hand Marketplace
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Find great deals on pre-owned electronics, exclusively sold by Jay's phone repair shop.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-1/4 xl:w-1/5">
            <div className="sticky top-24 space-y-8">
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
                  placeholder="Search for second-hand items..." 
                  className="pl-10 h-11 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="hidden sm:flex">
                    Sort by
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
                Showing {filteredAndSortedItems.length} of {items.length} items
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
              
              {!loading && !error && filteredAndSortedItems.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg">No items found matching your criteria.</p>
                </div>
              )}
              
              {!loading && !error && filteredAndSortedItems.map((product: SecondHandProduct) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden group flex flex-col border-border/60 hover:shadow-xl hover:border-accent transition-all duration-300"
                >
                  <CardHeader className="p-0 relative">
                    <div className="absolute top-2 left-2 z-10">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
                        {product.condition}
                      </span>
                    </div>
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Pagination (dummy) */}
            {!loading && !error && filteredAndSortedItems.length > 0 && (
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