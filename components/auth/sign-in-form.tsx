'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LanguageSelector } from '@/components/language-selector';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/brand/logo';
import { Loader2, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export function SignInForm({ onSwitchToSignUp }: { onSwitchToSignUp?: () => void }) {
  const { t, isRTL } = useI18n();
  const { signIn, isLoading } = useAuth();
  const { mode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    const result = await signIn(email, password);
    if (!result.success) {
      setError('عذراً، هذا الحساب غير مسجل أو البيانات خاطئة. يرجى إنشاء حساب جديد.');
    }
  };

  const bgGradient =
    mode === 'dark'
      ? 'bg-gradient-to-br from-[#121212] via-neutral-900 to-neutral-800'
      : 'bg-gradient-to-br from-[#F9F9F7] via-[#f5f5f2] to-[#efefec]';

  return (
    <div
      className={`min-h-screen flex flex-col ${bgGradient} transition-colors duration-500`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header with Language and Theme toggles */}
      <header className="w-full flex justify-between items-center px-6 py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo size="md" showText animate />
        </motion.div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSelector />
        </div>
      </header>

      {/* Main Sign In Form */}
      <main className="flex-1 flex items-center justify-center px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${
            mode === 'dark'
              ? 'bg-neutral-900/80 backdrop-blur-xl border border-neutral-700/50'
              : 'bg-white/90 backdrop-blur-xl border border-neutral-200/50 shadow-xl'
          }`}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="flex justify-center mb-4"
            >
              <Logo size="lg" animate />
            </motion.div>
            <h1
              className={`text-2xl font-bold mb-2 ${
                mode === 'dark' ? 'text-white' : 'text-neutral-800'
              }`}
            >
              {t.auth.welcomeBack}
            </h1>
            <p className={`text-sm ${mode === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {t.common.appNameFull}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className={`text-sm font-medium ${
                  mode === 'dark' ? 'text-neutral-200' : 'text-neutral-700'
                }`}
              >
                {t.auth.email}
              </Label>
              <div className="relative">
                <Mail
                  className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 ${
                    mode === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                  }`}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder={t.auth.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${isRTL ? 'pr-10' : 'pl-10'} h-11 ${
                    mode === 'dark'
                      ? 'bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-amber-500'
                      : 'bg-white border-neutral-200 text-neutral-800 placeholder:text-neutral-400 focus:border-emerald-500'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className={`text-sm font-medium ${
                  mode === 'dark' ? 'text-neutral-200' : 'text-neutral-700'
                }`}
              >
                {t.auth.password}
              </Label>
              <div className="relative">
                <Lock
                  className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 ${
                    mode === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                  }`}
                />
                <Input
                  id="password"
                  type="password"
                  placeholder={t.auth.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${isRTL ? 'pr-10' : 'pl-10'} h-11 ${
                    mode === 'dark'
                      ? 'bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-amber-500'
                      : 'bg-white border-neutral-200 text-neutral-800 placeholder:text-neutral-400 focus:border-emerald-500'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className={mode === 'dark' ? 'border-neutral-600' : 'border-neutral-300'}
                />
                <Label
                  htmlFor="remember"
                  className={`text-sm ${
                    mode === 'dark' ? 'text-neutral-300' : 'text-neutral-600'
                  }`}
                >
                  {t.auth.rememberMe}
                </Label>
              </div>
              <Button
                variant="link"
                className={`px-0 text-sm ${
                  mode === 'dark'
                    ? 'text-amber-400 hover:text-amber-300'
                    : 'text-emerald-600 hover:text-emerald-500'
                }`}
              >
                {t.auth.forgotPassword}
              </Button>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full h-11 font-semibold ${
                mode === 'dark'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t.auth.signInButton
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className={`text-sm ${mode === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {t.auth.noAccount}
            </span>
            <Button
              variant="link"
              className={`px-2 text-sm ${
                mode === 'dark'
                  ? 'text-amber-400 hover:text-amber-300'
                  : 'text-emerald-600 hover:text-emerald-500'
              }`}
              onClick={onSwitchToSignUp}
            >
              {t.auth.createAccount}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
