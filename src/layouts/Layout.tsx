import { ReactNode } from 'react';

import { Outlet } from 'react-router-dom';

import FloatingButton from '@/layouts/FloatingButton';
// import HamburgerMenu from '@/layouts/MenuBar'; TODO: 추후 반응형 적용
import NavigationBar from '@/layouts/NavigationBar';

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[400px] pb-28 flex-col bg-white">
      {' '}
      {/* TODO: pb-28 md:pb-5로 수정하기 */}
      <div className="flex-1">{children || <Outlet />}</div>
      <NavigationBar />
      <FloatingButton />
      {/* <HamburgerMenu /> */}
    </div>
  );
}
