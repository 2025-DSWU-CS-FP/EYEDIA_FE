import { ButtonHTMLAttributes } from 'react';

import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
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
      className={clsx(
        'px-8 py-3 bg-white rounded-sm inline-flex justify-center items-center gap-2.5 text-black text-lg font-semibold font-["Pretendard"]',
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
