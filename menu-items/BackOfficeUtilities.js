// import { lazy } from 'react';
// import { userDetails } from 'utils/apiService';
// import {
//   IconUsers
//   // Corrected from IconAccountCircle
// } from '@tabler/icons-react'; // Import icons

// // Helper functions for permissions
// function hasPermission(permissions, entity, action = 'view') {
//   if (!permissions || !Array.isArray(permissions)) {
//     return false;
//   }
//   const perm = permissions.find(
//     (p) => (p.entityName?.toLowerCase() === entity.toLowerCase() || p.name?.toLowerCase() === entity.toLowerCase()) && p.actions?.[action]
//   );
//   return !!perm;
// }

// function filterMenuByPermissions(menuObject, permissions) {
//   if (!menuObject || !Array.isArray(menuObject.children)) return { ...menuObject, children: [] };
//   return {
//     ...menuObject,
//     children: menuObject.children
//       .map((menu) => {
//         if (!menu.children) {
//           if (hasPermission(permissions, menu.id, 'view')) {
//             return menu;
//           }
//           return null;
//         }
//         const filteredChildren = filterMenuByPermissions({ children: menu.children }, permissions).children;
//         if (!filteredChildren || filteredChildren.length === 0) {
//           return null;
//         }
//         return { ...menu, children: filteredChildren };
//       })
//       .filter(Boolean)
//   };
// }

// // Permissions from user details
// const permissions = userDetails.getPermissions();

// // Backoffice Utilities Menu
// const rawBackOfficeUtilities = {
//   id: 'USERS_MANAGEMENT',
//   title: 'Backoffice Utilities',
//   type: 'group',
//   children: [
//     {
//       id: 'USERS_MANAGEMENT',
//       title: 'USERS_MANAGEMENT',
//       type: 'item',
//       url: '/backoffice',
//       icon: IconUsers,

//       breadcrumbs: false
//     },
//     {
//       id: 'USERS_MANAGEMENT',
//       title: ' USERS_MANAGEMENT',
//       type: 'item',
//       url: '/backoffice/admins',
//       icon: IconUsers,

//       breadcrumbs: false
//     },
//     {
//       id: 'user-management',
//       title: 'User Management',
//       type: 'item',
//       url: '/backoffice/user-management',
//       icon: IconUsers,

//       breadcrumbs: false
//     },
//     {
//       id: 'reports',
//       title: 'Reports',
//       type: 'item',
//       url: '/backoffice/reports',
//       icon: IconUsers,

//       breadcrumbs: false
//     },
//     {
//       id: 'settings',
//       title: 'Settings',
//       type: 'item',
//       url: '/backoffice/settings',
//       icon: IconUsers,

//       breadcrumbs: false
//     },
//     {
//       id: 'audit-logs',
//       title: 'Audit Logs',
//       type: 'item',
//       url: '/backoffice/audit-logs',
//       icon: IconUsers,

//       breadcrumbs: false
//     },
//     {
//       id: 'admin-tools',
//       title: 'Admin Tools',
//       type: 'item',
//       url: '/backoffice/admin-tools',
//       icon: IconUsers,

//       breadcrumbs: false
//     }
//   ]
// };

// // Filter the menu based on permissions
// const backOfficeUtilities = filterMenuByPermissions(rawBackOfficeUtilities, permissions);

// export default backOfficeUtilities;
