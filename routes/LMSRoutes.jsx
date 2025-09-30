import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// LMS page components (create these as needed)
const LMSHome = Loadable(lazy(() => import('views/lms/LMSHome')));
const CourseDetails = Loadable(lazy(() => import('views/lms/CourseDetails')));
const CourseCatalog = Loadable(lazy(() => import('views/lms/CourseCatalog')));
const LMSAbout = Loadable(lazy(() => import('views/lms/LMSAbout')));

// ==============================|| LMS ROUTING (NO AUTH REQUIRED) ||============================== //

const LMSRoutes = {
  path: '/lms',
  element: <MinimalLayout />,
  children: [
    {
      path: '',
      element: <LMSHome />
    },
    {
      path: 'home',
      element: <LMSHome />
    },
    {
      path: 'courses',
      element: <CourseCatalog />
    },
    {
      path: 'course/:courseId',
      element: <CourseDetails />
    },
    {
      path: 'about',
      element: <LMSAbout />
    }
  ]
};

export default LMSRoutes;