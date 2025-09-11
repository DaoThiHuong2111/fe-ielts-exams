'use client';

import React from 'react';
import { useProtectedRoute } from '@/hooks/useSession';
import { UserProfile } from '@/components/user-profile';

/**
 * User Profile Page
 */
export default function ProfilePage() {
  const { isLoading, isAuthenticated } = useProtectedRoute();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // This should be handled by the middleware and useProtectedRoute hook
    // but we'll add a fallback redirect
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserProfile />
    </div>
  );
}