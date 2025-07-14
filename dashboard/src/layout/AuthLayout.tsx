import { useAuthStore } from '@/store';
import { Navigate, Outlet } from 'react-router-dom';

export default function AuthLayout() {
  // const isAuthenticated = getIsAuthenticated();
  const { isAuthenticated } = useAuthStore((state) => state);

  if (isAuthenticated) {
    return <Navigate to={'/dashboard'} replace />;
  }

  return <Outlet />;
}
