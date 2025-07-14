"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { CircleNotch } from 'lucide-react';

const publicRoutes = ['/', '/signup'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      const isPublicRoute = publicRoutes.includes(pathname);
      if (!user && !isPublicRoute) {
        router.push('/');
      }
      if (user && isPublicRoute) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <CircleNotch className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user && !publicRoutes.includes(pathname)) {
    return null; 
  }

  if (user && publicRoutes.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
