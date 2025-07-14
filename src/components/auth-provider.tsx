
"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { authorizedUsers } from '@/lib/config';

const publicRoutes = ['/login', '/signup', '/guest', '/'];
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
    const isAuthorized = user && authorizedUsers.includes(user.email || "");

    if (user) {
      if (isAuthorized) {
        if (isPublicRoute && pathname !== '/guest') {
           // Authorized user on a public page (like login), send to their dashboard
           router.push('/dashboard');
        }
      } else {
        // User is logged in but NOT authorized
        if (pathname !== '/guest') {
          // Send them to the guest page
          router.push('/guest');
        }
      }
    } else {
       // User is not logged in
       if (isPrivateRoute) {
         // Trying to access a private route without being logged in, send to login
         router.push('/login');
       }
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
  const isAuthorized = user && authorizedUsers.includes(user.email || "");
  if (user && publicRoutes.includes(pathname) && isAuthorized && pathname !== '/guest') {
      return null;
  }
   if (user && !isAuthorized && pathname !== '/guest') {
      return null;
  }
  if (!user && !publicRoutes.includes(pathname)) {
    return null;
  }


  return <>{children}</>;
}
