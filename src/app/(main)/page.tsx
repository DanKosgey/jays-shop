
'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Smartphone, Wrench, ShieldCheck, Cpu, Shield, Zap } from "lucide-react";
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
      title: "Initiate Repair",
      description: "Log your device's malfunction in our system to generate a service ticket.",
    },
    {
      icon: <Wrench className="h-10 w-10 text-accent" />,
      title: "Expert Technicians",
      description: "Our certified cybernetics team will diagnose and recalibrate your hardware.",
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-accent" />,
      title: "Track & Retrieve",
      description: "Monitor your repair's real-time progress and receive a notification upon completion.",
    },
  ];

  const featuredProducts = mockProducts.filter(p => p.isFeatured);

  const whyChooseUs = [
      {
          icon: <Cpu className="h-8 w-8 text-accent"/>,
          title: "Expert Technicians",
          description: "Our certified professionals are augmented with the latest diagnostic tools."
      },
      {
          icon: <Zap className="h-8 w-8 text-accent"/>,
          title: "Transparent Pricing",
          description: "Receive clear, upfront cost assessments before any system intervention."
      },
      {
          icon: <Shield className="h-8 w-8 text-accent"/>,
          title: "90-Day Warranty",
          description: "We guarantee our work with a comprehensive 90-day warranty on all repairs."
      }
  ]

  return (
    <div className="flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[550px] flex items-center justify-center text-center text-primary-foreground">
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
        <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary" />
        <div className="relative z-10 container max-w-4xl px-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-headline font-bold mb-4 tracking-wider uppercase">
            Welcome to Jay's: Your Device's Next Evolution.
          </h1>
          <p className="text-md sm:text-lg md:text-xl mb-8 text-primary-foreground/80">
            Advanced diagnostics, AI-assisted support, and premium device enhancements.
          </p>
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row w-full gap-2 bg-background/20 backdrop-blur-sm rounded-lg p-2 border border-primary-foreground/20 shadow-lg">
              <Input
                type="text"
                placeholder="Enter ticket number (e.g., RPR-2025-0001)"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                className="flex-grow border-0 focus-visible:ring-0 text-base bg-transparent text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Search className="mr-2 h-5 w-5" />
                Track Repair
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container max-w-7xl px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-headline font-bold mb-4 tracking-wide">The Repair Protocol</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our streamlined process ensures your device is back in optimal condition swiftly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => (
              <Card key={index} className="text-center p-6 bg-card/80 border-border/50 backdrop-blur-sm shadow-md hover:shadow-xl hover:border-accent transition-all duration-300">
                <CardHeader className="items-center">
                  <div className="p-4 bg-accent/10 rounded-full border-2 border-accent/30">
                    {step.icon}
                  </div>
                  <CardTitle className="mt-4 font-headline tracking-wide">{step.title}</CardTitle>
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
      <section className="py-12 md:py-20 bg-muted/20">
        <div className="container max-w-7xl px-4">
          <h2 className="text-2xl md:text-3xl font-headline font-bold mb-4 text-center tracking-wide">Device Enhancements</h2>
          <p className="text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
            Upgrade your hardware with our curated selection of high-performance accessories.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product: Product) => (
              <Card key={product.id} className="overflow-hidden group bg-card/80 border-border/50 hover:shadow-xl hover:border-accent transition-all duration-300">
                <CardHeader className="p-0">
                  <div className="aspect-square overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={400}
                      height={400}
                      data-ai-hint={product.imageHint}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold font-headline mb-2">{product.name}</h3>
                  <p className="text-2xl font-semibold text-accent mb-4">Ksh{product.price.toFixed(2)}</p>
                  <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href={`/product/${product.slug}`}>View Enhancement</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
            <div className="text-center mt-12">
                <Button asChild size="lg" variant="outline">
                    <Link href="/shop">Browse All Gear</Link>
                </Button>
            </div>
        </div>
      </section>

       {/* Why Choose Us Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container max-w-7xl px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-headline font-bold mb-12 tracking-wide">Why Jay's phone repair shop?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUs.map((feature, index) => (
              <div key={index} className="flex flex-col items-center gap-4 p-6 rounded-lg border border-transparent hover:border-accent/30 hover:bg-muted/30 transition-colors">
                <div className="p-3 bg-accent/10 rounded-full">
                 {feature.icon}
                </div>
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
