'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { MapPin, Store, Clock, Image as ImageIcon, Plus, Chrome as Home, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageNavigation } from '@/components/page-navigation';

const categories = [
  'Tailor',
  'Tea Stall',
  'Stationery',
  'Betel Leaf Shop',
  'Grocery',
  'Electronics',
  'Salon',
  'Restaurant',
  'Other',
];

export default function DashboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, userProfile, shopProfile, loading, logout, createShop, updateShop, isShopkeeper } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  // Pre-populate form if shop exists
  useEffect(() => {
    if (shopProfile) {
      setImages(shopProfile.images || []);
    }
  }, [shopProfile]);

  // Redirect if not authenticated or not a shopkeeper
  useEffect(() => {
    if (!loading && (!user || !isShopkeeper)) {
      router.push('/auth');
    }
  }, [user, isShopkeeper, loading, router]);

  // Show loading while Firebase is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user || !isShopkeeper) {
    return null;
  }

  const handleAddShop = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const shopData = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      phone: formData.get('phone') as string,
      whatsapp: (formData.get('whatsapp') as string) || undefined,
      email: (formData.get('email') as string) || undefined,
      address: formData.get('address') as string,
      openingTime: formData.get('openingTime') as string,
      closingTime: formData.get('closingTime') as string,
      description: (formData.get('description') as string) || undefined,
      images: images.length > 0 ? images : ['https://images.pexels.com/photos/7148431/pexels-photo-7148431.jpeg?auto=compress&cs=tinysrgb&w=400'],
      isActive: true,
    };

    try {
      if (shopProfile) {
        await updateShop(shopData);
        toast({
          title: 'Shop updated successfully!',
          description: `${shopData.name} has been updated.`,
        });
      } else {
        await createShop(shopData);
        toast({
          title: 'Shop added successfully!',
          description: `${shopData.name} is now live on ServiceSpot.`,
        });
      }
      
      if (!shopProfile) {
        e.currentTarget.reset();
        setImages([]);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save shop. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = () => {
    const imageUrl = prompt('Enter image URL (for demo purposes):');
    if (imageUrl) {
      setImages([...images, imageUrl]);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 grid-background opacity-20" />

      <div className="relative z-10">
        <nav className="border-b border-primary/20 glass-effect">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Store className="w-6 h-6 text-neon-cyan" />
              <h1 className="text-xl font-orbitron font-bold neon-text-cyan">Shopkeeper Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{userProfile?.displayName}</span>
                <Badge variant="outline" className="text-xs">Shopkeeper</Badge>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/explore')}
                className="glass-effect border-primary/30"
              >
                <Home className="w-4 h-4 mr-2" />
                Explore
              </Button>
              <Button
                variant="outline"
                onClick={logout}
                className="glass-effect border-primary/30"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Card className="glass-effect border-2 border-primary/20 max-w-4xl mx-auto animate-fade-in">
            <CardHeader>
              <CardTitle className="text-3xl font-orbitron gradient-text">
                {shopProfile ? 'Update Your Shop' : 'Add Your Shop'}
              </CardTitle>
              <CardDescription className="font-rajdhani text-base">
                {shopProfile 
                  ? 'Update your shop details on ServiceSpot'
                  : 'Fill in the details to list your shop on ServiceSpot'
                }
              </CardDescription>
              {shopProfile && (
                <Badge className="w-fit bg-green-500/20 text-green-700 border-green-500/30">
                  Shop Status: {shopProfile.isActive ? 'Active' : 'Inactive'}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddShop} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-rajdhani text-base">Shop Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="e.g., Ramesh Tailor Shop"
                      defaultValue={shopProfile?.name || ''}
                      className="glass-effect border-primary/30 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="font-rajdhani text-base">Category *</Label>
                    <Select name="category" required defaultValue={shopProfile?.category || ''}>
                      <SelectTrigger className="glass-effect border-primary/30">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat.toLowerCase()}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-rajdhani text-base">Phone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+1234567890"
                      defaultValue={shopProfile?.phone || ''}
                      className="glass-effect border-primary/30 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="font-rajdhani text-base">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      placeholder="+1234567890"
                      defaultValue={shopProfile?.whatsapp || ''}
                      className="glass-effect border-primary/30 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-rajdhani text-base">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="shop@email.com"
                      defaultValue={shopProfile?.email || ''}
                      className="glass-effect border-primary/30 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="font-rajdhani text-base">Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    required
                    placeholder="Enter complete address"
                    defaultValue={shopProfile?.address || ''}
                    className="glass-effect border-primary/30 focus:border-primary"
                    rows={2}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="font-rajdhani text-base">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      required
                      placeholder="123456"
                      className="glass-effect border-primary/30 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="openingTime" className="font-rajdhani text-base">Opening Time *</Label>
                    <Input
                      id="openingTime"
                      name="openingTime"
                      type="time"
                      required
                      defaultValue={shopProfile?.openingTime || ''}
                      className="glass-effect border-primary/30 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="closingTime" className="font-rajdhani text-base">Closing Time *</Label>
                    <Input
                      id="closingTime"
                      name="closingTime"
                      type="time"
                      required
                      defaultValue={shopProfile?.closingTime || ''}
                      className="glass-effect border-primary/30 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-rajdhani text-base">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Tell customers about your shop..."
                    defaultValue={shopProfile?.description || ''}
                    className="glass-effect border-primary/30 focus:border-primary"
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="font-rajdhani text-base">Shop Images</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddImage}
                      className="glass-effect border-primary/30"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Image URL
                    </Button>
                    <span className="text-sm text-muted-foreground font-poppins">
                      {images.length} image(s) added
                    </span>
                  </div>
                  {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {images.map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-lg glass-effect border border-primary/20 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-neon-cyan" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 font-rajdhani font-bold text-lg py-6 shadow-neon-cyan transition-all hover:shadow-neon-blue"
                >
                  {isLoading ? (shopProfile ? 'Updating Shop...' : 'Adding Shop...') : (shopProfile ? 'Update Shop' : 'Add Shop to ServiceSpot')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
      
      <PageNavigation 
        previousPage={{ href: '/explore', label: 'Explore' }}
        nextPage={{ href: '/test-firebase', label: 'Test Firebase' }}
      />
    </div>
  );
}
