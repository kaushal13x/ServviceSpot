'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface PageNavigationProps {
  previousPage?: {
    href: string;
    label: string;
  };
  nextPage?: {
    href: string;
    label: string;
  };
  showHome?: boolean;
}

export function PageNavigation({ previousPage, nextPage, showHome = true }: PageNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Auto-detect navigation based on current page
  const getAutoNavigation = () => {
    switch (pathname) {
      case '/':
        return {
          next: { href: '/auth', label: 'Get Started' }
        };
      case '/auth':
        return {
          prev: { href: '/', label: 'Home' },
          next: { href: '/explore', label: 'Explore Shops' }
        };
      case '/explore':
        return {
          prev: { href: '/auth', label: 'Login' },
          next: { href: '/dashboard', label: 'Dashboard' }
        };
      case '/dashboard':
        return {
          prev: { href: '/explore', label: 'Explore' },
          next: { href: '/test-firebase', label: 'Test Firebase' }
        };
      case '/test-firebase':
        return {
          prev: { href: '/dashboard', label: 'Dashboard' },
          next: { href: '/', label: 'Home' }
        };
      default:
        if (pathname.startsWith('/shop/')) {
          return {
            prev: { href: '/explore', label: 'Back to Shops' },
            next: { href: '/auth', label: 'Login' }
          };
        }
        return {};
    }
  };

  const autoNav = getAutoNavigation();
  const prev = previousPage || autoNav.prev;
  const next = nextPage || autoNav.next;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 glass-effect border border-primary/20 rounded-full px-4 py-2 shadow-lg">
        {prev && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(prev.href)}
            className="rounded-full hover:bg-primary/10"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {prev.label}
          </Button>
        )}
        
        {showHome && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="rounded-full hover:bg-primary/10"
          >
            <Home className="w-4 h-4" />
          </Button>
        )}
        
        {next && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(next.href)}
            className="rounded-full hover:bg-primary/10"
          >
            {next.label}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
