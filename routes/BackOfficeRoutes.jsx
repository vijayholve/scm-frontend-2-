import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasBackOfficePermission } from 'utils/permissions';
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// Lazy load Backoffice components
const BackOfficeHome = Loadable(lazy(() => import('views/Backoffice/BackOfficeHome')));
const AccountManagement = Loadable(lazy(() => import('views/Backoffice/AccountManagement')));
const UserManagement = Loadable(lazy(() => import('views/Backoffice/UserManagement')));
const Reports = Loadable(lazy(() => import('views/Backoffice/Reports')));
const Admins = Loadable(lazy(() => import('views/Backoffice/Admin')));
const Features = Loadable(lazy(() => import('views/Backoffice/Feature')));
const Schools = Loadable(lazy(() => import('views/Backoffice/School')));
const Institute = Loadable(lazy(() => import('views/Backoffice/Institute')));
// ==============================|| BACKOFFICE ROUTING (NO AUTH REQUIRED) ||============================== //

const BackOfficeRoutes = () => {
  const user = useSelector((state) => state.user.user);

  if (!hasBackOfficePermission(user)) {
    return <Navigate to="/" replace />;
  }

  return {
    path: '/backoffice',
    element: <MinimalLayout />,
    children: [
      {
        path: '', // Relative path for the home route
        element: <Admins />
      },
      {
        path: 'admins', // Relative path for admins
        element: <Admins />
      },
      {
        path: 'features', // Relative path for account management
        element: <Features />
      },
      {
        path: 'school', // Relative path for account management
        element: <Schools />
      },
      {
        path: 'institute', // Relative path for account management
        element: <Institute /> 
      },
     

    ]
  };
};

export default BackOfficeRoutes;
