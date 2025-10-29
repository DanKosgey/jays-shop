import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { productsDb } from "@/lib/db/products";
import { Database } from "../../../types/database.types";

type Product = Database['public']['Tables']['products']['Row'];

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock_quantity: "",
    description: "",
    is_featured: false,
    image_url: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsDb.getAll();
      setProducts(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      fetchProducts();
      return;
    }
    
    try {
      setLoading(true);
      const data = await productsDb.search(term);
      setProducts(data || []);
      setError(null);
    } catch (err) {
      console.error("Error searching products:", err);
      setError("Failed to search products");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category || "",
      price: product.price.toString(),
      stock_quantity: product.stock_quantity?.toString() || "",
      description: product.description,
      is_featured: product.is_featured,
      image_url: product.image_url,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await productsDb.delete(id);
      setProducts(products.filter(p => p.id !== id));
      toast({
        title: "Product Deleted",
        description: "Product has been removed successfully.",
      });
    } catch (err) {
      console.error("Error deleting product:", err);
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingProduct) {
        // Update existing product
        const updatedProduct = await productsDb.update(editingProduct.id, {
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : null,
          description: formData.description,
          is_featured: formData.is_featured,
          image_url: formData.image_url,
        });
        
        setProducts(products.map(p => 
          p.id === editingProduct.id ? updatedProduct : p
        ));
        
        toast({
          title: "Product Updated",
          description: "Product has been updated successfully.",
        });
      } else {
        // Create new product
        const newProduct = await productsDb.create({
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : null,
          description: formData.description,
          is_featured: formData.is_featured,
          image_url: formData.image_url,
        });
        
        setProducts([...products, newProduct]);
        
        toast({
          title: "Product Added",
          description: "New product has been added successfully.",
        });
      }
      
      setIsDialogOpen(false);
      setEditingProduct(null);
      setFormData({ 
        name: "", 
        category: "", 
        price: "", 
        stock_quantity: "", 
        description: "", 
        is_featured: false,
        image_url: ""
      });
    } catch (err) {
      console.error("Error saving product:", err);
      toast({
        title: "Error",
        description: "Failed to save product.",
        variant: "destructive",
      });
    }
  };

  const getStockBadge = (stock: number | null) => {
    if (stock === null || stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock < 10) return <Badge variant="outline" className="border-warning text-warning">Low Stock</Badge>;
    return <Badge variant="outline" className="border-success text-success">In Stock</Badge>;
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Button size="lg" disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
        <Card>
          <CardContent className="flex justify-center items-center h-32">
            <p>Loading products...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Button size="lg" onClick={fetchProducts}>
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="flex justify-center items-center h-32">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" onClick={() => {
              setEditingProduct(null);
              setFormData({ 
                name: "", 
                category: "", 
                price: "", 
                stock_quantity: "", 
                description: "", 
                is_featured: false,
                image_url: ""
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Update product information" : "Add a new product to your inventory"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Cases, Chargers"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (KSh)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Stock Quantity</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="Enter image URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="featured" className="cursor-pointer">Featured Product</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>{editingProduct ? "Update" : "Add"} Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name} 
                              className="h-10 w-10 object-cover rounded"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          {product.is_featured && (
                            <Badge variant="secondary" className="mt-1">Featured</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>KSh {product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.stock_quantity !== null ? product.stock_quantity : "N/A"}</TableCell>
                    <TableCell>{getStockBadge(product.stock_quantity)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProducts;