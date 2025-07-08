import { createBrowserRouter } from 'react-router';
import DashboardPage from './pages/dashboard/dashboard';
import StoragePage from './pages/storages/storages';
import LoginPage from './pages/login/login';
import RegisterPage from './pages/register/register';
import MainLayout from './layout/DashboardLayout';
import AuthLayout from './layout/AuthLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/storages',
        element: <StoragePage />,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
]);

export default router;
