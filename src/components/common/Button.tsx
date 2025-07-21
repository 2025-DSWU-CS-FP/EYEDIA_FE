import { ButtonHTMLAttributes, ReactNode } from 'react';

import cn from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  children,
  className,
  onClick,
  disabled,
}: ButtonProps) {
  const baseStyle =
    'w-full max-w-sm text-base font-medium py-3 rounded-md transition';
  const variants = {
    primary: 'bg-brand-blue text-white hover:bg-brand-blue/80',
    secondary: 'bg-gray-30 text-black hover:bg-gray-40',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyle, variants[variant], className)}
    >
      {children}
    </button>
  );
}
