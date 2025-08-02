import { Navigate } from 'react-router-dom';

import Main from '@/pages/main/MainPage';

export default function RedirectRoot() {
  const isLoggedIn = !!localStorage.getItem('accessToken');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Main />;
}
