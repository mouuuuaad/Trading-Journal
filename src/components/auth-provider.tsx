
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
    if (loading) return; // Wait until the auth state is determined

    const isPrivateRoute = pathname.startsWith(privateRoutePrefix);
    const isGuestRoute = pathname === '/guest';
    const isPublicRoute = publicRoutes.includes(pathname);

    if (user) {
      const isAuthorized = authorizedUsers.includes(user.email || "");

      if (isAuthorized) {
        // Authorized user should be on the dashboard.
        // If they are on a public page (like /login) or the guest page, redirect them.
        if (!isPrivateRoute) {
          router.replace('/dashboard');
        }
      } else {
        // Unauthorized user should be on the guest page.
        // If they are anywhere else, redirect them.
        if (!isGuestRoute) {
          router.replace('/guest');
        }
      }
    } else {
      // No user is logged in.
      // If they try to access a private route, send them to the login page.
      if (isPrivateRoute) {
        router.replace('/login');
      }
    }
  }, [user, loading, router, pathname]);

  // While loading, or if a redirect is imminent, show a loader or nothing to prevent content flashing.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // This logic prevents rendering the wrong layout while a redirect is in progress.
  if (user) {
      const isAuthorized = authorizedUsers.includes(user.email || "");
      if (isAuthorized && !pathname.startsWith(privateRoutePrefix)) return null;
      if (!isAuthorized && pathname !== '/guest') return null;
  } else {
      if (pathname.startsWith(privateRoutePrefix)) return null;
  }


  return <>{children}</>;
}
