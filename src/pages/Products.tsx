import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, Search } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useToast } from "@/hooks/use-toast";
import { productsDb } from "@/lib/db/products";
import { Product } from "@/lib/db/products";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

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

  const handleAddToCart = (id: string, name: string, price: number) => {
    addItem({ id, name, price });
    toast({
      title: "Added to Cart",
      description: `${name} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Products</h1>
          <div className="flex justify-center items-center h-64">
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Products</h1>
          <div className="flex justify-center items-center h-64">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Products</h1>

        {/* Filters */}
        <div className="bg-card rounded-lg border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="cases">Cases</SelectItem>
                <SelectItem value="chargers">Chargers</SelectItem>
                <SelectItem value="screen-protectors">Screen Protectors</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-square bg-muted rounded-md mb-4 flex items-center justify-center">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="h-full w-full object-cover rounded-md"
                    />
                  ) : (
                    <Smartphone className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">KSh {product.price.toLocaleString()}</span>
                    <span className={`text-sm ${product.stock_quantity && product.stock_quantity > 0 ? 'text-success' : 'text-destructive'}`}>
                      {product.stock_quantity && product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => handleAddToCart(product.id, product.name, product.price)}
                    disabled={!product.stock_quantity || product.stock_quantity <= 0}
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;