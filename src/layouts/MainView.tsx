import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  isEmpty?: boolean;
  className?: string;
}

export default function MainView({ children, isEmpty, className }: Props) {
  return (
    <main
      className={`mx-auto flex w-full flex-col px-4 ${
        isEmpty ? 'items-center justify-center py-10' : 'pb-[8rem] pt-6'
      } ${className}`}
    >
      {children}
    </main>
  );
}
