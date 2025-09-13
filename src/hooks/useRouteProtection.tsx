import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

interface RouteProtectionOptions {
  requireAuth?: boolean;
  redirectTo?: string;
  loadingComponent?: React.ReactNode;
}

/**
 * Hook for enhanced route protection with better user experience
 */
export function useRouteProtection(options: RouteProtectionOptions = {}) {
  const {
    requireAuth = true,
    redirectTo = '/login',
    loadingComponent = null,
  } = options;

  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkRouteAccess = async () => {
      if (isLoading) return;

      setIsChecking(true);

      try {
        // Check if route requires authentication
        if (requireAuth) {
          if (!isAuthenticated) {
            // Store the current path for redirect after login
            if (typeof window !== 'undefined') {
              const currentPath = window.location.pathname + window.location.search;
              sessionStorage.setItem('redirectAfterLogin', currentPath);
              
              // Redirect to login page with callback URL
              const callbackUrl = encodeURIComponent(currentPath);
              router.push(`${redirectTo}?callbackUrl=${callbackUrl}`);
            } else {
              router.push(redirectTo);
            }
            return;
          }
        } else {
          // For public routes (like login/register)
          // Redirect authenticated users to profile
          if (isAuthenticated) {
            router.push('/profile');
            return;
          }
        }
      } catch (error) {
        console.error('Route protection error:', error);
        
        // If there's an error checking authentication, redirect to login for protected routes
        if (requireAuth) {
          router.push(redirectTo);
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkRouteAccess();
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  // Session timeout is handled by AuthContext, so we don't need additional listeners

  return {
    isChecking: isLoading || isChecking,
    isAuthenticated,
    user,
  };
}

/**
 * Higher-order component for route protection
 */
export function withRouteProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: RouteProtectionOptions = {}
) {
  return function ProtectedRoute(props: P) {
    const { isChecking, isAuthenticated } = useRouteProtection(options);

    if (isChecking) {
      if (options.loadingComponent) {
        return <>{options.loadingComponent}</>;
      }
      
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (options.requireAuth && !isAuthenticated) {
      // This should be handled by the hook's redirect
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

/**
 * Hook for admin route protection
 */
export function useAdminRouteProtection(options: Omit<RouteProtectionOptions, 'redirectTo'> = {}) {
  const { isAuthenticated, user, isChecking } = useRouteProtection({
    ...options,
    requireAuth: true,
    redirectTo: '/login',
  });

  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminChecking, setIsAdminChecking] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (isChecking || !isAuthenticated) {
        setIsAdminChecking(false);
        return;
      }

      setIsAdminChecking(true);

      try {
        // Check if user is admin
        // This can be extended to check admin role from user object or API call
        const isAdminUser = user?.email === 'admin@example.com'; // Example admin check
        
        if (!isAdminUser) {
          // Redirect to unauthorized page or dashboard
          router.push('/unauthorized');
          return;
        }
        
        setIsAdmin(true);
      } catch (error) {
        console.error('Admin route protection error:', error);
        router.push('/unauthorized');
      } finally {
        setIsAdminChecking(false);
      }
    };

    checkAdminAccess();
  }, [isAuthenticated, isChecking, user, router]);

  return {
    isChecking: isChecking || isAdminChecking,
    isAuthenticated,
    isAdmin,
    user,
  };
}

/**
 * Hook for getting redirect URL after login
 */
export function useRedirectAfterLogin() {
  const getRedirectUrl = (): string => {
    if (typeof window === 'undefined') return '/profile';
    
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    sessionStorage.removeItem('redirectAfterLogin');
    
    // Validate the URL to prevent open redirects
    if (redirectUrl && redirectUrl.startsWith('/')) {
      return redirectUrl;
    }
    
    return '/profile';
  };

  const setRedirectUrl = (url: string): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectAfterLogin', url);
    }
  };

  return {
    getRedirectUrl,
    setRedirectUrl,
  };
}