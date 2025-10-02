'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { PageNavigation } from '@/components/page-navigation';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'user' | 'shopkeeper'>('user');
  const router = useRouter();
  const { toast } = useToast();
  const { user, signUp, signIn, loading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      router.push('/explore');
    }
  }, [user, loading, router]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const phone = formData.get('phone') as string;

    try {
      await signUp(email, password, name, role, phone || undefined);
      
      toast({
        title: 'Account created successfully!',
        description: `Welcome to ServiceSpot, ${name}!`,
      });
      router.push(role === 'shopkeeper' ? '/dashboard' : '/explore');
    } catch (error: any) {
      toast({
        title: 'Error creating account',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signIn(email, password);
      
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      router.push('/explore');
    } catch (error: any) {
      toast({
        title: 'Error signing in',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    toast({
      title: 'Coming Soon',
      description: 'Google Sign-In will be available soon!',
    });
  };

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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 grid-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-blue/5 pointer-events-none" />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md z-10 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-orbitron font-bold mb-3 neon-text-cyan animate-glow">
            ServiceSpot
          </h1>
          <p className="text-lg text-muted-foreground font-rajdhani">
            Connecting you with nearby shops
          </p>
        </div>

        <Card className="glass-effect border-2 border-primary/20 shadow-neon-cyan">
          <Tabs defaultValue="login" className="w-full p-6">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50">
              <TabsTrigger value="login" className="font-rajdhani data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="font-rajdhani data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="font-rajdhani">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="glass-effect border-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="font-rajdhani">Password</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="glass-effect border-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-rajdhani font-semibold text-lg shadow-neon-cyan transition-all hover:shadow-neon-blue"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-primary/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-rajdhani">Or continue with</span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={handleGoogleSignIn}
                  className="w-full border-primary/30 hover:border-primary font-rajdhani font-semibold"
                >
                  {isLoading ? 'Signing in...' : 'Sign in with Google'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="font-rajdhani">Full Name</Label>
                  <Input
                    id="signup-name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="glass-effect border-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="font-rajdhani">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="glass-effect border-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone" className="font-rajdhani">Phone (Optional)</Label>
                  <Input
                    id="signup-phone"
                    name="phone"
                    type="tel"
                    placeholder="+1234567890"
                    className="glass-effect border-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="font-rajdhani">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="glass-effect border-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="font-rajdhani">Account Type</Label>
                  <RadioGroup value={role} onValueChange={(value) => setRole(value as 'user' | 'shopkeeper')}>
                    <div className="flex items-center space-x-2 p-3 rounded-lg glass-effect border border-primary/20 hover:border-primary/50 transition-all">
                      <RadioGroupItem value="user" id="user" />
                      <Label htmlFor="user" className="flex-1 cursor-pointer font-rajdhani">
                        User - Find nearby shops
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg glass-effect border border-primary/20 hover:border-primary/50 transition-all">
                      <RadioGroupItem value="shopkeeper" id="shopkeeper" />
                      <Label htmlFor="shopkeeper" className="flex-1 cursor-pointer font-rajdhani">
                        Shopkeeper - List my shop
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-rajdhani font-semibold text-lg shadow-neon-cyan transition-all hover:shadow-neon-blue"
                >
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </Button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-primary/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-rajdhani">Or continue with</span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={handleGoogleSignIn}
                  className="w-full border-primary/30 hover:border-primary font-rajdhani font-semibold"
                >
                  {isLoading ? 'Signing in...' : 'Sign up with Google'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      <PageNavigation 
        previousPage={{ href: '/', label: 'Home' }}
        nextPage={{ href: '/explore', label: 'Explore' }}
      />
    </div>
  );
}
