import { ButtonHTMLAttributes, ReactNode } from 'react';

import cn from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({
  children,
  className,
  onClick,
  disabled,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        className,
        'w-full whitespace-nowrap rounded-[6px] bg-brand-blue px-[1.8rem] py-[1.2rem] text-gray-0 transition hover:bg-brand-blue/80',
      )}
    >
      {children}
    </button>
  );
}
