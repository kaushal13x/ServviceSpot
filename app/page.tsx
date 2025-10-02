'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { MapPin, Search, Star, Clock } from 'lucide-react';
import { PageNavigation } from '@/components/page-navigation';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const router = useRouter();
  const { user, isShopkeeper } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-30" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/6 w-80 h-80 bg-neon-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-neon-green/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="w-8 h-8 text-neon-cyan" />
            <h1 className="text-2xl font-orbitron font-bold neon-text-cyan">ServiceSpot</h1>
          </div>
            <Button
              onClick={() => {
                if (user) {
                  router.push(isShopkeeper ? '/dashboard' : '/explore');
                } else {
                  router.push('/auth');
                }
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-rajdhani font-semibold shadow-neon-cyan transition-all hover:shadow-neon-blue"
            >
              {user ? (isShopkeeper ? 'Go to Dashboard' : 'Explore Shops') : 'Get Started'}
            </Button>
        </nav>

        <main className="container mx-auto px-4 py-20">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-orbitron font-black mb-6 animate-glitch">
              <span className="gradient-text">ServiceSpot</span>
            </h1>

            <p className="text-xl md:text-2xl lg:text-3xl text-neon-cyan font-rajdhani font-medium mb-8 animate-glow">
              Connecting you with nearby shops
            </p>

            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-poppins leading-relaxed">
              Discover local tailors, tea stalls, stationery stores, and more.
              Find the hidden gems in your neighborhood that aren&apos;t on the map yet.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Button
                onClick={() => {
                  if (user) {
                    router.push('/explore');
                  } else {
                    router.push('/auth');
                  }
                }}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-rajdhani font-bold text-lg px-8 py-6 shadow-neon-cyan transition-all hover:shadow-neon-blue hover:scale-105"
              >
                <Search className="w-5 h-5 mr-2" />
                {user ? 'Browse Shops' : 'Find Shops Near You'}
              </Button>
              <Button
                onClick={() => {
                  if (user && isShopkeeper) {
                    router.push('/dashboard');
                  } else {
                    router.push('/auth');
                  }
                }}
                size="lg"
                variant="outline"
                className="glass-effect border-2 border-primary/50 hover:border-primary font-rajdhani font-bold text-lg px-8 py-6 transition-all hover:shadow-neon-cyan hover:scale-105"
              >
                <MapPin className="w-5 h-5 mr-2" />
                {user && isShopkeeper ? 'Manage Your Shop' : 'List Your Shop'}
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-20">
              <div className="glass-effect p-6 rounded-xl border border-primary/20 glass-hover">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-neon-cyan" />
                </div>
                <h3 className="text-xl font-orbitron font-bold mb-2">GPS Location</h3>
                <p className="text-muted-foreground font-poppins">
                  Automatic geolocation to find shops nearest to you with precise distance calculations
                </p>
              </div>

              <div className="glass-effect p-6 rounded-xl border border-primary/20 glass-hover">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-neon-blue" />
                </div>
                <h3 className="text-xl font-orbitron font-bold mb-2">Real-time Status</h3>
                <p className="text-muted-foreground font-poppins">
                  See which shops are open right now with live timing information
                </p>
              </div>

              <div className="glass-effect p-6 rounded-xl border border-primary/20 glass-hover">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Star className="w-8 h-8 text-neon-green" />
                </div>
                <h3 className="text-xl font-orbitron font-bold mb-2">Ratings & Reviews</h3>
                <p className="text-muted-foreground font-poppins">
                  Community-driven ratings to help you find the best local services
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p className="font-rajdhani">&copy; 2025 ServiceSpot. All rights reserved.</p>
        </footer>
      </div>
      
      <PageNavigation 
        nextPage={{
          href: user ? (isShopkeeper ? '/dashboard' : '/explore') : '/auth',
          label: user ? (isShopkeeper ? 'Dashboard' : 'Explore') : 'Get Started'
        }}
        showHome={false}
      />
    </div>
  );
}
