'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, ArrowLeft, ShoppingCart, Phone } from 'lucide-react'
import Link from 'next/link'
import { Product, SecondHandProduct } from '@/lib/types'

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | SecondHandProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(true)

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
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/shop">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
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
          
          {/* Badges for second-hand products */}
          {isSecondHand(product) && (
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
                {product.condition}
              </span>
            </div>
          )}
          
          {product.isFeatured && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground">
                Featured
              </span>
            </div>
          )}
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

          {/* Warranty Information */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-400">Warranty Information</h3>
            <p className="text-muted-foreground">
              {isSecondHand(product) 
                ? 'This second-hand product comes with a 30-day warranty.' 
                : 'This product comes with a 90-day warranty from Jay\'s Phone Repair.'}
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold font-headline mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Placeholder for related products */}
          <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 rounded-2xl">
            <div className="aspect-square bg-muted" />
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Category</p>
              <h3 className="font-semibold mb-2">Related Product</h3>
              <p className="text-xl font-bold text-accent">Ksh0.00</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 rounded-2xl">
            <div className="aspect-square bg-muted" />
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Category</p>
              <h3 className="font-semibold mb-2">Related Product</h3>
              <p className="text-xl font-bold text-accent">Ksh0.00</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 rounded-2xl">
            <div className="aspect-square bg-muted" />
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Category</p>
              <h3 className="font-semibold mb-2">Related Product</h3>
              <p className="text-xl font-bold text-accent">Ksh0.00</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}