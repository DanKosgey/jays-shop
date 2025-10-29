import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Search, Phone, Mail } from "lucide-react";
import { secondHandProductsDb } from "@/lib/db/secondhand_products";
import { SecondHandProduct } from "@/lib/db/secondhand_products";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<SecondHandProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await secondHandProductsDb.getAll();
      setProducts(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching second-hand products:", err);
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
      const data = await secondHandProductsDb.search(term);
      setProducts(data || []);
      setError(null);
    } catch (err) {
      console.error("Error searching products:", err);
      setError("Failed to search products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
            <p className="text-muted-foreground">Buy and sell quality second-hand devices</p>
          </div>
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
            <p className="text-muted-foreground">Buy and sell quality second-hand devices</p>
          </div>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground">Buy and sell quality second-hand devices</p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search marketplace..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="Like New">Like New</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Marketplace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-square bg-muted rounded-md mb-4 flex items-center justify-center text-6xl">
                  {product.products?.image_url ? (
                    <img 
                      src={product.products.image_url} 
                      alt={product.products.name} 
                      className="h-full w-full object-cover rounded-md"
                    />
                  ) : (
                    <Smartphone className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{product.products?.name || "Unknown Product"}</CardTitle>
                  <Badge 
                    variant={
                      product.condition === "Like New" ? "default" :
                      product.condition === "Good" ? "secondary" : "outline"
                    }
                  >
                    {product.condition}
                  </Badge>
                </div>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {product.price ? `KSh ${product.price.toLocaleString()}` : "Price not set"}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">{product.seller_name}</div>
                      <div className="text-muted-foreground">Seller</div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    {product.seller_phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{product.seller_phone}</span>
                      </div>
                    )}
                    {product.seller_email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{product.seller_email}</span>
                      </div>
                    )}
                  </div>

                  <Button className="w-full">Contact Seller</Button>
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

export default Marketplace;