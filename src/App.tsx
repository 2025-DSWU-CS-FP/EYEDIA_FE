import { Suspense } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import LoopLoading from '@/components/common/LoopLoading';
import MainView from '@/layouts/MainView';
import mainRoutes from '@/route/mainRoutes';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    children: [...mainRoutes],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          // TODO : 수정 필요, 에러바운더리추가
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
