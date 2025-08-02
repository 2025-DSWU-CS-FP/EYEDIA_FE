import { Suspense, lazy } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import LoopLoading from '@/components/common/LoopLoading';
import { ConfirmProvider } from '@/contexts/ConfirmContext';
import { ToastProvider } from '@/contexts/ToastContext';
import MainView from '@/layouts/MainView';
import loginRoutes from '@/route/loginRoutes';
import mainRoutes from '@/route/mainRoutes';

const Layout = lazy(() => import('@/layouts/Layout'));
const NotFound = lazy(() => import('@/pages/error/NotFound'));
const ErrorPage = lazy(() => import('@/pages/error/ErrorPage'));

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [...mainRoutes, ...loginRoutes],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          <MainView className="flex h-screen w-full items-center justify-center">
            <LoopLoading />
          </MainView>
        }
      >
        <ToastProvider>
          <ConfirmProvider>
            <RouterProvider router={router} />
          </ConfirmProvider>
        </ToastProvider>
      </Suspense>
    </QueryClientProvider>
  );
}
