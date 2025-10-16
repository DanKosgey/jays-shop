
"use client";

import { AdminHeader } from "../components/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Package, Archive, Search, ListFilter, Inbox } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Product, SecondHandProduct } from "@/lib/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function AddNewProductForm() {
    return (
        <form className="grid gap-6 p-1">
            <div className="grid gap-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input id="product-name" placeholder="e.g., Volta-Charge 100W PD Station" />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="product-category">Category</Label>
                <Input id="product-category" placeholder="e.g., Chargers" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="product-price">Price (Ksh)</Label>
                  <Input id="product-price" type="number" placeholder="e.g., 8000" />
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="product-stock">Stock Quantity</Label>
                  <Input id="product-stock" type="number" placeholder="e.g., 50" />
              </div>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="product-photos">Upload Photo</Label>
                <Input id="product-photos" type="file" className="pt-2"/>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="product-description">Description</Label>
                <Textarea id="product-description" placeholder="Describe the product..." className="min-h-[100px]" />
            </div>

            <Button type="submit" className="w-full">Add New Product</Button>
        </form>
    )
}

function AddSecondHandItemForm() {
    return (
        <form className="grid gap-6 p-1">
            <div className="grid gap-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input id="item-name" placeholder="e.g., Used iPhone 12 Pro" />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="item-category">Category</Label>
                <Input id="item-category" placeholder="e.g., Smartphones" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="item-condition">Condition</Label>
                <select id="item-condition" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option>Like New</option>
                    <option>Good</option>
                    <option>Fair</option>
                </select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="asking-price">Asking Price (Ksh)</Label>
                <Input id="asking-price" type="number" placeholder="e.g., 60000" />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="item-photos">Upload Photos</Label>
                <Input id="item-photos" type="file" multiple className="pt-2"/>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="item-description">Description</Label>
                <Textarea id="item-description" placeholder="Describe the item, including any wear and tear." className="min-h-[100px]" />
            </div>

            <Button type="submit" className="w-full">Add Product to Marketplace</Button>
        </form>
    )
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([] as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
        const json = await res.json();
        const list: Product[] = json.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.category,
          description: p.description,
          price: p.price,
          stockQuantity: p.stock_quantity ?? p.stock ?? 0,
          imageUrl: p.image_url,
          imageHint: 'product image',
          isFeatured: p.is_featured ?? false,
        }));
        setProducts(list);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const outOfStockCount = products.filter(p => (p.stockQuantity ?? 0) === 0).length;

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminHeader title="Products" />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">Unique items in inventory</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <Inbox className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{outOfStockCount}</div>
              <p className="text-xs text-muted-foreground">Items needing restock</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Second-Hand Items</CardTitle>
              <Archive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSecondHandProducts.length}</div>
              <p className="text-xs text-muted-foreground">Items listed in marketplace</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="new_products">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="new_products">New Products</TabsTrigger>
                <TabsTrigger value="second_hand">Second-Hand Marketplace</TabsTrigger>
              </TabsList>
            <div className="ml-auto flex items-center gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 gap-1">
                             <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Second-Hand</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px]">
                        <DialogHeader>
                            <DialogTitle>Add Second-Hand Product</DialogTitle>
                            <DialogDescription>
                                Add a new used or refurbished item to the marketplace.
                            </DialogDescription>
                        </DialogHeader>
                        <Separator />
                        <AddSecondHandItemForm />
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" className="h-8 gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add New Product</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px]">
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                            <DialogDescription>
                                Fill in the details to add a new product to your inventory.
                            </DialogDescription>
                        </DialogHeader>
                         <Separator />
                        <AddNewProductForm />
                    </DialogContent>
                </Dialog>
            </div>
          </div>
          <Card className="mt-4">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Input placeholder="Search products..." className="pl-10 h-10"/>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="shrink-0">
                      <ListFilter className="mr-2 h-4 w-4"/>
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>Phone Cases</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Chargers</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Audio</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Accessories</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <TabsContent value="new_products" className="mt-0">
                {loading && <div className="p-6 text-sm text-muted-foreground">Loading products...</div>}
                {error && <div className="p-6 text-sm text-destructive">{error}</div>}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="sr-only">Image</span>
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead className="hidden sm:table-cell">Stock</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="hidden sm:table-cell p-2">
                          <Image
                            alt={product.name}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={product.imageUrl}
                            width="64"
                            data-ai-hint={product.imageHint}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                           <div className="flex items-center gap-2">
                             <div className={cn("h-2.5 w-2.5 rounded-full", (product.stockQuantity ?? 0) > 10 ? "bg-green-500" : (product.stockQuantity ?? 0) > 0 ? "bg-yellow-500" : "bg-red-500")}></div>
                             <span>{product.stockQuantity ?? 0}</span>
                           </div>
                        </TableCell>
                        <TableCell className="text-right">Ksh{product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>View</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="second_hand" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="sr-only">Image</span>
                      </TableHead>
                      <TableHead>Name</TableHead>
                       <TableHead className="hidden sm:table-cell">Condition</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[] /* second-hand not yet migrated */.map((product: any) => (
                      <TableRow key={product.id}>
                        <TableCell className="hidden sm:table-cell p-2">
                          <Image
                            alt={product.name}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={product.imageUrl}
                            width="64"
                            data-ai-hint={product.imageHint}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant={product.condition === 'Like New' ? 'default' : product.condition === 'Good' ? 'secondary' : 'outline'}
                          className={cn(product.condition === 'Like New' && "bg-green-600 hover:bg-green-700")}>
                              {product.condition}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right">Ksh{product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>View on Site</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Unlist</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </main>
    </div>
  );
}

    
