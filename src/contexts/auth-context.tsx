'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SessionService, SessionInfo } from '@/services/session.service';
import { ProfileService, UserProfile } from '@/services/profile.service';
import { useSession } from '@/hooks/useSession';

interface AuthContextType {
  user: UserProfile | null;
  session: SessionInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Context Provider
 * Manages global authentication state and user information
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { sessionInfo, isLoading: sessionLoading } = useSession();

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        // Check if user is authenticated
        if (sessionInfo?.isAuthenticated && !sessionInfo?.isExpired) {
          // Load user profile
          await loadUserProfile();
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [sessionInfo]);

  // Set up session listeners
  useEffect(() => {
    const handleSessionUpdate = (sessionInfo: SessionInfo) => {
      if (!sessionInfo.isAuthenticated || sessionInfo.isExpired) {
        setUser(null);
      } else if (sessionInfo.isAuthenticated && !user) {
        // User became authenticated, load profile
        loadUserProfile();
      }
    };

    const handleSessionTimeout = () => {
      setUser(null);
    };

    const sessionService = SessionService.getInstance();
    sessionService.addSessionListener(handleSessionUpdate);
    sessionService.addTimeoutListener(handleSessionTimeout);

    return () => {
      sessionService.removeSessionListener(handleSessionUpdate);
      sessionService.removeTimeoutListener(handleSessionTimeout);
    };
  }, [user]);

  /**
   * Load user profile
   */
  const loadUserProfile = async (): Promise<void> => {
    try {
      const response = await ProfileService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setUser(null);
    }
  };

  /**
   * Handle login
   */
  const login = (tokens: { accessToken: string; refreshToken: string }): void => {
    // Tokens are already stored by the login service
    // Session service will detect the change and update the state
    // The user profile will be loaded automatically
  };

  /**
   * Handle logout
   */
  const logout = (): void => {
    setUser(null);
    // Session service will handle the actual logout process
  };

  /**
   * Refresh user data
   */
  const refreshUser = async (): Promise<void> => {
    if (sessionInfo?.isAuthenticated && !sessionInfo?.isExpired) {
      await loadUserProfile();
    }
  };

  /**
   * Update user data
   */
  const updateUser = (userData: Partial<UserProfile>): void => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const value: AuthContextType = {
    user,
    session: sessionInfo,
    isLoading: isLoading || sessionLoading,
    isAuthenticated: !!sessionInfo?.isAuthenticated && !sessionInfo?.isExpired,
    login,
    logout,
    refreshUser,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook to get current user with loading state
 */
export function useCurrentUser() {
  const { user, isLoading, isAuthenticated, refreshUser } = useAuth();
  
  return {
    user,
    isLoading,
    isAuthenticated,
    refreshUser,
  };
}

/**
 * Hook to check if user has specific role
 */
export function useUserRole() {
  const { user } = useAuth();
  
  const hasRole = (role: string): boolean => {
    // This can be extended to check for specific roles
    // For now, we'll just check if user exists
    return !!user;
  };
  
  const isAdmin = (): boolean => {
    // This can be extended to check admin role
    return user?.email === 'admin@example.com'; // Example admin check
  };
  
  return {
    hasRole,
    isAdmin,
    user,
  };
}