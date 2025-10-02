'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { MapPin, Search, Phone, Mail, MessageCircle, Navigation, Star, Clock, Mic, Filter, Chrome as Home, LogOut, User, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { getFirebase } from '@/lib/firebase';
import { PageNavigation } from '@/components/page-navigation';
import { useLocation } from '@/hooks/use-location';

const mockShops = [
  {
    id: '1',
    name: 'Ramesh Tailor Shop',
    slug: 'ramesh-tailor-shop',
    category: 'Tailor',
    phone: '+919876543210',
    whatsapp: '+919876543210',
    email: 'ramesh@tailor.com',
    address: '123 Main Street, Downtown',
    distance: 0.5,
    rating: 4.5,
    ratingCount: 28,
    openingTime: '09:00',
    closingTime: '20:00',
    image: 'https://images.pexels.com/photos/7148431/pexels-photo-7148431.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
  },
  {
    id: '2',
    name: 'Chai Point Tea Stall',
    slug: 'chai-point-tea-stall',
    category: 'Tea Stall',
    phone: '+919876543211',
    whatsapp: '+919876543211',
    address: '456 Market Road, Central',
    distance: 1.2,
    rating: 4.8,
    ratingCount: 156,
    openingTime: '06:00',
    closingTime: '22:00',
    image: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
  },
  {
    id: '3',
    name: 'Modern Stationery',
    slug: 'modern-stationery',
    category: 'Stationery',
    phone: '+919876543212',
    email: 'info@modernstationary.com',
    address: '789 School Lane, East Side',
    distance: 2.1,
    rating: 4.2,
    ratingCount: 45,
    openingTime: '08:00',
    closingTime: '21:00',
    image: 'https://images.pexels.com/photos/4226894/pexels-photo-4226894.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
  },
  {
    id: '4',
    name: 'Sharma Betel Leaf',
    slug: 'sharma-betel-leaf',
    category: 'Betel Leaf Shop',
    phone: '+919876543213',
    whatsapp: '+919876543213',
    address: '321 Temple Street, West Area',
    distance: 0.8,
    rating: 4.0,
    ratingCount: 12,
    openingTime: '10:00',
    closingTime: '23:00',
    image: 'https://images.pexels.com/photos/6069123/pexels-photo-6069123.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: false,
  },
  // Food & Beverage / Snacks
  {
    id: '5',
    name: 'Fresh Squeeze Juice Bar',
    slug: 'fresh-squeeze-juice-bar',
    category: 'Juice Shop',
    phone: '+919812345001',
    address: '22 Park Street, South Block',
    distance: 0.9,
    rating: 4.6,
    ratingCount: 73,
    openingTime: '08:00',
    closingTime: '21:00',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
  },
  {
    id: '6',
    name: 'Chaat & Samosa Corner',
    slug: 'chaat-and-samosa-corner',
    category: 'Snack Stall',
    phone: '+919812345002',
    address: 'Near Central Plaza, Market Lane',
    distance: 1.0,
    rating: 4.7,
    ratingCount: 210,
    openingTime: '16:00',
    closingTime: '22:30',
    image: 'https://images.pexels.com/photos/5908189/pexels-photo-5908189.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
  },
  {
    id: '7',
    name: 'Sweet Tooth Bakery',
    slug: 'sweet-tooth-bakery',
    category: 'Bakery',
    phone: '+919812345003',
    address: '7 Baker Street, North End',
    distance: 2.6,
    rating: 4.3,
    ratingCount: 98,
    openingTime: '09:00',
    closingTime: '20:30',
    image: 'https://images.pexels.com/photos/1026125/pexels-photo-1026125.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
  },
  // Healthcare / Wellness
  {
    id: '8',
    name: 'City Chemist & Wellness',
    slug: 'city-chemist-and-wellness',
    category: 'Medicine Shop',
    phone: '+919812345004',
    address: '5 Hospital Road, West Wing',
    distance: 0.7,
    rating: 4.4,
    ratingCount: 65,
    openingTime: '08:00',
    closingTime: '23:00',
    image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
  },
  {
    id: '9',
    name: 'Vision Opticals',
    slug: 'vision-opticals',
    category: 'Optical Shop',
    phone: '+919812345005',
    address: '12 Lens Avenue, Midtown',
    distance: 1.4,
    rating: 4.2,
    ratingCount: 40,
    openingTime: '10:00',
    closingTime: '21:00',
    image: 'https://images.pexels.com/photos/575226/pexels-photo-575226.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
  },
  // Repair Services
  {
    id: '10',
    name: 'QuickFix Mobile Repair',
    slug: 'quickfix-mobile-repair',
    category: 'Mobile Repair',
    phone: '+919812345006',
    address: 'Shop 3, Tech Plaza, Downtown',
    distance: 0.6,
    rating: 4.5,
    ratingCount: 120,
    openingTime: '10:00',
    closingTime: '20:00',
    image: 'https://images.pexels.com/photos/6078127/pexels-photo-6078127.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
  },
  {
    id: '11',
    name: 'Master Cobbler',
    slug: 'master-cobbler',
    category: 'Shoe Repair',
    phone: '+919812345007',
    address: 'Corner Booth, Old Market',
    distance: 1.3,
    rating: 4.1,
    ratingCount: 33,
    openingTime: '10:00',
    closingTime: '19:30',
    image: 'https://images.pexels.com/photos/3640809/pexels-photo-3640809.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: false,
  },
  // Beauty & Personal Care
  {
    id: '12',
    name: 'Urban Cuts Salon',
    slug: 'urban-cuts-salon',
    category: 'Hair Salon',
    phone: '+919812345008',
    address: '114 High Street, Midtown',
    distance: 2.0,
    rating: 4.6,
    ratingCount: 180,
    openingTime: '10:00',
    closingTime: '21:00',
    image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
  },
  {
    id: '13',
    name: 'Glow Beauty Parlour',
    slug: 'glow-beauty-parlour',
    category: 'Beauty Parlour',
    phone: '+919812345009',
    address: '2 Lotus Arcade, East Side',
    distance: 1.9,
    rating: 4.3,
    ratingCount: 77,
    openingTime: '11:00',
    closingTime: '20:00',
    image: 'https://images.pexels.com/photos/3993448/pexels-photo-3993448.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
  },
  // Fashion & Clothing
  {
    id: '14',
    name: 'Budget Fashion Store',
    slug: 'budget-fashion-store',
    category: 'Clothing Shop',
    phone: '+919812345010',
    address: 'Market Square, Shop 21',
    distance: 2.8,
    rating: 4.0,
    ratingCount: 54,
    openingTime: '10:30',
    closingTime: '21:30',
    image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
  },
  // Home & Household
  {
    id: '15',
    name: 'Sharma Hardware & Tools',
    slug: 'sharma-hardware-and-tools',
    category: 'Hardware Shop',
    phone: '+919812345011',
    address: '11 Carpenter Lane, West District',
    distance: 1.1,
    rating: 4.2,
    ratingCount: 61,
    openingTime: '09:30',
    closingTime: '20:30',
    image: 'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
  },
  // Education & Books
  {
    id: '16',
    name: 'Readers Corner Bookstore',
    slug: 'readers-corner-bookstore',
    category: 'Bookstore',
    phone: '+919812345012',
    address: 'Library Road, Central',
    distance: 3.2,
    rating: 4.7,
    ratingCount: 89,
    openingTime: '10:00',
    closingTime: '20:00',
    image: 'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
  },
  // Pet & Animal Care
  {
    id: '17',
    name: 'Pet Pantry Supplies',
    slug: 'pet-pantry-supplies',
    category: 'Pet Supplies',
    phone: '+919812345013',
    address: '18 Paw Street, South Park',
    distance: 2.2,
    rating: 4.3,
    ratingCount: 47,
    openingTime: '10:00',
    closingTime: '21:00',
    image: 'https://images.pexels.com/photos/1407786/pexels-photo-1407786.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
  },
  // Gifts & Specialty Items
  {
    id: '18',
    name: 'The Gift Gallery',
    slug: 'the-gift-gallery',
    category: 'Gift Shop',
    phone: '+919812345014',
    address: 'Festival Arcade, Shop 9',
    distance: 1.7,
    rating: 4.1,
    ratingCount: 32,
    openingTime: '11:00',
    closingTime: '21:30',
    image: 'https://images.pexels.com/photos/264787/pexels-photo-264787.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
  },
  // Everyday Services
  {
    id: '19',
    name: 'Spark Clean Laundry',
    slug: 'spark-clean-laundry',
    category: 'Laundry',
    phone: '+919812345015',
    address: 'Riverside Lane, Block B',
    distance: 0.9,
    rating: 4.5,
    ratingCount: 102,
    openingTime: '08:00',
    closingTime: '21:00',
    image: 'https://images.pexels.com/photos/5591460/pexels-photo-5591460.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
  },
  // Convenience / Essentials
  {
    id: '20',
    name: 'GreenMart Grocery',
    slug: 'greenmart-grocery',
    category: 'Grocery Shop',
    phone: '+919812345016',
    address: 'Cross Road, Sector 4',
    distance: 1.5,
    rating: 4.2,
    ratingCount: 150,
    openingTime: '07:00',
    closingTime: '22:00',
    image: 'https://images.pexels.com/photos/406152/pexels-photo-406152.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOpen: true,
  },
];

export default function ExplorePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, userProfile, logout, isShopkeeper } = useAuth();
  const { location, loading: locationLoading, error: locationError, getCurrentLocation } = useLocation();
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isListening, setIsListening] = useState(false);

  // Load shops from Firebase
  useEffect(() => {
    const loadShops = async () => {
      try {
        const { db } = getFirebase();
        const shopsQuery = query(collection(db, 'shops'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(shopsQuery);
        
        const firebaseShops = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Calculate real distance if location is available
            distance: location && data.latitude && data.longitude 
              ? calculateDistance(location.latitude, location.longitude, data.latitude, data.longitude)
              : Math.random() * 5,
            rating: data.rating || (4 + Math.random()),
            ratingCount: data.ratingCount || Math.floor(Math.random() * 100) + 10,
            isOpen: data.isOpen !== undefined ? data.isOpen : Math.random() > 0.3,
            // Add mock coordinates if not present
            latitude: data.latitude || (28.6139 + (Math.random() - 0.5) * 0.1),
            longitude: data.longitude || (77.2090 + (Math.random() - 0.5) * 0.1),
          };
        });
        
        // If no Firebase shops, use mock data
        setShops(firebaseShops.length > 0 ? firebaseShops : mockShops);
      } catch (error) {
        console.error('Error loading shops:', error);
        setShops(mockShops); // Fallback to mock data
        toast({
          title: 'Using demo data',
          description: 'Connect to Firebase to see real shops',
        });
      } finally {
        setLoading(false);
      }
    };

    loadShops();
  }, [toast, location]);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number): number => {
    return (value * Math.PI) / 180;
  };

  // Show location status
  useEffect(() => {
    if (location) {
      toast({
        title: 'Location detected',
        description: `${location.address || 'Showing shops near you'}`,
      });
    } else if (locationError) {
      toast({
        title: 'Location unavailable',
        description: locationError.message,
        variant: 'destructive',
      });
    }
  }, [location, locationError, toast]);

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        toast({
          title: 'Voice search',
          description: `Searching for: ${transcript}`,
        });
      };

      recognition.start();
    } else {
      toast({
        title: 'Not supported',
        description: 'Voice search is not supported in this browser',
        variant: 'destructive',
      });
    }
  };

  const filteredShops = shops
    .filter((shop) => {
      const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          shop.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || shop.category.toLowerCase() === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      return b.rating - a.rating;
    });

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleWhatsApp = (whatsapp: string) => {
    window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  const handleDirections = (address: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 grid-background opacity-20" />

      <div className="relative z-10">
        <nav className="border-b border-primary/20 glass-effect sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-neon-cyan" />
              <h1 className="text-xl font-orbitron font-bold neon-text-cyan">ServiceSpot</h1>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{userProfile?.displayName}</span>
                    <Badge variant="outline" className="text-xs">
                      {isShopkeeper ? 'Shopkeeper' : 'User'}
                    </Badge>
                  </div>
                  {isShopkeeper && (
                    <Button
                      variant="outline"
                      onClick={() => router.push('/dashboard')}
                      className="glass-effect border-primary/30"
                    >
                      <Store className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={logout}
                    className="glass-effect border-primary/30"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/auth')}
                    className="glass-effect border-primary/30"
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/')}
                    className="glass-effect border-primary/30"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </>
              )}
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search shops, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-12 glass-effect border-primary/30 focus:border-primary h-12 text-base"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleVoiceSearch}
                  className={`absolute right-1 top-1/2 transform -translate-y-1/2 ${isListening ? 'text-neon-cyan animate-pulse' : ''}`}
                >
                  <Mic className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[180px] glass-effect border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Sort by Distance</SelectItem>
                  <SelectItem value="rating">Sort by Rating</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] glass-effect border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Array.from(new Set(shops.map((s) => s.category.toLowerCase()))).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.replace(/\b\w/g, (m: string) => m.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {location && (
                <Badge variant="outline" className="px-4 py-2 glass-effect border-neon-cyan/50">
                  <MapPin className="w-4 h-4 mr-1 text-neon-cyan" />
                  {location.address || `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`}
                </Badge>
              )}
              {locationLoading && (
                <Badge variant="outline" className="px-4 py-2 glass-effect border-yellow-500/50">
                  <MapPin className="w-4 h-4 mr-1 text-yellow-500 animate-pulse" />
                  Getting location...
                </Badge>
              )}
              {locationError && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  className="px-4 py-2 glass-effect border-red-500/50 text-red-500 hover:text-red-600"
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Retry Location
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="glass-effect border-2 border-primary/20 overflow-hidden animate-pulse">
                  <div className="h-48 bg-secondary/20" />
                  <CardContent className="pt-4 space-y-2">
                    <div className="h-6 bg-secondary/20 rounded" />
                    <div className="h-4 bg-secondary/20 rounded w-3/4" />
                    <div className="h-4 bg-secondary/20 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.map((shop) => (
              <Card
                key={shop.id}
                className="glass-effect border-2 border-primary/20 glass-hover overflow-hidden animate-fade-in cursor-pointer"
                onClick={() => router.push(`/shop/${shop.slug || shop.id}`)}
              >
                <div className="relative h-48 bg-secondary/20">
                  <Image
                    src={shop.images?.[0] || shop.image || 'https://images.pexels.com/photos/7148431/pexels-photo-7148431.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={shop.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${shop.isOpen ? 'bg-neon-green/80' : 'bg-destructive/80'}`}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {shop.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                  <Badge className="absolute top-3 left-3 bg-primary/80">
                    {shop.category}
                  </Badge>
                </div>

                <CardContent className="pt-4">
                  <h3 className="text-xl font-orbitron font-bold mb-2">{shop.name}</h3>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-neon-green fill-neon-green" />
                      <span className="ml-1 font-semibold">{shop.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({shop.ratingCount} reviews)</span>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4 mr-1 text-neon-cyan" />
                    {shop.distance} km away
                  </div>

                  <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{shop.address}</p>

                  <div className="text-sm text-muted-foreground">
                    {shop.openingTime} - {shop.closingTime}
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2 pt-0">
                  {shop.phone && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCall(shop.phone!);
                      }}
                      className="flex-1 glass-effect border-primary/30"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  )}
                  {shop.whatsapp && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsApp(shop.whatsapp!);
                      }}
                      className="flex-1 glass-effect border-primary/30"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  )}
                  {shop.email && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEmail(shop.email!);
                      }}
                      className="flex-1 glass-effect border-primary/30"
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDirections(shop.address);
                    }}
                    className="flex-1 glass-effect border-primary/30"
                  >
                    <Navigation className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
              ))}
            </div>
          )}

          {!loading && filteredShops.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground font-rajdhani">No shops found. Try adjusting your filters.</p>
            </div>
          )}
        </main>
      </div>
      
      <PageNavigation 
        previousPage={{ href: '/auth', label: 'Login' }}
        nextPage={{ 
          href: user && isShopkeeper ? '/dashboard' : '/test-firebase', 
          label: user && isShopkeeper ? 'Dashboard' : 'Test Firebase' 
        }}
      />
    </div>
  );
}
