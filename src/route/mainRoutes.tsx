import { lazy } from 'react';

import { RouteObject } from 'react-router-dom';

const Main = lazy(() => import('@/pages/main/MainPage'));
const PopularExhibitionPage = lazy(
  () => import('@/pages/main/PopularExhibitionPage'),
);
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const MyPage = lazy(() => import('@/pages/auth/MyPage'));
const Onboarding = lazy(() => import('@/pages/chat/Onboarding'));
const GazePage = lazy(() => import('@/pages/chat/GazePage'));
const Artwork = lazy(() => import('@/pages/Artwork'));
const Gallery = lazy(() => import('@/pages/gallery/GalleryPage'));
const GalleryDetail = lazy(() => import('@/pages/gallery/GalleryDetailPage'));
const HelpPage = lazy(() => import('@/pages/chat/HelpPage'));
const ExhibitionDetailPage = lazy(() => import('@/pages/ExhibitionDetailPage'));

const mainRoutes: RouteObject[] = [
  {
    index: true,
    element: <Main />,
  },
  {
    path: 'popular-exhibition',
    element: <PopularExhibitionPage />,
  },
  {
    path: 'mypage',
    element: <MyPage />,
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'signup',
    element: <SignupPage />,
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
    path: 'signup',
    element: <SignupPage />,
  },
  {
    path: 'exhibition/:id',
    element: <ExhibitionDetailPage />,
  },
];

export default mainRoutes;
