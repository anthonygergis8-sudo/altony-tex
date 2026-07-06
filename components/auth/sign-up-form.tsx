'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageSelector } from '@/components/language-selector';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/brand/logo';
import { Loader2, Mail, Lock, User, Phone, CheckCircle2, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleSheetsService } from '@/lib/services/google-sheets-service';

const PHONE_REGEX = /^\+?[1-9]\d{6,14}$/;

export function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn?: () => void }) {
  const { t, language, isRTL } = useI18n();
  const { signUp } = useAuth();
  const { mode } = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): string | null => {
    if (!username.trim()) return t.auth.errorUsernameRequired;
    if (!email.trim()) return t.auth.errorEmailRequired;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return t.auth.errorEmailInvalid;
    if (!phone.trim()) return t.auth.errorPhoneRequired;
    if (!PHONE_REGEX.test(phone.replace(/[\s-]/g, ''))) return t.auth.errorPhoneInvalid;
    if (!companyName.trim()) return t.auth.errorCompanyNameRequired;
    if (!password) return t.auth.errorPasswordRequired;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const sheetsResult = await GoogleSheetsService.sendSignup({
        username,
        email,
        phone,
        companyName,
        language,
      });
      alert(sheetsResult.message);
      const result = await signUp({ email, password, username, phone, companyName });
      if (!result.success) {
        alert(`Sign-up error: ${result.error || 'Unknown error'}`);
        setError(t.auth.signUpError);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Sign-up error: ${msg}`);
      setError(t.auth.signUpError);
    } finally {
      setSubmitting(false);
    }
  };

  const bgGradient =
    mode === 'dark'
      ? 'bg-gradient-to-br from-[#121212] via-neutral-900 to-neutral-800'
      : 'bg-gradient-to-br from-[#F9F9F7] via-[#f5f5f2] to-[#efefec]';

  const inputClass = (extra: string) =>
    `${isRTL ? 'pr-10' : 'pl-10'} h-11 ${
      mode === 'dark'
        ? 'bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-amber-500'
        : 'bg-white border-neutral-200 text-neutral-800 placeholder:text-neutral-400 focus:border-emerald-500'
    } ${extra}`;

  const labelClass = `text-sm font-medium ${
    mode === 'dark' ? 'text-neutral-200' : 'text-neutral-700'
  }`;

  const iconClass = `absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 ${
    mode === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
  }`;

  if (success) {
    return (
      <div
        className={`min-h-screen flex flex-col ${bgGradient} transition-colors duration-500`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <header className="w-full flex justify-between items-center px-6 py-4">
          <Logo size="md" showText animate />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 pb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md p-8 rounded-2xl shadow-2xl text-center ${
              mode === 'dark'
                ? 'bg-neutral-900/80 backdrop-blur-xl border border-neutral-700/50'
                : 'bg-white/90 backdrop-blur-xl border border-neutral-200/50'
            }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="flex justify-center mb-4"
            >
              <CheckCircle2
                className={`h-16 w-16 ${mode === 'dark' ? 'text-amber-500' : 'text-emerald-500'}`}
              />
            </motion.div>
            <h2
              className={`text-xl font-bold mb-2 ${
                mode === 'dark' ? 'text-white' : 'text-neutral-800'
              }`}
            >
              {t.auth.signUpSuccess}
            </h2>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col ${bgGradient} transition-colors duration-500`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
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
              {t.auth.signUpTitle}
            </h1>
            <p className={`text-sm ${mode === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {t.auth.signUpSubtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className={labelClass}>
                {t.auth.username}
              </Label>
              <div className="relative">
                <User className={iconClass} />
                <Input
                  id="username"
                  type="text"
                  placeholder={t.auth.usernamePlaceholder}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClass('')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className={labelClass}>
                {t.auth.email}
              </Label>
              <div className="relative">
                <Mail className={iconClass} />
                <Input
                  id="email"
                  type="email"
                  placeholder={t.auth.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass('')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className={labelClass}>
                {t.auth.phone}
              </Label>
              <div className="relative">
                <Phone className={iconClass} />
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t.auth.phonePlaceholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass('')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName" className={labelClass}>
                {t.auth.companyName}
              </Label>
              <div className="relative">
                <Building2 className={iconClass} />
                <Input
                  id="companyName"
                  type="text"
                  placeholder={t.auth.companyNamePlaceholder}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={inputClass('')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={labelClass}>
                {t.auth.password}
              </Label>
              <div className="relative">
                <Lock className={iconClass} />
                <Input
                  id="password"
                  type="password"
                  placeholder={t.auth.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass('')}
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <Button
              type="submit"
              disabled={submitting}
              className={`w-full h-11 font-semibold ${
                mode === 'dark'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t.auth.signUpButton}
                </>
              ) : (
                t.auth.signUpButton
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className={`text-sm ${mode === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {t.auth.haveAccount}
            </span>
            <Button
              variant="link"
              className={`px-2 text-sm ${
                mode === 'dark'
                  ? 'text-amber-400 hover:text-amber-300'
                  : 'text-emerald-600 hover:text-emerald-500'
              }`}
              onClick={onSwitchToSignIn}
            >
              {t.auth.signInLink}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
