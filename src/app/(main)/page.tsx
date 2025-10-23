'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Search, Smartphone, Wrench, Cpu, Shield, Zap, ChevronRight, 
  Sparkles, Star, Clock, Award, CheckCircle, Wifi, Battery, Signal
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
  const [phoneIcons, setPhoneIcons] = useState<Array<{id: number, style: React.CSSProperties}>>([]);
  const [binaryRain, setBinaryRain] = useState<Array<{id: number, style: React.CSSProperties, content: string}>>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initialize ticket number from URL
  useEffect(() => {
    const ticket = searchParams.get('ticketNumber');
    if (ticket) {
      setTicketNumber(ticket);
    }
  }, [searchParams]);

  // Generate random phone icons only on client side to prevent hydration errors
  useEffect(() => {
    const icons = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      style: {
        width: `${Math.random() * 80 + 40}px`,
        height: `${Math.random() * 80 + 40}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${i * -2}s`,
        animationDuration: `${Math.random() * 20 + 15}s`,
        transform: `rotate(${Math.random() * 360}deg)`,
      }
    }));
    setPhoneIcons(icons);
  }, []);

  // Generate binary rain only on client side to prevent hydration errors
  useEffect(() => {
    const rain = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      style: {
        left: `${i * 5}%`,
        animationDelay: `${i * -0.5}s`,
        animationDuration: `${Math.random() * 5 + 5}s`,
      },
      content: Array.from({ length: 30 }, () => Math.random() > 0.5 ? '1' : '0').join(' ')
    }));
    setBinaryRain(rain);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white overflow-hidden relative">
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

      {/* Animated Phone Icons Background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {phoneIcons.map((icon) => (
          <Smartphone
            key={icon.id}
            className="absolute text-blue-400/20 animate-float-phone"
            style={icon.style}
          />
        ))}
      </div>

      {/* Animated Circuit Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#3B82F6" className="animate-pulse" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="#3B82F6" strokeWidth="1" className="animate-pulse" />
              <line x1="50" y1="50" x2="50" y2="100" stroke="#3B82F6" strokeWidth="1" className="animate-pulse" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Floating Tech Icons */}
      <div className="absolute inset-0 overflow-hidden">
        {[
          { Icon: Wifi, delay: 0, duration: 12, x: 10, y: 20 },
          { Icon: Battery, delay: 2, duration: 15, x: 80, y: 30 },
          { Icon: Signal, delay: 4, duration: 18, x: 20, y: 70 },
          { Icon: Zap, delay: 6, duration: 14, x: 85, y: 60 },
          { Icon: Shield, delay: 8, duration: 16, x: 50, y: 15 },
          { Icon: Wrench, delay: 10, duration: 13, x: 70, y: 80 },
        ].map((item, i) => {
          const Icon = item.Icon;
          return (
            <Icon
              key={i}
              className="absolute text-blue-400/30 animate-float-tech"
              style={{
                width: '60px',
                height: '60px',
                left: `${item.x}%`,
                top: `${item.y}%`,
                animationDelay: `${item.delay}s`,
                animationDuration: `${item.duration}s`,
              }}
            />
          );
        })}
      </div>

      {/* Animated Binary Code Rain */}
      <div className="absolute inset-0 overflow-hidden opacity-10 font-mono text-xs text-blue-400">
        {binaryRain.map((item) => (
          <div
            key={item.id}
            className="absolute animate-binary-rain"
            style={item.style}
          >
            {item.content}
          </div>
        ))}
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
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500/5 backdrop-blur-xl rounded-full border border-blue-400/20 animate-slide-down">
            <Sparkles className="w-4 h-4 text-blue-400 animate-spin-slow" />
            <span className="text-sm font-medium">Expert Technicians • Same-Day Service</span>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 animate-fade-scale">
            <span className="block mb-2 text-white drop-shadow-2xl">Premium Phone Repair</span>
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent animate-shimmer" style={{backgroundSize: '200% 100%'}}>
              Done Right the First Time
            </span>
          </h1>

          {/* Subheading */}
          <div className="flex items-center justify-center space-x-3 text-blue-400 animate-fade-in-up mb-8">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-400" />
            <Zap className="w-6 h-6 animate-bounce" />
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-blue-400" />
          </div>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up font-light">
            Fast, reliable, and affordable phone repair services with a <span className="text-blue-400 font-semibold">90-day warranty</span>. 
            Get your device back in perfect condition in under <span className="text-blue-400 font-semibold">60 minutes</span>.
          </p>

          {/* Search form */}
          <div className="max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <form onSubmit={handleTrackSubmit} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex flex-col sm:flex-row gap-3 bg-gradient-to-br from-white/3 to-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/5 hover:border-blue-400/30">
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
                  className="group relative px-10 py-5 bg-gradient-to-r from-blue-600/90 via-blue-500/90 to-cyan-500/90 backdrop-blur-sm rounded-2xl text-lg font-bold overflow-hidden shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-500 hover:scale-105 border border-blue-400/20"
                  disabled={!ticketNumber.trim()}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative flex items-center space-x-2">
                    <span>Track Repair</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            </form>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button asChild className="group relative px-10 py-5 bg-gradient-to-r from-blue-600/90 via-blue-500/90 to-cyan-500/90 backdrop-blur-sm rounded-2xl text-lg font-bold overflow-hidden shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-500 hover:scale-105 border border-blue-400/20">
              <Link href="/shop" className="flex items-center gap-2">
                <span>Shop Accessories</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild className="px-10 py-5 bg-white/3 backdrop-blur-xl rounded-2xl text-lg font-semibold border-2 border-blue-400/20 hover:bg-white/5 hover:border-blue-400/40 transition-all hover:scale-105 duration-300">
              <Link href="/marketplace" className="flex items-center gap-2">
                Secondhand Products
                <ChevronRight className="w-5 h-5 ml-2" />
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
                className={`group relative p-8 bg-gradient-to-br from-white/3 to-white/5 backdrop-blur-xl rounded-3xl border border-white/5 hover:border-blue-400/30 transition-all duration-500 hover:scale-110 hover:-translate-y-2 animate-fade-in-up ${
                  isVisible(`stat-${index}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 0.15}s` } as React.CSSProperties}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative flex flex-col items-center">
                  <div className="flex items-center justify-center mb-4 text-blue-400">
                    {stat.icon}
                  </div>
                  <div className="text-5xl font-black mb-2 bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
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
            <h2 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              How Our Repair Process Works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Simple, transparent, and efficient process to get your device back in perfect condition
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div
                key={`step-${index}`}
                id={`step-${index}`}
                data-animate
                className={`group relative p-10 bg-gradient-to-br from-white/3 to-white/5 backdrop-blur-xl rounded-3xl border border-white/5 hover:border-blue-400/30 transition-all duration-700 hover:scale-105 hover:-translate-y-3 cursor-pointer animate-fade-in-up ${
                  isVisible(`step-${index}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 0.2}s` } as React.CSSProperties}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-700 backdrop-blur-sm`} />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700" />
                
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-blue-500/30 border border-blue-400/20`}>
                    {step.icon}
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  <div className="mt-6 flex items-center text-blue-400 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-2">
                    <span>Learn More</span>
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </div>
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
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500/5 backdrop-blur-xl rounded-full border border-blue-400/20 animate-slide-down mb-4">
              <Sparkles className="w-4 h-4 text-blue-400 animate-spin-slow" />
              <span className="text-sm font-medium">Premium Upgrades</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-500 bg-clip-text text-transparent">
              Device Enhancements
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Upgrade your hardware with our curated selection of high-performance accessories
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-400">Loading products...</p>
              </div>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  id={`product-${index}`}
                  data-animate
                  className={`group relative rounded-3xl transition-all duration-500 hover:scale-105 animate-fade-in-up ${
                    isVisible(`product-${index}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 0.1}s` } as React.CSSProperties}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
                  <Card className="relative bg-gradient-to-br from-white/3 to-white/5 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden h-full group-hover:border-purple-400/30 transition-all">
                    <CardHeader className="p-0">
                      <div className="aspect-square overflow-hidden bg-slate-900 rounded-t-3xl">
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
                      <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl">
                        <Link href={`/product/${product.slug}`}>View Enhancement</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-400">No featured products available</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="group relative px-10 py-5 bg-gradient-to-r from-blue-600/90 via-blue-500/90 to-cyan-500/90 backdrop-blur-sm rounded-2xl text-lg font-bold overflow-hidden shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-500 hover:scale-105 border border-blue-400/20">
              <Link href="/shop" className="flex items-center gap-2">
                <span>Browse All Products</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-500 bg-clip-text text-transparent">
              Why Choose Jay's Phone Repair?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Experience the future of device repair with our cutting-edge services
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((feature, index) => (
              <div
                key={`feature-${index}`}
                id={`feature-${index}`}
                data-animate
                className={`group relative p-8 bg-gradient-to-br from-white/3 to-white/5 backdrop-blur-xl rounded-3xl border border-white/5 hover:border-blue-400/30 transition-all duration-500 hover:scale-105 animate-fade-in-up ${
                  isVisible(`feature-${index}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` } as React.CSSProperties}
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl blur opacity-0 group-hover:opacity-25 transition duration-500`} />
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-blue-500/30 border border-blue-400/20`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
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
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Jay's for their device repair and enhancement needs
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Button asChild size="lg" className="group relative px-10 py-5 bg-gradient-to-r from-blue-600/90 via-blue-500/90 to-cyan-500/90 backdrop-blur-sm rounded-2xl text-lg font-bold overflow-hidden shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-500 hover:scale-105 border border-blue-400/20">
              <Link href="/shop" className="flex items-center gap-2">
                <span>Shop Now</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" className="px-10 py-5 bg-white/3 backdrop-blur-xl rounded-2xl text-lg font-semibold border-2 border-blue-400/20 hover:bg-white/5 hover:border-blue-400/40 transition-all hover:scale-105 duration-300">
              <Link href="/track" className="flex items-center gap-2">
                Track Repair
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes float-phone {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
          25% { transform: translate(50px, -50px) rotate(10deg); opacity: 0.5; }
          50% { transform: translate(-30px, 30px) rotate(-5deg); opacity: 0.4; }
          75% { transform: translate(40px, 20px) rotate(15deg); opacity: 0.6; }
        }
        @keyframes float-tech {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-40px) rotate(180deg) scale(1.2); }
        }
        @keyframes binary-rain {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fade-scale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        .animate-float-phone { animation: float-phone 20s ease-in-out infinite; }
        .animate-float-tech { animation: float-tech 15s ease-in-out infinite; }
        .animate-binary-rain { animation: binary-rain 8s linear infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
        .animate-fade-scale { animation: fade-scale 0.8s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-slide-down { animation: slide-down 0.6s ease-out; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}