import { lazy } from 'react';

import { RouteObject } from 'react-router-dom';

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
];

export default loginRoutes;
