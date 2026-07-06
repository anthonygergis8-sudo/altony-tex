'use client';

import { Language } from '@/lib/i18n/dictionaries';
import { useI18n } from '@/lib/i18n/context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languageLabels: Record<Language, { native: string; english: string }> = {
  ar: { native: 'العربية', english: 'Arabic' },
  en: { native: 'English', english: 'English' },
  zh: { native: '简体中文', english: 'Chinese' },
};

export function LanguageSelector() {
  const { language, setLanguage, t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-inherit hover:bg-white/10 dark:hover:bg-neutral-800"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">{languageLabels[language].native}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {(['ar', 'en', 'zh'] as Language[]).map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`cursor-pointer ${lang === language ? 'bg-accent' : ''}`}
          >
            <span className="font-medium">{languageLabels[lang].native}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              ({languageLabels[lang].english})
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
