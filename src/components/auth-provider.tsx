"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

const publicRoutes = ['/', '/signup'];
const privateRoutePrefix = '/dashboard';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return; // Wait for authentication state to load
    }

    const isPublicRoute = publicRoutes.includes(pathname);
    const isPrivateRoute = pathname.startsWith(privateRoutePrefix);

    if (user && isPublicRoute) {
      // User is logged in but on a public route, redirect to dashboard
      router.push('/dashboard');
    } else if (!user && isPrivateRoute) {
      // User is not logged in but on a private route, redirect to login
      router.push('/');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Prevent rendering children until redirect has a chance to happen
  const isPublicRoute = publicRoutes.includes(pathname);
  if (user && isPublicRoute) {
    return null;
  }
  if (!user && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}
