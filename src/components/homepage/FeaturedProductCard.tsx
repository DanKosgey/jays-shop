"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone } from "lucide-react"
import Image from "next/image"
import { useCartStore } from "@/stores/cart-store"
import { useToast } from "@/hooks/use-toast"
import { Database } from "../../../types/database.types"

type Product = Database['public']['Tables']['products']['Row']

export function FeaturedProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      image: product.image_url
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="aspect-square bg-muted rounded-md mb-4 flex items-center justify-center">
          {product.image_url && product.image_url.startsWith('http') ? (
            <Image 
              src={product.image_url} 
              alt={product.name} 
              width={300}
              height={300}
              className="h-full w-full object-cover rounded-md"
              unoptimized
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
          <span className="text-2xl font-bold text-primary">KSh {product.price?.toLocaleString()}</span>
          <Button size="sm" onClick={handleAddToCart}>Add to Cart</Button>
        </div>
      </CardContent>
    </Card>
  );
}