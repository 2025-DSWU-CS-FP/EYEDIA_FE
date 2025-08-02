import { ReactNode } from 'react';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import ScrollToTop from '@/components/common/ScrollToTop';
import FloatingButton from '@/layouts/FloatingButton';
// import HamburgerMenu from '@/layouts/MenuBar';
import Footer from '@/layouts/Footer';
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

  const hideUI = isChatRoute || isLoginRoute || isSignupRoute;

  return (
    <div
      className={`mx-auto flex min-h-screen w-full flex-col bg-gray-5 ${
        !hideUI && 'pb-24'
      }`}
    >
      <div className="flex-1">{children || <Outlet />}</div>

      {!hideUI && <Footer />}

      {!hideUI && (
        <>
          <NavigationBar />
          <ScrollToTop />
          {!isMapRoute && (
            <FloatingButton onClick={() => navigate('/chat-onboarding')} />
          )}
        </>
      )}
      {/* <HamburgerMenu /> */}
    </div>
  );
}
