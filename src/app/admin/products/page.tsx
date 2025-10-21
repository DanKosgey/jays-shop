"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  PlusCircle, 
  Package, 
  Archive, 
  Search, 
  Edit, 
  Trash2,
  Upload,
  Eye,
  Menu
} from "lucide-react";
import { Product } from "@/lib/types";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "../components/mobile-nav";

// Mock data for second-hand products
const mockSecondHandProducts = [
  {
    id: "1",
    name: "iPhone 12 Pro Max",
    category: "Smartphones",
    description: "Excellent condition, minor scratches on back. Fully functional with all accessories.",
    price: 65000,
    stockQuantity: 1,
    imageUrl: "/placeholder.svg",
    imageHint: "iPhone 12 Pro Max",
    isFeatured: false,
    condition: "Like New",
    sellerName: "John Doe"
  },
  {
    id: "2",
    name: "Samsung Galaxy S21 Ultra",
    category: "Smartphones",
    description: "Good condition with normal wear. Battery health at 85%. Comes with charger.",
    price: 45000,
    stockQuantity: 1,
    imageUrl: "/placeholder.svg",
    imageHint: "Samsung Galaxy S21 Ultra",
    isFeatured: false,
    condition: "Good",
    sellerName: "Jane Smith"
  },
  {
    id: "3",
    name: "AirPods Pro (2nd Gen)",
    category: "Audio",
    description: "Lightly used AirPods Pro with wireless charging case. All functions working perfectly.",
    price: 18000,
    stockQuantity: 1,
    imageUrl: "/placeholder.svg",
    imageHint: "AirPods Pro",
    isFeatured: false,
    condition: "Like New",
    sellerName: "Mike Johnson"
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddSecondHandOpen, setIsAddSecondHandOpen] = useState(false);

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
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <MobileNav />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
        </div>
      </header>

      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        {/* Stats Cards */}
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
              <Archive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{outOfStockCount}</div>
              <p className="text-xs text-muted-foreground">Items needing restock</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Second-Hand Items</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSecondHandProducts.length}</div>
              <p className="text-xs text-muted-foreground">Items listed in marketplace</p>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div>
                <CardTitle>Product Inventory</CardTitle>
                <CardDescription>Manage your product catalog and inventory.</CardDescription>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Dialog open={isAddSecondHandOpen} onOpenChange={setIsAddSecondHandOpen}>
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
                    <AddSecondHandItemForm />
                  </DialogContent>
                </Dialog>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Product</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                      <DialogDescription>
                        Fill in the details to add a new product to your inventory.
                      </DialogDescription>
                    </DialogHeader>
                    <AddNewProductForm />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8 h-10"
                />
              </div>
            </div>
            {loading && <div className="text-sm text-muted-foreground py-4">Loading products...</div>}
            {error && <div className="text-sm text-destructive py-4">{error}</div>}
            {!loading && !error && products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding a new product to your inventory.
                </p>
                <Button onClick={() => setIsAddProductOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            ) : (
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
                        <div className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          (product.stockQuantity ?? 0) > 10 
                            ? "bg-green-500" 
                            : (product.stockQuantity ?? 0) > 0 
                              ? "bg-yellow-500" 
                              : "bg-red-500"
                        )}></div>
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
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-{products.length}</strong> of <strong>{products.length}</strong> products
            </div>
          </CardFooter>
        </Card>

        {/* Second-Hand Products Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div>
                <CardTitle>Second-Hand Marketplace</CardTitle>
                <CardDescription>Manage items listed in the second-hand marketplace.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
                {mockSecondHandProducts.map((product: any) => (
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
                      <Badge 
                        variant={product.condition === 'Like New' ? 'default' : product.condition === 'Good' ? 'secondary' : 'outline'}
                        className={cn(product.condition === 'Like New' && "bg-green-600 hover:bg-green-700")}
                      >
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
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View on Site
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Unlist
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function AddNewProductForm() {
  return (
    <div className="grid gap-4 py-4">
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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Choose File
          </Button>
          <Input id="product-photos" type="file" className="hidden" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="product-description">Description</Label>
        <Textarea id="product-description" placeholder="Describe the product..." className="min-h-[100px]" />
      </div>
      <Button type="submit">Add New Product</Button>
    </div>
  );
}

function AddSecondHandItemForm() {
  return (
    <div className="grid gap-4 py-4">
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
        <select 
          id="item-condition" 
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Choose Files
          </Button>
          <Input id="item-photos" type="file" multiple className="hidden" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="item-description">Description</Label>
        <Textarea 
          id="item-description" 
          placeholder="Describe the item, including any wear and tear." 
          className="min-h-[100px]" 
        />
      </div>
      <Button type="submit">Add Product to Marketplace</Button>
    </div>
  );
}