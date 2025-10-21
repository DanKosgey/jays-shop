'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Search, Smartphone, Wrench, Cpu, Shield, Zap, ChevronRight, 
  Sparkles, Star, Clock, Award, CheckCircle 
} from "lucide-react";
import { Product } from "@/lib/types";
import { useEffect, useState, Suspense, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [ticketNumber, setTicketNumber] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initialize ticket number from URL
  useEffect(() => {
    const ticket = searchParams.get('ticketNumber');
    if (ticket) {
      setTicketNumber(ticket);
    }
  }, [searchParams]);

  // Mouse tracking for gradient effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection observer for animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).id;
            setVisibleElements((prev) => new Set(prev).add(id));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  // Fetch featured products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch products');
        
        const { products } = await res.json();
        const mapped: Product[] = products.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.category,
          description: p.description,
          price: p.price,
          stockQuantity: p.stock_quantity ?? p.stock ?? 0,
          imageUrl: p.image_url,
          imageHint: 'product image',
          isFeatured: p.is_featured ?? false,
        }));
        
        setFeaturedProducts(mapped.filter((p) => p.isFeatured).slice(0, 3));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handlers
  const handleTrackSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ticketNumber.trim()) {
      router.push(`/track?ticketNumber=${encodeURIComponent(ticketNumber)}`);
    }
  }, [ticketNumber, router]);

  // Content data - memoized to prevent unnecessary re-renders
  const howItWorksSteps = useMemo(() => [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Book Your Repair",
      description: "Choose your device and issue. Get an instant quote with no hidden fees.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Diagnosis",
      description: "Our experts diagnose your device within 30 minutes of arrival.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Quality Repair",
      description: "Premium parts, expert care, and thorough testing before return.",
      color: "from-orange-500 to-red-500"
    }
  ], []);

  const whyChooseUs = useMemo(() => [
    {
      icon: <Shield className="w-7 h-7" />,
      title: "90-Day Warranty",
      description: "All repairs backed by our comprehensive warranty for your peace of mind.",
      gradient: "from-emerald-400 to-teal-600"
    },
    {
      icon: <Clock className="w-7 h-7" />,
      title: "24-Hour Service",
      description: "Most repairs completed within 24 hours. Same-day service available.",
      gradient: "from-blue-400 to-indigo-600"
    },
    {
      icon: <Award className="w-7 h-7" />,
      title: "Certified Experts",
      description: "Factory-trained technicians with years of experience and expertise.",
      gradient: "from-purple-400 to-pink-600"
    },
    {
      icon: <Star className="w-7 h-7" />,
      title: "Premium Parts",
      description: "Only genuine and highest quality replacement parts used in every repair.",
      gradient: "from-amber-400 to-orange-600"
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: "Free Diagnostics",
      description: "Complete device inspection at no cost. Know exactly what's wrong first.",
      gradient: "from-rose-400 to-red-600"
    },
    {
      icon: <CheckCircle className="w-7 h-7" />,
      title: "Price Match",
      description: "We'll match any competitor's price. Best value guaranteed.",
      gradient: "from-cyan-400 to-blue-600"
    }
  ], []);

  const stats = useMemo(() => [
    { value: "10K+", label: "Devices Repaired", icon: <Smartphone className="w-5 h-5" /> },
    { value: "98%", label: "Customer Satisfaction", icon: <Star className="w-5 h-5" /> },
    { value: "24h", label: "Average Turnaround", icon: <Clock className="w-5 h-5" /> },
    { value: "50+", label: "Expert Technicians", icon: <Award className="w-5 h-5" /> }
  ], []);

  const isVisible = useCallback((id: string) => visibleElements.has(id), [visibleElements]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Mouse follower gradient */}
      <div 
        className="fixed pointer-events-none opacity-30 blur-3xl transition-all duration-300"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
          left: `${mousePosition.x - 300}px`,
          top: `${mousePosition.y - 300}px`,
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full mb-8 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Professional Phone Repair Services
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 animate-fadeInUp">
            <span className="block mb-2">Premium Phone Repair</span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Done Right the First Time
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Fast, reliable, and affordable phone repair services with a 90-day warranty. 
            Get your device back in perfect condition.
          </p>

          {/* Search form */}
          <div className="max-w-2xl mx-auto mb-8 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <form onSubmit={handleTrackSubmit} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex flex-col sm:flex-row gap-3 bg-slate-900/90 backdrop-blur-xl rounded-2xl p-2 border border-slate-700/50">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Enter ticket number (e.g., RPR-2025-0001)"
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-slate-400 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                    aria-label="Search repair tickets"
                  />
                </div>
                <Button 
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105"
                  disabled={!ticketNumber.trim()}
                >
                  Track Repair
                </Button>
              </div>
            </form>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <Button asChild className="group px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-blue-500 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105">
              <Link href="/shop" className="flex items-center gap-2">
                Shop Accessories
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild className="group px-8 py-4 bg-transparent border border-slate-700 hover:border-purple-500 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105">
              <Link href="/marketplace" className="flex items-center gap-2">
                Secondhand Products
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-gradient-to-b from-blue-400 to-transparent rounded-full animate-scroll" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={`stat-${index}`}
                id={`stat-${index}`}
                data-animate
                className={`group relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-blue-500/50 transition-all duration-500 hover:scale-105 ${
                  isVisible(`stat-${index}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` } as React.CSSProperties}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-center justify-center mb-3 text-blue-400">
                    {stat.icon}
                  </div>
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              How Our Repair Process Works
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Simple, transparent, and efficient process to get your device back in perfect condition
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div
                key={`step-${index}`}
                id={`step-${index}`}
                data-animate
                className={`relative group p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl transition-all duration-500 hover:scale-105 ${
                  isVisible(`step-${index}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 0.2}s` } as React.CSSProperties}
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${step.color} rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500`} />
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl mb-6`}>
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-slate-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Premium Upgrades
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Device Enhancements
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Upgrade your hardware with our curated selection of high-performance accessories
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-slate-400">Loading products...</p>
              </div>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  id={`product-${index}`}
                  data-animate
                  className={`group relative rounded-2xl transition-all duration-500 hover:scale-105 ${
                    isVisible(`product-${index}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 0.1}s` } as React.CSSProperties}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500" />
                  <Card className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden h-full">
                    <CardHeader className="p-0">
                      <div className="aspect-square overflow-hidden bg-slate-900">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          priority={index < 3}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                        Ksh {product.price.toFixed(2)}
                      </p>
                      <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <Link href={`/product/${product.slug}`}>View Enhancement</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-slate-400">No featured products available</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href="/shop" className="flex items-center gap-2">
                Browse All Products
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Why Choose Jay's Phone Repair?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Experience the future of device repair with our cutting-edge services
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((feature, index) => (
              <div
                key={`feature-${index}`}
                id={`feature-${index}`}
                data-animate
                className={`group relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl transition-all duration-500 hover:scale-105 ${
                  isVisible(`feature-${index}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` } as React.CSSProperties}
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500`} />
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-8">
            <h2 className="text-4xl sm:text-5xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Ready to Upgrade Your Device?
            </h2>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20 blur-2xl" />
          </div>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Jay's for their device repair and enhancement needs
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="px-8 py-6 text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 py-6 text-lg border-cyan-500 text-cyan-400 hover:bg-cyan-500/10">
              <Link href="/track">Track Repair</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}