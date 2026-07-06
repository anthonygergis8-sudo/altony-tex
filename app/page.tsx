'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import { Providers } from '@/components/providers';
import { SignInForm } from '@/components/auth/sign-in-form';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { MainLayout } from '@/components/layout/main-layout';
import { AdminView } from '@/components/admin/admin-view';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isRTL } = useI18n();
  const [authView, setAuthView] = useState<'signin' | 'signup'>('signin');
  const [view, setView] = useState<'app' | 'admin'>('app');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authView === 'signin' ? (
      <SignInForm onSwitchToSignUp={() => setAuthView('signup')} />
    ) : (
      <SignUpForm onSwitchToSignIn={() => setAuthView('signin')} />
    );
  }

  if (view === 'admin') {
    return <AdminView />;
  }

  return <MainLayout onNavigateAdmin={() => setView('admin')} />;
}

export default function Home() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}
