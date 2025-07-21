import { ReactNode } from 'react';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import FloatingButton from '@/layouts/FloatingButton';
// import HamburgerMenu from '@/layouts/MenuBar';
import NavigationBar from '@/layouts/NavigationBar';

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isChatRoute = location.pathname.startsWith('/chat');
  const isLoginRoute = location.pathname.startsWith('/login');
  const isSignupRoute = location.pathname.startsWith('/signup');
  const isMapRoute = location.pathname.startsWith('/map');

  return (
    <div
      className={`mx-auto flex min-h-screen w-full flex-col bg-white ${
        !isChatRoute && !isLoginRoute && !isSignupRoute && 'pb-24'
      }`}
    >
      <div className="flex-1">{children || <Outlet />}</div>
      {!isChatRoute && !isLoginRoute && !isSignupRoute && (
        <>
          <NavigationBar />
          {!isMapRoute && !isLoginRoute && !isSignupRoute && (
            <FloatingButton onClick={() => navigate('/chat-onboarding')} />
          )}
        </>
      )}
      {/* <HamburgerMenu /> */}
    </div>
  );
}
