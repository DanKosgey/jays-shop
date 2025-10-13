import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { mockProducts } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ShopPage() {
  const categories = [...new Set(mockProducts.map((p) => p.category))];

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold">Shop Accessories & Appliances</h1>
        <p className="text-muted-foreground mt-2">Find the perfect gear to complement your devices.</p>
        <div className="mt-6 max-w-lg mx-auto">
            <div className="relative">
                <Input placeholder="Search for products..." className="pl-10 h-12 text-base"/>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
            </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold font-headline">Categories</h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <Link href="#" className="text-muted-foreground hover:text-accent transition-colors">
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid */}
        <main className="w-full md:w-3/4 lg:w-4/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map((product: Product) => (
              <Card key={product.id} className="overflow-hidden group flex flex-col">
                <CardHeader className="p-0">
                  <div className="aspect-square overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={400}
                      height={400}
                      data-ai-hint={product.imageHint}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col flex-1">
                  <h3 className="text-base font-bold font-headline mb-2 flex-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-xl font-semibold text-accent">Ksh{product.price.toFixed(2)}</p>
                    <Button asChild size="sm">
                      <Link href={`/product/${product.slug}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
