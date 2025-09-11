'use client';

import React from 'react';
import { useAuth, useCurrentUser } from '@/contexts/auth-context';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * Dashboard Page
 * Demonstrates enhanced authentication state management
 */
export default function DashboardPage() {
  const { isChecking } = useRouteProtection({ requireAuth: true });
  const { user, isAuthenticated, isLoading, refreshUser } = useCurrentUser();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isChecking || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // This should be handled by the route protection hook
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">IELTS Exams Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.firstName || user?.username}!
              </span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback>
                  {(user?.firstName?.charAt(0) || user?.username?.charAt(0) || '').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="mt-1 text-sm text-gray-600">
              Welcome to your IELTS Exams dashboard
            </p>
          </div>

          {/* User Information Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                User Information
              </CardTitle>
              <CardDescription>
                Your account information and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Username</p>
                  <p className="text-sm">{user?.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-sm">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-sm">{user?.phone || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Status</p>
                  <Badge variant="default">Active</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="text-sm">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString() 
                      : 'Unknown'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile</CardTitle>
                <CardDescription>
                  Manage your profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/profile">
                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Practice Tests</CardTitle>
                <CardDescription>
                  Take IELTS practice tests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/quiz">
                  <Button className="w-full" variant="outline">
                    Start Practice
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
                <CardDescription>
                  View your learning progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Authentication State Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication State</CardTitle>
              <CardDescription>
                Current authentication status and session information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Authentication Status</span>
                  <Badge variant={isAuthenticated ? "default" : "secondary"}>
                    {isAuthenticated ? "Authenticated" : "Not Authenticated"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">User ID</span>
                  <span className="text-sm text-gray-600">{user?.id || 'N/A'}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Updated</span>
                  <span className="text-sm text-gray-600">
                    {user?.updatedAt 
                      ? new Date(user.updatedAt).toLocaleString() 
                      : 'N/A'}
                  </span>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button 
                      onClick={refreshUser} 
                      variant="outline" 
                      size="sm"
                    >
                      Refresh User Data
                    </Button>
                    <Button 
                      onClick={handleLogout} 
                      variant="outline" 
                      size="sm"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}