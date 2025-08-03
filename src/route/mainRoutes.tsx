import { lazy } from 'react';

import { RouteObject } from 'react-router-dom';

import RedirectRoot from '@/components/auth/RedirectRoot';
import PrivacyPolicy from '@/pages/auth/PrivacyPolicy';
import TermsOfService from '@/pages/auth/TermsOfService';

const PopularExhibitionPage = lazy(
  () => import('@/pages/main/PopularExhibitionPage'),
);
const MyPage = lazy(() => import('@/pages/auth/MyPage'));
const MyGalleryPage = lazy(() => import('@/pages/auth/MyGallery'));
const EditProfilePage = lazy(() => import('@/pages/auth/EditProfile'));
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
    element: <RedirectRoot />,
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
    path: 'mygallery',
    element: <MyGalleryPage />,
  },
  {
    path: 'privacy',
    element: <PrivacyPolicy />,
  },
  {
    path: 'terms-of-service',
    element: <TermsOfService />,
  },
  {
    path: 'edit-profile',
    element: <EditProfilePage />,
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
    path: 'exhibition/:id',
    element: <ExhibitionDetailPage />,
  },
];

export default mainRoutes;
