import { lazy } from 'react';
// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

import { useSelector } from 'react-redux';
import { userDetails } from 'utils/apiService';
import i18n from '../i18n';

// assets
import {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconUsers,
  IconUserCheck,
  IconBuildingCommunity,
  IconSchool,
  IconBox,
  IconLayoutGrid,
  IconBook,
  IconCalendarEvent,
  IconClipboardList,
  IconKey,
  IconUsersGroup,
  IconFileText,
  IconClock,
  IconUserCircle,
  IconCreditCard,
  IconBook2, // for LMS
  IconAward, // for Quiz & Tests
  IconListDetails,
  IconDeviceGamepad,
  IconFileDescription,
  IconBellRinging
} from '@tabler/icons-react';

const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconUsers,
  IconUserCheck,
  IconBuildingCommunity,
  IconSchool,
  IconBox,
  IconLayoutGrid,
  IconBook,
  IconCalendarEvent,
  IconClipboardList,
  IconKey,
  IconUsersGroup,
  IconFileText,
  IconClock,
  IconUserCircle,
  IconCreditCard,
  IconBook2,
  IconAward,
  IconListDetails,
  IconDeviceGamepad,
  IconFileDescription,
  IconBellRinging
};

// Placeholder permissions object (assuming real permissions come from redux)
const permissions = userDetails.getPermissions();

function hasPermission(permissions, entity, action = 'view') {
  if (!permissions || !Array.isArray(permissions)) {
    return false;
  }
  const perm = permissions.find(
    (p) => (p.entityName?.toLowerCase() === entity.toLowerCase() || p.name?.toLowerCase() === entity.toLowerCase()) && p.actions?.[action]
  );
  return !!perm;
}

// Helper to filter menu items recursively (unchanged)
function filterMenuByPermissions(menuObject, permissions) {
  if (!menuObject || !Array.isArray(menuObject.items)) return { ...menuObject, items: [] };
  return {
    ...menuObject,
    items: menuObject.items
      .map((menu) => {
        if (!menu.children) {
          if (hasPermission(permissions, menu.id, 'view')) {
            return menu;
          }
          return null;
        }
        const filteredChildren = filterMenuByPermissions({ items: menu.children }, permissions).items;
        if (!filteredChildren || filteredChildren.length === 0) {
          return null;
        }
        return { ...menu, children: filteredChildren };
      })
      .filter(Boolean)
  };
}

/**
 * Function that builds the translated menu structure, passed the 't' function.
 * @param {function} t The i18next translation function.
 * @returns {object} The translated utilities menu structure.
 */
const getUtilitiesMenu = (t) => ({
  id: 'masters',
  title: t('groupTitle'),
  type: 'group',
  children: [
    {
      id: 'USERS_MANAGEMENT',
      title: t('users'),
      type: 'collapse',
      icon: icons.IconUsers,
      breadcrumbs: false,
      children: [
        { id: 'TEACHER', title: t('teachers'), type: 'item', url: '/masters/teachers', icon: icons.IconUserCheck, breadcrumbs: false },
        { id: 'STUDENT', title: t('students'), type: 'item', url: '/masters/students', icon: icons.IconUsers, breadcrumbs: false }
      ]
    },
    {
      id: 'INSTITUTE',
      title: t('institutesCollapse'),
      type: 'collapse',
      icon: icons.IconBuildingCommunity,
      breadcrumbs: false,
      children: [
        {
          id: 'INSTITUTE',
          title: t('institutesItem'),
          type: 'item',
          url: '/masters/institutes',
          icon: icons.IconBuildingCommunity,
          breadcrumbs: false
        },
        {
          id: 'SCHOOL',
          title: t('schools'),
          type: 'item',
          url: '/masters/schools',
          icon: icons.IconSchool,
          breadcrumbs: false
        },
        {
          id: 'CLASS',
          title: t('classes'),
          type: 'item',
          url: '/masters/classes',
          icon: icons.IconBox,
          breadcrumbs: false
        },
        {
          id: 'DIVISION',
          title: t('divisions'),
          type: 'item',
          url: '/masters/divisions',
          icon: icons.IconLayoutGrid,
          breadcrumbs: false
        },
        {
          id: 'SUBJECT',
          title: t('subjects'),
          type: 'item',
          url: '/masters/subjects',
          icon: icons.IconBook,
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'ATTENDANCE',
      title: t('attendance'),
      type: 'item',
      url: '/masters/attendance/list',
      icon: icons.IconCalendarEvent,
      breadcrumbs: false
    },
    {
      id: 'STUDENT_ATTENDANCE',
      title: t('studentAttendance'),
      type: 'item',
      url: '/masters/student-attendance',
      icon: icons.IconUserCheck,
      breadcrumbs: false
    },
    {
      id: 'ASSIGNMENT',
      title: t('assignments'),
      type: 'item',
      url: '/masters/assignments',
      icon: icons.IconClipboardList,
      breadcrumbs: false
    },
    {
      id: 'ROLE',
      title: t('roles'),
      type: 'item',
      url: '/masters/roles',
      icon: icons.IconKey,
      breadcrumbs: false
    },
    {
      id: 'EXAM',
      title: t('exams'),
      type: 'item',
      url: '/masters/exams',
      icon: icons.IconFileText,
      breadcrumbs: false
    },
    {
      id: 'EXAM_TEACHER_VIEW',
      title: t('examsTeacherView'),
      type: 'item',
      url: '/masters/exams/teacher',
      icon: icons.IconFileText,
      breadcrumbs: false
    },
    {
      id: 'EXAM_STUDENT_VIEW',
      title: t('examsStudentView'),
      type: 'item',
      url: '/masters/exams/student',
      icon: icons.IconFileText,
      breadcrumbs: false
    },
    {
      id: 'TIMETABLE',
      title: t('timetables'),
      type: 'item',
      url: '/masters/timetables',
      icon: icons.IconClock,
      breadcrumbs: false
    },
    {
      id: 'IDCARD',
      title: t('idCards'),
      type: 'item',
      url: '/masters/idcards',
      icon: icons.IconCreditCard,
      breadcrumbs: false
    },
    {
      id: 'LMS',
      title: t('lms'),
      type: 'item',
      url: '/masters/lms',
      icon: icons.IconBook2,
      breadcrumbs: false
    },
    {
      id: 'IDCARD',
      title: t('leavingCertificateManagement'),
      type: 'item',
      url: '/masters/leaving',
      icon: icons.IconCreditCard,
      breadcrumbs: false
    },
    {
      id: 'FEE_MANAGEMENT_COLLAPSE',
      title: t('feeManagement'),
      type: 'collapse',
      icon: icons.IconCreditCard,
      breadcrumbs: false,
      children: [
        {
          id: 'FEE_MANAGEMENT',
          title: t('adminFeeDashboard'),
          type: 'item',
          url: '/masters/fees',
          icon: icons.IconCreditCard,
          breadcrumbs: false
        },
        {
          id: 'FEE_STUDENT_VIEW',
          title: t('myFees'),
          type: 'item',
          url: '/masters/student/fees',
          icon: icons.IconCreditCard,
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'DOCUMENT_HUB',
      title: t('documentHub'),
      type: 'item',
      url: '/masters/document-hub',
      icon: icons.IconFileDescription,
      breadcrumbs: false
    },
    {
      id: 'DOCUMENT_HUB',
      title: t('notifications'),
      type: 'item',
      url: '/masters/notifications',
      icon: icons.IconBellRinging,
      breadcrumbs: false
    },
    {
      id: 'QUIZ_MANAGEMENT',
      title: t('quizTests'),
      type: 'collapse',
      icon: icons.IconAward,
      breadcrumbs: false,
      children: [
        { id: 'QUIZ', title: t('manageQuizzes'), type: 'item', url: '/masters/quiz', icon: icons.IconListDetails, breadcrumbs: false },
        {
          id: 'STUDENT_QUIZ_LIST',
          title: t('availableQuizzes'),
          type: 'item',
          url: '/masters/student/quizzes',
          icon: icons.IconDeviceGamepad,
          breadcrumbs: false
        }
      ]
    }
  ]
});

// Create a placeholder utilities object using a default translation function for compatibility
const utilities = getUtilitiesMenu(i18n.t.bind(i18n));

// EXPORTS: Export the named functions for dynamic rendering and the default export for compatibility
export { filterMenuByPermissions, getUtilitiesMenu };
export default utilities;
