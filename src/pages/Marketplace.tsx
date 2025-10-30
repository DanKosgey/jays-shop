"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, ShoppingCart, User, Star } from "lucide-react"
import Image from "next/image"

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  // Mock marketplace data
  const marketplaceItems = [
    {
      id: 1,
      seller: "TechGadgets Store",
      sellerRating: 4.8,
      itemName: "iPhone 12 Pro Max",
      itemDescription: "Like new, 256GB, unlocked",
      price: 85000,
      originalPrice: 120000,
      image: "/images/placeholder.png",
      condition: "Excellent"
    },
    {
      id: 2,
      seller: "MobileHub",
      sellerRating: 4.6,
      itemName: "Samsung Galaxy S21",
      itemDescription: "Good condition, 128GB, includes charger",
      price: 45000,
      originalPrice: 75000,
      image: "/images/placeholder.png",
      condition: "Good"
    },
    {
      id: 3,
      seller: "PhoneDeals Kenya",
      sellerRating: 4.9,
      itemName: "Google Pixel 6",
      itemDescription: "Brand new, 128GB, factory sealed",
      price: 65000,
      originalPrice: 85000,
      image: "/images/placeholder.png",
      condition: "New"
    }
  ]

  const filteredItems = marketplaceItems.filter(item => 
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.seller.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleContactSeller = (item: any) => {
    toast({
      title: "Contact Seller",
      description: `You can contact ${item.seller} at ${item.seller.toLowerCase().replace(/\s+/g, '')}@repairhub.com`,
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Device Marketplace</h1>
          <p className="text-muted-foreground mb-6">
            Buy and sell used electronics in our secure marketplace
          </p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <CardHeader className="p-0">
                <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                  {item.image ? (
                    <Image 
                      src={item.image} 
                      alt={item.itemName} 
                      width={300}
                      height={300}
                      className="h-full w-full object-cover rounded-t-lg"
                      unoptimized
                    />
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <CardTitle className="text-lg">{item.itemName}</CardTitle>
                    <CardDescription>{item.itemDescription}</CardDescription>
                  </div>
                  <Badge variant="secondary">{item.condition}</Badge>
                </div>
                
                <div className="flex items-center mb-3">
                  <User className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm">{item.seller}</span>
                  <div className="flex items-center ml-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm ml-1">{item.sellerRating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg text-primary">
                      KSh {item.price.toLocaleString()}
                    </div>
                    {item.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">
                        KSh {item.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={() => handleContactSeller(item)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Contact Seller
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No marketplace items found</p>
          </div>
        )}
      </div>
    </div>
  )
}