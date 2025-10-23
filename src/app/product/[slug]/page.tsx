'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, ArrowLeft, ShoppingCart, Phone, Star, Shield, Truck, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { Product, SecondHandProduct } from '@/lib/types'

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | SecondHandProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        // First try to fetch from regular products
        let response = await fetch(`/api/products?slug=${params.slug}`)
        
        if (!response.ok) {
          // If not found, try second-hand products
          response = await fetch(`/api/second-hand-products?slug=${params.slug}`)
        }
        
        if (!response.ok) {
          throw new Error('Product not found')
        }
        
        const data = await response.json()
        const products = data.products || []
        
        if (products.length === 0) {
          throw new Error('Product not found')
        }
        
        setProduct(products[0])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchProduct()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto py-12 px-4">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return notFound()
  }

  // Type guard to check if it's a second-hand product
  const isSecondHand = (product: Product | SecondHandProduct): product is SecondHandProduct => {
    return 'condition' in product
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <Button asChild variant="ghost" className="mb-6 hover:bg-accent/10">
        <Link href="/shop">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image Gallery */}
        <div className="relative">
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted relative">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={600}
              height={600}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              priority
              onLoadingComplete={() => setImageLoading(false)}
            />
          </div>
          
          {/* Image Thumbnails */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            <div 
              className="w-20 h-20 rounded-lg overflow-hidden border-2 border-accent cursor-pointer flex-shrink-0"
              onClick={() => setSelectedImage(0)}
            >
              <Image
                src={product.imageUrl}
                alt={`${product.name} thumbnail`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Badges for second-hand products */}
          <div className="absolute top-4 left-4 flex gap-2">
            {product.isFeatured && (
              <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors bg-primary text-primary-foreground">
                Featured
              </span>
            )}
            {isSecondHand(product) && (
              <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors bg-secondary text-secondary-foreground">
                {product.condition}
              </span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <div className="mb-4">
            <span className="text-sm text-muted-foreground uppercase tracking-wider">
              {isSecondHand(product) ? 'Second Hand' : product.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-headline mb-4">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(128 reviews)</span>
          </div>

          <p className="text-4xl font-bold text-accent mb-6">
            Ksh{product.price.toFixed(2)}
          </p>

          <div className="prose max-w-none mb-8">
            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <Button size="lg" className="flex-1 max-w-xs bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 rounded-xl py-6 text-base font-semibold shadow-lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="flex-1 max-w-xs rounded-xl py-6 text-base font-semibold border-2 hover:shadow-lg transition-shadow">
              <Phone className="mr-2 h-5 w-5" />
              Contact for Purchase
            </Button>
          </div>

          {/* Product Specifications */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">Ksh{product.price.toFixed(2)}</span>
              </div>
              {isSecondHand(product) && (
                <>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Condition</span>
                    <span className="font-medium">{product.condition}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Seller</span>
                    <span className="font-medium">{product.sellerName}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Availability</span>
                <span className="font-medium text-green-500">
                  {product.stockQuantity > 0 ? 
                    `${product.stockQuantity} in stock` : 
                    'Out of stock'}
                </span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
              <Shield className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-sm font-medium">Warranty</p>
                <p className="text-xs text-muted-foreground">
                  {isSecondHand(product) ? '30 days' : '90 days'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-500/5 rounded-xl border border-green-500/20">
              <Truck className="h-6 w-6 text-green-400" />
              <div>
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over Ksh500</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-500/5 rounded-xl border border-purple-500/20">
              <RotateCcw className="h-6 w-6 text-purple-400" />
              <div>
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day return policy</p>
              </div>
            </div>
          </div>

          {/* Warranty Information */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-400 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Warranty Information
            </h3>
            <p className="text-muted-foreground">
              {isSecondHand(product) 
                ? 'This second-hand product comes with a 30-day warranty covering manufacturing defects.' 
                : 'This product comes with a 90-day warranty from Jay\'s Phone Repair covering manufacturing defects and workmanship.'}
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold font-headline mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Placeholder for related products */}
          {[1, 2, 3].map((item) => (
            <Card key={item} className="overflow-hidden group hover:shadow-xl transition-all duration-300 rounded-2xl border-border/50">
              <div className="aspect-square bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              </div>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Category</p>
                <h3 className="font-semibold mb-2">Related Product</h3>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-accent">Ksh0.00</p>
                  <Button size="sm" variant="outline">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}