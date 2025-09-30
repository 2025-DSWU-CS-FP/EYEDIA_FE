import { lazy } from 'react';

import { RouteObject } from 'react-router-dom';

import OAuthSuccessPage from '@/pages/auth/oauth-success-page';

const Login = lazy(() => import('@/pages/auth/LoginPage'));
const Signup = lazy(() => import('@/pages/auth/SignupPage'));

const loginRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  { path: '/auth/success', element: <OAuthSuccessPage /> },
];

export default loginRoutes;
