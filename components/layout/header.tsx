'use client';

import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/language-selector';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/brand/logo';
import { User, LogOut, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  onNavigateAdmin?: () => void;
}

export function Header({ onNavigateAdmin }: HeaderProps) {
  const { t, isRTL } = useI18n();
  const { mode } = useTheme();
  const { user, signOut, isAdmin } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`sticky top-0 z-50 backdrop-blur-xl border-b ${
        mode === 'dark'
          ? 'bg-neutral-900/90 border-neutral-800'
          : 'bg-white/90 border-neutral-200'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between px-4 py-3 max-w-screen-xl mx-auto">
        {/* Logo */}
        <Logo size="sm" showText animate />

        {/* Right side controls */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LanguageSelector />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${
                  mode === 'dark'
                    ? 'hover:bg-neutral-800'
                    : 'hover:bg-neutral-100'
                }`}
              >
                {user ? (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className={`text-xs font-semibold ${
                        mode === 'dark'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-700'
                      }`}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className={`h-4 w-4 ${mode === 'dark' ? 'text-white' : 'text-neutral-700'}`} />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              {isAdmin && onNavigateAdmin && (
                <DropdownMenuItem
                  onClick={onNavigateAdmin}
                  className="cursor-pointer gap-2 text-amber-500 focus:text-amber-500"
                >
                  <Shield className="h-4 w-4" />
                  {t.admin.dashboard}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={signOut} className="cursor-pointer gap-2 text-red-500 focus:text-red-500">
                <LogOut className="h-4 w-4" />
                {t.common.signOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
