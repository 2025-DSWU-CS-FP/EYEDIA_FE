import { Suspense, lazy } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import LoopLoading from '@/components/common/LoopLoading';
import MainView from '@/layouts/MainView';
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
    children: mainRoutes,
  },
  {
    path: '*', // NotFound는 Layout 없이 따로
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
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}
