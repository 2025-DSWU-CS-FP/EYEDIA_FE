import { lazy } from 'react';

import { RouteObject } from 'react-router-dom';

const Main = lazy(() => import('@/pages/MainPage'));
const Layout = lazy(() => import('@/layouts/Layout'));
// const ErrorPage = lazy(() => import('@/pages/ErrorPage'));

const mainRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    // ErrorBoundary: ErrorPage, TODO: 추후 에러 페이지 추가 후 주석 제거
    children: [
      {
        index: true,
        element: <Main />,
      },
      /* 
      {
        path: '*',
        element: <NotFound />,
      },
      */
    ],
  },
];

export default mainRoutes;
