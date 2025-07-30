import { ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

interface RoundedIconButtonProps {
  icon: ReactNode;
  bgColor?: string;
  iconColor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-6 text-base',
  md: 'w-11 h-8 text-xl',
  lg: 'w-14 h-10 text-2xl',
};

export default function RoundedIconButton({
  icon,
  bgColor = 'bg-gray-10 hover:bg-gray-10/90 active:bg-gray-10/80',
  iconColor = 'text-brand-blue',
  size = 'md',
  className = '',
}: RoundedIconButtonProps) {
  return (
    <div
      className={twMerge(
        `px-[1.1rem] py-[0.7rem] rounded-full backdrop-blur-sm cursor-pointer flex justify-center items-center ${bgColor} ${iconColor} ${sizeMap[size]}`,
        className,
      )}
    >
      {icon}
    </div>
  );
}
