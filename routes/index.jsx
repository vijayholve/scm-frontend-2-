import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import getMainRoutes from './MainRoutes';
import LoginRoutes from './AuthenticationRoutes';

const RouterProviderWrapper = () => {
  const permissions = useSelector((state) => state.user.permissions || []);
  const router = createBrowserRouter([getMainRoutes(permissions), LoginRoutes], {
    basename: import.meta.env.VITE_APP_BASE_NAME
  });

  return <RouterProvider router={router} />;
};

export default RouterProviderWrapper;