'use client';

import { useTheme } from '@/lib/theme/context';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useI18n } from '@/lib/i18n/context';

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const { t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-inherit hover:bg-white/10 dark:hover:bg-neutral-800"
        >
          {mode === 'dark' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {mode === 'dark' ? t.common.darkMode : t.common.lightMode}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setMode('light')}
          className={`cursor-pointer gap-2 ${mode === 'light' ? 'bg-accent' : ''}`}
        >
          <Sun className="h-4 w-4" />
          {t.common.lightMode}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setMode('dark')}
          className={`cursor-pointer gap-2 ${mode === 'dark' ? 'bg-accent' : ''}`}
        >
          <Moon className="h-4 w-4" />
          {t.common.darkMode}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
