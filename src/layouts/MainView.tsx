import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  isEmpty?: boolean;
  className?: string;
}

export default function MainView({ children, isEmpty, className }: Props) {
  return (
    <main
      className={`w-full mx-auto flex flex-col px-4 ${
        isEmpty ? 'items-center justify-center py-10' : 'pt-6 pb-[80px]'
      } ${className}`}
    >
      {children}
    </main>
  );
}
