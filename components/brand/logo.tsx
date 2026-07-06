'use client';

import { motion } from 'framer-motion';
import { Boxes } from 'lucide-react';
import { useTheme } from '@/lib/theme/context';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  animate?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { box: 'h-8 w-8', icon: 'h-4 w-4', text: 'text-base' },
  md: { box: 'h-10 w-10', icon: 'h-5 w-5', text: 'text-lg' },
  lg: { box: 'h-20 w-20', icon: 'h-10 w-10', text: 'text-2xl' },
};

export function Logo({ size = 'md', showText = false, animate = false, className = '' }: LogoProps) {
  const { mode } = useTheme();
  const s = sizeMap[size];

  const icon = (
    <motion.div
      whileHover={animate ? { rotate: 360, scale: 1.05 } : undefined}
      transition={{ duration: 0.6 }}
      className={`relative ${s.box} rounded-xl flex items-center justify-center ${
        mode === 'dark'
          ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 shadow-lg shadow-amber-500/30'
          : 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/30'
      }`}
    >
      <Boxes className={`${s.icon} text-white`} strokeWidth={2.2} />
      {mode === 'dark' && (
        <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
      )}
    </motion.div>
  );

  if (!showText) return <div className={className}>{icon}</div>;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {icon}
      <span
        className={`${s.text} font-bold tracking-tight ${
          mode === 'dark'
            ? 'bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 bg-clip-text text-transparent'
            : 'bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 bg-clip-text text-transparent'
        }`}
      >
        AlTony tex
      </span>
    </div>
  );
}
