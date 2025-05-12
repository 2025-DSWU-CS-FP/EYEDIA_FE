import { lazy } from 'react';

import { RouteObject } from 'react-router-dom';

const Main = lazy(() => import('@/pages/MainPage'));
const MyPage = lazy(() => import('@/pages/MyPage'));
const Chat = lazy(() => import('@/pages/ChatPage'));
const Search = lazy(() => import('@/pages/SearchPage'));
const Gallery = lazy(() => import('@/pages/GalleryPage'));
const GalleryDetail = lazy(() => import('@/pages/GalleryDetailPage'));
const Layout = lazy(() => import('@/layouts/Layout'));
const ErrorPage = lazy(() => import('@/pages/ErrorPage'));

const mainRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    ErrorBoundary: ErrorPage,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: 'mypage',
        element: <MyPage />,
      },
      {
        path: 'chat',
        element: <Chat />,
      },
      {
        path: 'gallery',
        element: <Gallery />,
      },
      {
        path: 'gallery/:id',
        element: <GalleryDetail />,
      },
      {
        path: 'search-result',
        element: <Search />,
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
