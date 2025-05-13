import { lazy } from 'react';

import { RouteObject } from 'react-router-dom';

const Main = lazy(() => import('@/pages/MainPage'));
const MyPage = lazy(() => import('@/pages/MyPage'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const GazePage = lazy(() => import('@/pages/GazePage'));
const Artwork = lazy(() => import('@/pages/Artwork'));
const Search = lazy(() => import('@/pages/SearchPage'));
const Gallery = lazy(() => import('@/pages/GalleryPage'));
const GalleryDetail = lazy(() => import('@/pages/GalleryDetailPage'));
const Layout = lazy(() => import('@/layouts/Layout'));
const HelpPage = lazy(() => import('@/pages/HelpPage'));
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
        path: 'chat-onboarding',
        element: <Onboarding />,
      },
      {
        path: 'chat-gaze',
        element: <GazePage />,
      },
      {
        path: 'chat-artwork',
        element: <Artwork />,
      },
      {
        path: 'help',
        element: <HelpPage />,
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
