'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, MessageCircle, Navigation, Star, Clock, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { PageNavigation } from '@/components/page-navigation';
import { useAuth } from '@/hooks/use-auth';

const mockShop = {
  id: '1',
  name: 'Ramesh Tailor Shop',
  slug: 'ramesh-tailor-shop',
  category: 'Tailor',
  phone: '+919876543210',
  whatsapp: '+919876543210',
  email: 'ramesh@tailor.com',
  address: '123 Main Street, Downtown, City - 123456',
  distance: 0.5,
  rating: 4.5,
  ratingCount: 28,
  openingTime: '09:00',
  closingTime: '20:00',
  description: 'Expert tailoring services for all occasions. Specializing in traditional and modern wear. Quality stitching and alterations with over 20 years of experience.',
  images: [
    'https://images.pexels.com/photos/7148431/pexels-photo-7148431.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3755707/pexels-photo-3755707.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/7148428/pexels-photo-7148428.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  isOpen: true,
  latitude: 28.6139,
  longitude: 77.2090,
};

const mockReviews = [
  { id: '1', userName: 'John Doe', rating: 5, comment: 'Excellent service and quality work!', date: '2 days ago' },
  { id: '2', userName: 'Jane Smith', rating: 4, comment: 'Good tailoring, reasonable prices.', date: '1 week ago' },
  { id: '3', userName: 'Mike Johnson', rating: 5, comment: 'Best tailor in the area!', date: '2 weeks ago' },
];

export default function ShopDetailPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const { user, isShopkeeper } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');

  const shop = mockShop;

  const handleCall = () => {
    window.open(`tel:${shop.phone}`, '_self');
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
  };

  const handleEmail = () => {
    window.open(`mailto:${shop.email}`, '_self');
  };

  const handleDirections = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`, '_blank');
  };

  const handleSubmitReview = () => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please login to submit a review',
        variant: 'destructive',
      });
      router.push('/auth');
      return;
    }

    if (userRating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating before submitting',
        variant: 'destructive',
      });
      return;
    }

    // Here you would save to Firebase
    toast({
      title: 'Review submitted!',
      description: 'Thank you for your feedback',
    });

    setUserRating(0);
    setUserComment('');
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 grid-background opacity-20" />

      <div className="relative z-10">
        <nav className="border-b border-primary/20 glass-effect">
          <div className="container mx-auto px-4 py-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shops
            </Button>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-effect border-2 border-primary/20 overflow-hidden animate-fade-in">
                <div className="relative h-96">
                  <Image
                    src={shop.images[selectedImage]}
                    alt={shop.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                    priority
                  />
                  <Badge
                    className={`absolute top-4 right-4 ${shop.isOpen ? 'bg-neon-green/80' : 'bg-destructive/80'} text-base px-3 py-1`}
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    {shop.isOpen ? 'Open Now' : 'Closed'}
                  </Badge>
                </div>

                <div className="p-4 grid grid-cols-4 gap-2">
                  {shop.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? 'border-primary shadow-neon-cyan' : 'border-primary/20'
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={img}
                          alt={`${shop.name} ${idx + 1}`}
                          fill
                          sizes="(max-width: 1024px) 25vw, 15vw"
                          className="object-cover"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="glass-effect border-2 border-primary/20 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-2xl font-orbitron gradient-text">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{shop.description}</p>
                </CardContent>
              </Card>

              <Card className="glass-effect border-2 border-primary/20 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-2xl font-orbitron gradient-text">Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-neon-cyan mr-2 mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">{shop.address}</p>
                  </div>

                  <div className="aspect-video rounded-lg overflow-hidden glass-effect border border-primary/20">
                    <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-neon-cyan mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Map integration placeholder</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Lat: {shop.latitude}, Lng: {shop.longitude}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleDirections}
                    className="w-full bg-primary hover:bg-primary/90 font-rajdhani font-semibold"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-effect border-2 border-primary/20 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-2xl font-orbitron gradient-text">Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="glass-effect p-4 rounded-lg border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold">{review.userName}</p>
                            <p className="text-xs text-muted-foreground">{review.date}</p>
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: review.rating }).map((_, idx) => (
                              <Star key={idx} className="w-4 h-4 text-neon-green fill-neon-green" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>

                  <div className="glass-effect p-4 rounded-lg border-2 border-primary/30">
                    <h4 className="font-orbitron font-semibold mb-3">Leave a Review</h4>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm mb-2">Your Rating</p>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setUserRating(star)}
                              className="transition-all hover:scale-110"
                            >
                              <Star
                                className={`w-8 h-8 ${
                                  star <= userRating
                                    ? 'text-neon-green fill-neon-green'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <Textarea
                        placeholder="Share your experience..."
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        className="glass-effect border-primary/30"
                        rows={3}
                      />

                      <Button
                        onClick={handleSubmitReview}
                        className="w-full bg-primary hover:bg-primary/90 font-rajdhani font-semibold"
                      >
                        Submit Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="glass-effect border-2 border-primary/20 sticky top-24 animate-fade-in">
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-primary/80">{shop.category}</Badge>
                  <CardTitle className="text-3xl font-orbitron">{shop.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-neon-green fill-neon-green" />
                      <span className="ml-1 text-2xl font-bold">{shop.rating}</span>
                    </div>
                    <span className="text-muted-foreground">({shop.ratingCount} reviews)</span>
                  </div>

                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-5 h-5 text-neon-cyan mr-2" />
                    <span className="font-semibold">{shop.distance} km away</span>
                  </div>

                  <div className="pt-3 border-t border-primary/20">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 text-neon-blue mr-2" />
                      <span className="font-semibold">Timings</span>
                    </div>
                    <p className="text-muted-foreground ml-7">
                      {shop.openingTime} - {shop.closingTime}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-primary/20 space-y-2">
                    <Button
                      onClick={handleCall}
                      className="w-full bg-primary hover:bg-primary/90 font-rajdhani font-semibold"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>

                    <Button
                      onClick={handleWhatsApp}
                      variant="outline"
                      className="w-full glass-effect border-primary/30 font-rajdhani font-semibold"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>

                    {shop.email && (
                      <Button
                        onClick={handleEmail}
                        variant="outline"
                        className="w-full glass-effect border-primary/30 font-rajdhani font-semibold"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      
      <PageNavigation 
        previousPage={{ href: '/explore', label: 'Back to Shops' }}
        nextPage={{ 
          href: user ? (isShopkeeper ? '/dashboard' : '/auth') : '/auth', 
          label: user ? (isShopkeeper ? 'Dashboard' : 'Profile') : 'Login' 
        }}
      />
    </div>
  );
}
