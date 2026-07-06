'use client';

import { I18nProvider } from '@/lib/i18n/context';
import { ThemeProvider } from '@/lib/theme/context';
import { AuthProvider } from '@/lib/auth/context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
