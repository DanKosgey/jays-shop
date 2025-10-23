"use client";

import { useState, useEffect, useRef } from "react";
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
import { PageLogger } from "../components/page-logger";
import { getSupabaseBrowserClient } from "@/server/supabase/client";

function EditProductForm({ product, onUpdate }: { product: Product; onUpdate: (updatedProduct: any) => void }) {
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [price, setPrice] = useState(product.price.toString());
  const [stock, setStock] = useState(product.stockQuantity?.toString() || '0');
  const [description, setDescription] = useState(product.description);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare data according to schema
      const productData = {
        id: product.id,
        name,
        category: category || null,
        price: parseFloat(price),
        stock_quantity: stock ? parseInt(stock) : 0,
        description,
      };

      onUpdate(productData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="edit-product-name">Product Name</Label>
          <Input 
            id="edit-product-name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-product-category">Category</Label>
          <Input 
            id="edit-product-category" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-product-price">Price (Ksh)</Label>
            <Input 
              id="edit-product-price" 
              type="number" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-product-stock">Stock Quantity</Label>
            <Input 
              id="edit-product-stock" 
              type="number" 
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-product-description">Description</Label>
          <Textarea 
            id="edit-product-description" 
            className="min-h-[100px]" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-sm text-destructive text-center">{error}</div>}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => {
            // Reset form to original values
            setName(product.name);
            setCategory(product.category);
            setPrice(product.price.toString());
            setStock(product.stockQuantity?.toString() || '0');
            setDescription(product.description);
          }}>
            Reset
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </div>
    </form>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [secondHandProducts, setSecondHandProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [secondHandLoading, setSecondHandLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [secondHandError, setSecondHandError] = useState<string | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddSecondHandOpen, setIsAddSecondHandOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  useEffect(() => {
    const fetchSecondHandProducts = async () => {
      try {
        setSecondHandLoading(true);
        const res = await fetch('/api/second-hand-products?limit=100', { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to fetch second-hand products: ${res.status}`);
        const json = await res.json();
        setSecondHandProducts(json.products || []);
      } catch (e: any) {
        setSecondHandError(e.message);
      } finally {
        setSecondHandLoading(false);
      }
    };
    fetchSecondHandProducts();
  }, []);

  const outOfStockCount = products.filter(p => (p.stockQuantity ?? 0) === 0).length;

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const response = await fetch(`/api/products?id=${productToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete product');
      }

      // Refresh the data
      window.location.reload();
    } catch (err) {
      console.error('Error deleting product:', err);
      // In a real app, we'd show an error message to the user
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };
  
  const handleUpdateProduct = async (updatedProduct: any) => {
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }

      // Refresh the data
      window.location.reload();
    } catch (err) {
      console.error('Error updating product:', err);
      // In a real app, we'd show an error message to the user
    } finally {
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Add page logger for tracking access */}
      <PageLogger pageName="products" />
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
              <CardTitle className="text-sm font-medium">Marketplace Items</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{secondHandProducts.length}</div>
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
                      <ProductImage
                        src={product.imageUrl}
                        alt={product.name}
                        width={64}
                        height={64}
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
                          <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteProduct(product.id)}>
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
                <CardTitle>Marketplace Listings</CardTitle>
                <CardDescription>Manage items listed in the marketplace.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {secondHandLoading && <div className="text-sm text-muted-foreground py-4">Loading marketplace products...</div>}
            {secondHandError && <div className="text-sm text-destructive py-4">{secondHandError}</div>}
            {!secondHandLoading && !secondHandError && secondHandProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Eye className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No marketplace products found</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding a new marketplace product.
                </p>
                <Dialog open={isAddSecondHandOpen} onOpenChange={setIsAddSecondHandOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsAddSecondHandOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Marketplace Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                      <DialogTitle>Add Marketplace Product</DialogTitle>
                      <DialogDescription>
                        Add a new used or refurbished item to the marketplace.
                      </DialogDescription>
                    </DialogHeader>
                    <AddSecondHandItemForm />
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
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
                  {secondHandProducts.map((product: any) => (
                    <TableRow key={product.id}>
                      <TableCell className="hidden sm:table-cell p-2">
                        <ProductImage
                          src={product.image_url || product.imageUrl || "/placeholder.svg"}
                          alt={product.name}
                          width={64}
                          height={64}
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
                      <TableCell className="text-right">Ksh{product.price?.toFixed(2) || '0.00'}</TableCell>
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
            )}
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-{secondHandProducts.length}</strong> of <strong>{secondHandProducts.length}</strong> second-hand products
            </div>
          </CardFooter>
        </Card>
      </main>
      
      {/* Edit Product Dialog */}
      {selectedProduct && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Make changes to the product details.
              </DialogDescription>
            </DialogHeader>
            <EditProductForm product={selectedProduct} onUpdate={handleUpdateProduct} />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddNewProductForm() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Reset form function
  const resetForm = () => {
    setName('');
    setCategory('');
    setPrice('');
    setStock('');
    setDescription('');
    setImageFile(null);
    setImagePreview(null);
    setFieldErrors({});
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFieldErrors(prev => ({ ...prev, image: 'Please select an image file' }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }
      
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!name.trim()) {
      errors.name = 'Product name is required';
    } else if (name.length < 3) {
      errors.name = 'Product name must be at least 3 characters';
    }
    
    if (!category.trim()) {
      errors.category = 'Category is required';
    }
    
    if (!price) {
      errors.price = 'Price is required';
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    
    if (stock && (isNaN(parseInt(stock)) || parseInt(stock) < 0)) {
      errors.stock = 'Stock must be a non-negative number';
    }
    
    if (!description.trim()) {
      errors.description = 'Description is required';
    } else if (description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const uploadImage = async (file: File, productName: string): Promise<string | null> => {
    if (!file) return null;
    
    setUploading(true);
    
    try {
      // Generate a unique filename
      const fileExtension = file.name.split('.').pop() || 'png';
      const fileName = `${productName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${fileExtension}`;
      
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
      return `${supabaseUrl}/storage/v1/object/public/products/${fileName}`;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      let imageUrl = '/placeholder.svg';
      
      // Upload image if provided
      if (imageFile && name) {
        const uploadedImageUrl = await uploadImage(imageFile, name);
        if (!uploadedImageUrl) {
          throw new Error('Image upload failed');
        }
        imageUrl = uploadedImageUrl;
      }

      // Prepare data according to schema
      const productData = {
        name,
        category: category || null,
        price: parseFloat(price),
        stock_quantity: stock ? parseInt(stock) : 0,
        description,
        image_url: imageUrl,
        is_featured: false, // Default value
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const newProduct = await response.json();
      
      // Reset form
      resetForm();
      
      // Close the dialog and refresh the data
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="product-name">Product Name</Label>
          <Input 
            id="product-name" 
            placeholder="e.g., Volta-Charge 100W PD Station" 
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (fieldErrors.name) {
                setFieldErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.name;
                  return newErrors;
                });
              }
            }}
            className={fieldErrors.name ? 'border-red-500' : ''}
            required
          />
          {fieldErrors.name && <p className="text-sm text-red-500">{fieldErrors.name}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="product-category">Category</Label>
          <Input 
            id="product-category" 
            placeholder="e.g., Chargers" 
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (fieldErrors.category) {
                setFieldErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.category;
                  return newErrors;
                });
              }
            }}
            className={fieldErrors.category ? 'border-red-500' : ''}
          />
          {fieldErrors.category && <p className="text-sm text-red-500">{fieldErrors.category}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="product-price">Price (Ksh)</Label>
            <Input 
              id="product-price" 
              type="number" 
              placeholder="e.g., 8000" 
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (fieldErrors.price) {
                  setFieldErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.price;
                    return newErrors;
                  });
                }
              }}
              className={fieldErrors.price ? 'border-red-500' : ''}
              required
            />
            {fieldErrors.price && <p className="text-sm text-red-500">{fieldErrors.price}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="product-stock">Stock Quantity</Label>
            <Input 
              id="product-stock" 
              type="number" 
              placeholder="e.g., 50" 
              value={stock}
              onChange={(e) => {
                setStock(e.target.value);
                if (fieldErrors.stock) {
                  setFieldErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.stock;
                    return newErrors;
                  });
                }
              }}
              className={fieldErrors.stock ? 'border-red-500' : ''}
            />
            {fieldErrors.stock && <p className="text-sm text-red-500">{fieldErrors.stock}</p>}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="product-description">Description</Label>
          <Textarea 
            id="product-description" 
            placeholder="Describe the product..." 
            className={`min-h-[100px] ${fieldErrors.description ? 'border-red-500' : ''}`}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (fieldErrors.description) {
                setFieldErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.description;
                  return newErrors;
                });
              }
            }}
            required
          />
          {fieldErrors.description && <p className="text-sm text-red-500">{fieldErrors.description}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="product-image">Product Image</Label>
          <Input 
            id="product-image" 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
            className={fieldErrors.image ? 'border-red-500' : ''}
          />
          {imagePreview && (
            <div className="mt-2">
              <Image 
                src={imagePreview} 
                alt="Preview" 
                width={100} 
                height={100} 
                className="object-cover rounded-md"
              />
            </div>
          )}
          {fieldErrors.image && <p className="text-sm text-red-500">{fieldErrors.image}</p>}
          {uploading && <p className="text-sm text-muted-foreground">Uploading image...</p>}
        </div>
        {error && <div className="text-sm text-destructive text-center">{error}</div>}
        <Button type="submit" disabled={loading || uploading}>
          {loading || uploading ? 'Creating...' : 'Add New Product'}
        </Button>
      </div>
    </form>
  );
}

function AddSecondHandItemForm() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('Like New');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Reset form function
  const resetForm = () => {
    setName('');
    setCategory('');
    setCondition('Like New');
    setPrice('');
    setDescription('');
    setSellerName('');
    setImageFile(null);
    setImagePreview(null);
    setFieldErrors({});
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFieldErrors(prev => ({ ...prev, image: 'Please select an image file' }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }
      
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!name.trim()) {
      errors.name = 'Item name is required';
    } else if (name.length < 3) {
      errors.name = 'Item name must be at least 3 characters';
    }
    
    if (!category.trim()) {
      errors.category = 'Category is required';
    }
    
    if (!price) {
      errors.price = 'Price is required';
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    
    if (!description.trim()) {
      errors.description = 'Description is required';
    } else if (description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    if (!sellerName.trim()) {
      errors.sellerName = 'Seller name is required';
    } else if (sellerName.length < 2) {
      errors.sellerName = 'Seller name must be at least 2 characters';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const uploadImage = async (file: File, productName: string): Promise<string | null> => {
    if (!file) return null;
    
    setUploading(true);
    
    try {
      // Generate a unique filename
      const fileExtension = file.name.split('.').pop() || 'png';
      const fileName = `${productName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${fileExtension}`;
      
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
      return `${supabaseUrl}/storage/v1/object/public/products/${fileName}`;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      let imageUrl = '/placeholder.svg';
      
      // Upload image if provided
      if (imageFile && name) {
        const uploadedImageUrl = await uploadImage(imageFile, name);
        if (!uploadedImageUrl) {
          throw new Error('Image upload failed');
        }
        imageUrl = uploadedImageUrl;
      }

      // First, create a regular product
      const productData = {
        name,
        category: category || null,
        price: parseFloat(price),
        stock_quantity: 1, // Marketplace items typically have quantity of 1
        description,
        image_url: imageUrl,
        is_featured: false, // Default value
      };

      const productResponse = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!productResponse.ok) {
        const errorData = await productResponse.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const newProduct = await productResponse.json();
      
      // Then, create a marketplace product entry that references this product
      const marketplaceData = {
        product_id: newProduct.id,
        condition,
        seller_name: sellerName,
      };

      const marketplaceResponse = await fetch('/api/second-hand-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(marketplaceData),
      });

      if (!marketplaceResponse.ok) {
        const errorData = await marketplaceResponse.json();
        throw new Error(errorData.error || 'Failed to create marketplace product entry');
      }

      // Reset form
      resetForm();
      
      // Close the dialog and refresh the data
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="marketplace-item-name">Item Name</Label>
          <Input 
            id="marketplace-item-name" 
            placeholder="e.g., iPhone 12 Pro Max" 
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (fieldErrors.name) {
                setFieldErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.name;
                  return newErrors;
                });
              }
            }}
            className={fieldErrors.name ? 'border-red-500' : ''}
            required
          />
          {fieldErrors.name && <p className="text-sm text-red-500">{fieldErrors.name}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="marketplace-item-category">Category</Label>
          <Input 
            id="marketplace-item-category" 
            placeholder="e.g., Smartphones" 
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (fieldErrors.category) {
                setFieldErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.category;
                  return newErrors;
                });
              }
            }}
            className={fieldErrors.category ? 'border-red-500' : ''}
          />
          {fieldErrors.category && <p className="text-sm text-red-500">{fieldErrors.category}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="marketplace-item-condition">Condition</Label>
            <select
              id="marketplace-item-condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value as any)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="marketplace-item-price">Price (Ksh)</Label>
            <Input 
              id="marketplace-item-price" 
              type="number" 
              placeholder="e.g., 45000" 
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (fieldErrors.price) {
                  setFieldErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.price;
                    return newErrors;
                  });
                }
              }}
              className={fieldErrors.price ? 'border-red-500' : ''}
              required
            />
            {fieldErrors.price && <p className="text-sm text-red-500">{fieldErrors.price}</p>}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="marketplace-item-description">Description</Label>
          <Textarea 
            id="marketplace-item-description" 
            placeholder="Describe the item's condition, features, etc..." 
            className={`min-h-[100px] ${fieldErrors.description ? 'border-red-500' : ''}`}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (fieldErrors.description) {
                setFieldErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.description;
                  return newErrors;
                });
              }
            }}
            required
          />
          {fieldErrors.description && <p className="text-sm text-red-500">{fieldErrors.description}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="marketplace-seller-name">Seller Name</Label>
          <Input 
            id="marketplace-seller-name" 
            placeholder="e.g., John Doe" 
            value={sellerName}
            onChange={(e) => {
              setSellerName(e.target.value);
              if (fieldErrors.sellerName) {
                setFieldErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.sellerName;
                  return newErrors;
                });
              }
            }}
            className={fieldErrors.sellerName ? 'border-red-500' : ''}
            required
          />
          {fieldErrors.sellerName && <p className="text-sm text-red-500">{fieldErrors.sellerName}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="marketplace-item-image">Item Image</Label>
          <Input 
            id="marketplace-item-image" 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
            className={fieldErrors.image ? 'border-red-500' : ''}
          />
          {imagePreview && (
            <div className="mt-2">
              <Image 
                src={imagePreview} 
                alt="Preview" 
                width={100} 
                height={100} 
                className="object-cover rounded-md"
              />
            </div>
          )}
          {fieldErrors.image && <p className="text-sm text-red-500">{fieldErrors.image}</p>}
          {uploading && <p className="text-sm text-muted-foreground">Uploading image...</p>}
        </div>
        {error && <div className="text-sm text-destructive text-center">{error}</div>}
        <Button type="submit" disabled={loading || uploading}>
          {loading || uploading ? 'Creating...' : 'Add Marketplace Product'}
        </Button>
      </div>
    </form>
  );
}

function ProductImage({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
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

  // If we have an error, show a simple fallback
  if (hasError) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-md">
        <div className="text-center">
          <div className="text-gray-400">Image not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-square overflow-hidden bg-muted rounded-md">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        onError={handleError}
        onLoad={handleLoad}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}
