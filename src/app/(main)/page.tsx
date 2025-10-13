
'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Smartphone, Wrench, ShieldCheck, Tag, ThumbsUp } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { mockProducts } from "@/lib/mock-data";
import { Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ticketNumber, setTicketNumber] = useState(searchParams.get('ticketNumber') || 'RPR-2025-0001');
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-repair');

  useEffect(() => {
    const ticketFromUrl = searchParams.get('ticketNumber');
    if (ticketFromUrl) {
      setTicketNumber(ticketFromUrl);
    }
  }, [searchParams]);

  const handleTrackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ticketNumber) {
      router.push(`/track?ticketNumber=${ticketNumber}`);
    }
  };

  const howItWorksSteps = [
    {
      icon: <Smartphone className="h-10 w-10 text-accent" />,
      title: "Submit a Ticket",
      description: "Tell us about the issue with your device and get an instant estimate.",
    },
    {
      icon: <Wrench className="h-10 w-10 text-accent" />,
      title: "Expert Repair",
      description: "Our certified technicians will diagnose and repair your device.",
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-accent" />,
      title: "Track & Collect",
      description: "Follow your repair status online and get notified when it's ready.",
    },
  ];

  const featuredProducts = mockProducts.filter(p => p.isFeatured);

  const whyChooseUs = [
      {
          icon: <ThumbsUp className="h-8 w-8 text-accent"/>,
          title: "Expert Technicians",
          description: "Our team consists of certified professionals with years of experience."
      },
      {
          icon: <Tag className="h-8 w-8 text-accent"/>,
          title: "Transparent Pricing",
          description: "Get clear, upfront estimates before any repair work begins."
      },
      {
          icon: <ShieldCheck className="h-8 w-8 text-accent"/>,
          title: "90-Day Warranty",
          description: "We stand by our work with a comprehensive 90-day warranty on all repairs."
      }
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 container max-w-4xl px-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
            Fast, Reliable Phone Repairs
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Track your repair status, get instant AI-powered help, or shop for accessories.
          </p>
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleTrackSubmit} className="flex w-full gap-2 bg-white rounded-lg p-2 shadow-lg">
              <Input
                type="text"
                placeholder="Enter your ticket number (e.g., RPR-2025-0001)"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                className="flex-grow border-0 focus-visible:ring-0 text-base"
              />
              <Button type="submit" size="lg">
                <Search className="mr-2 h-5 w-5" />
                Track Repair
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-background">
        <div className="container max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-headline font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Getting your device repaired is as easy as 1-2-3.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => (
              <Card key={index} className="text-center p-6 shadow-md hover:shadow-xl transition-shadow">
                <CardHeader className="items-center">
                  {step.icon}
                  <CardTitle className="mt-4">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-muted/40">
        <div className="container max-w-7xl px-4">
          <h2 className="text-3xl font-headline font-bold mb-4 text-center">Featured Products</h2>
          <p className="text-muted-foreground mb-12 text-center">
            Top accessories to complement your device.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product: Product) => (
              <Card key={product.id} className="overflow-hidden group">
                <CardHeader className="p-0">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={400}
                    height={400}
                    data-ai-hint={product.imageHint}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold font-headline mb-2">{product.name}</h3>
                  <p className="text-2xl font-semibold text-accent mb-4">Ksh{product.price.toFixed(2)}</p>
                  <Button asChild className="w-full">
                    <Link href={`/product/${product.slug}`}>View Product</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
            <div className="text-center mt-12">
                <Button asChild size="lg" variant="outline">
                    <Link href="/shop">Shop All Products</Link>
                </Button>
            </div>
        </div>
      </section>

       {/* Why Choose Us Section */}
      <section className="py-16 bg-background">
        <div className="container max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-headline font-bold mb-12">Why Choose Jay's phone repair shop?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUs.map((feature, index) => (
              <div key={index} className="flex flex-col items-center gap-4">
                {feature.icon}
                <h3 className="text-xl font-bold font-headline">{feature.title}</h3>
                <p className="text-muted-foreground max-w-xs">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  )
}
