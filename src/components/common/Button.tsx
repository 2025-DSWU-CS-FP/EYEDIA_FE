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
    'w-full text-bt2 font-medium px-[1.8rem] py-[1.2rem] rounded-[8px] transition';
  const variants = {
    primary: 'bg-brand-blue text-gray-0 hover:bg-brand-blue/80',
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
