
'use client'

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { mockProducts } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, ListFilter, ArrowRight } from "lucide-react";
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

export default function ShopPage() {
  const categories = [...new Set(mockProducts.map((p) => p.category))];

  return (
    <div className="bg-background">
      <div className="container max-w-7xl mx-auto py-12 px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-3">Shop Accessories</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">Find the perfect gear to complement your devices. High-quality accessories for every need.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-1/4 xl:w-1/5">
            <div className="sticky top-24">
              <div className="hidden lg:block">
                  <h3 className="text-xl font-semibold font-headline mb-6">Filter Products</h3>
                  <div className="space-y-6">
                      <div>
                          <h4 className="font-semibold text-foreground mb-4">Categories</h4>
                          <ul className="space-y-3">
                              {categories.map((category) => (
                                  <li key={category} className="flex items-center space-x-2">
                                      <Checkbox id={category.toLowerCase()}/>
                                      <Label htmlFor={category.toLowerCase()} className="text-muted-foreground hover:text-accent transition-colors cursor-pointer">
                                          {category}
                                      </Label>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="w-full lg:w-3/4 xl:w-4/5">
            {/* Toolbar */}
            <div className="flex items-center mb-6 gap-4">
              <div className="relative flex-1">
                <Input placeholder="Search for products..." className="pl-10 h-11 text-base"/>
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
                  <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                  <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                  <DropdownMenuItem>Newest</DropdownMenuItem>
                  <DropdownMenuItem>Featured</DropdownMenuItem>
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
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold text-foreground mb-4">Categories</h4>
                            <ul className="space-y-3">
                                {categories.map((category) => (
                                    <li key={category} className="flex items-center space-x-2">
                                        <Checkbox id={`mobile-${category.toLowerCase()}`}/>
                                        <Label htmlFor={`mobile-${category.toLowerCase()}`} className="text-muted-foreground hover:text-accent transition-colors cursor-pointer">
                                            {category}
                                        </Label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {mockProducts.map((product: Product) => (
                <Card key={product.id} className="overflow-hidden group flex flex-col border-border/60 hover:shadow-xl hover:border-accent transition-all duration-300">
                  <CardHeader className="p-0">
                    <div className="aspect-square overflow-hidden bg-muted">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={400}
                        height={400}
                        data-ai-hint={product.imageHint}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
                    <h3 className="text-lg font-bold font-headline mb-4 flex-1 leading-snug">{product.name}</h3>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-2xl font-semibold text-accent">Ksh{product.price.toFixed(2)}</p>
                      <Button asChild size="icon" className="relative group/button">
                        <Link href={`/product/${product.slug}`}>
                            <span className="group-hover/button:opacity-0 transition-opacity">View</span>
                            <ArrowRight className="absolute h-4 w-4 opacity-0 group-hover/button:opacity-100 transition-opacity" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
             {/* Pagination (dummy) */}
            <div className="flex justify-center mt-12">
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" disabled>{"<"}</Button>
                    <Button variant="outline">1</Button>
                    <Button variant="ghost">2</Button>
                    <Button variant="ghost">3</Button>
                    <Button variant="outline" size="icon">{">"}</Button>
                </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
