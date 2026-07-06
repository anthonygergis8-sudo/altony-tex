'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { ProfileRow } from '@/lib/supabase';

export type UserRole = 'customer' | 'admin';

interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  phone?: string;
  companyName?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: { email: string; password: string; username: string; phone: string; companyName: string }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';

  const fetchProfile = useCallback(async (userId: string, email: string): Promise<User | null> => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !profile) {
      return {
        id: userId,
        email,
        name: email.split('@')[0],
        role: 'customer' as UserRole,
      };
    }

    const p = profile as ProfileRow;
    return {
      id: p.id,
      email,
      name: p.username || email.split('@')[0],
      username: p.username || undefined,
      phone: p.phone || undefined,
      companyName: p.company_name || undefined,
      role: p.role,
    };
  }, []);

  const restoreSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const profile = await fetchProfile(session.user.id, session.user.email || '');
      if (profile) setUser(profile);
    }
    setIsLoading(false);
  }, [fetchProfile]);

  useEffect(() => {
    restoreSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          setUser(null);
          return;
        }
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const profile = await fetchProfile(session.user.id, session.user.email || '');
          if (profile) setUser(profile);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, [restoreSession, fetchProfile]);

  const signIn = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }
      if (!data.user) {
        setIsLoading(false);
        return { success: false, error: 'No user returned' };
      }
      const profile = await fetchProfile(data.user.id, data.user.email || '');
      if (profile) setUser(profile);
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  }, [fetchProfile]);

  const signUp = useCallback(async (data: { email: string; password: string; username: string; phone: string; companyName: string }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            phone: data.phone,
            company_name: data.companyName,
          },
        },
      });
      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }
      if (!authData.user) {
        setIsLoading(false);
        return { success: false, error: 'No user returned' };
      }
      const profile = await fetchProfile(authData.user.id, authData.user.email || '');
      if (profile) setUser(profile);
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, isAdmin, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
