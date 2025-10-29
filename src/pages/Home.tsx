import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Wrench, ShoppingBag, Recycle, Clock, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { productsDb } from "@/lib/db/products";
import { Database } from "../../types/database.types";

type Product = Database['public']['Tables']['products']['Row'];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const data = await productsDb.getFeatured();
      setFeaturedProducts(data || []);
    } catch (err) {
      console.error("Error fetching featured products:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Professional Phone Repair Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Fast, reliable repairs for all your devices. Track your repair status in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/track">
                <Button size="lg" className="w-full sm:w-auto">
                  Track Your Repair
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Shop Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Wrench className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Repair Services</CardTitle>
                <CardDescription>
                  Expert repairs for phones, tablets, and laptops with warranty
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <ShoppingBag className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Quality Products</CardTitle>
                <CardDescription>
                  Genuine parts and accessories for all major brands
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Recycle className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Trade-In Program</CardTitle>
                <CardDescription>
                  Buy and sell second-hand devices in our marketplace
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Fast Turnaround</h3>
              <p className="text-muted-foreground">Most repairs completed within 24-48 hours</p>
            </div>

            <div className="text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">90-Day Warranty</h3>
              <p className="text-muted-foreground">All repairs backed by our quality guarantee</p>
            </div>

            <div className="text-center">
              <Star className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Expert Technicians</h3>
              <p className="text-muted-foreground">Certified professionals with years of experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading featured products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <Card key={product.id}>
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
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">KSh {product.price.toLocaleString()}</span>
                      <Button size="sm">Add to Cart</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {featuredProducts.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  <p>No featured products available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Track Ticket CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Check Your Repair Status</h2>
          <p className="text-lg mb-8 opacity-90">
            Enter your ticket number to see real-time updates on your repair
          </p>
          <Link to="/track">
            <Button size="lg" variant="secondary">
              Track Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;