import { ReactNode } from 'react';

import { Outlet } from 'react-router-dom';

import NavigationBar from '@/layouts/NavigationBar';

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[375px] flex-col bg-white pb-[64px] pt-[60px]">
      <div className="flex-1">{children || <Outlet />}</div>
      <NavigationBar />
    </div>
  );
}
