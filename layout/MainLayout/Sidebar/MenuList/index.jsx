// vijayholve/scm-frontend-2-/scm-frontend-2--af3a43b8c782ff35d5cb58355cbb444aa215ca69/layout/MainLayout/Sidebar/MenuList/index.jsx

// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items'; // Retained for compatibility with other menu groups
import { filterMenuByPermissions, getUtilitiesMenu } from 'menu-items/utilities'; // MODIFIED IMPORT
import { useSelector } from 'react-redux';
import { useEffect, useState, useMemo } from 'react'; 
import { useTranslation } from 'react-i18next'; // <-- NEW IMPORT

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {

 // NEW: Get translation function and i18n instance
 const { t } = useTranslation('utilities'); // Use the 'utilities' namespace, forcing re-render on language change
 
 // permissions from Redux store
const permissions = useSelector((state) => state.user.permissions || []);

// Memoize the fully translated and filtered menu structure
const menuItems = useMemo(() => {
    // 1. Get the raw utilities menu with current translations
    const rawUtilities = getUtilitiesMenu(t); 

    // 2. Combine with other static menu items (assuming 'dashboard' is elsewhere in original implementation, this handles all required permissions)
    const allItems = [{ items: [rawUtilities] }];

    // 3. Filter the menu based on permissions
    const finalMenu = filterMenuByPermissions(allItems[0], permissions || []); 
    
    return finalMenu;
}, [permissions, t]); // <-- Reruns whenever permissions change OR the translation function (t) changes (i.e., language changes)


  if (!menuItems || !menuItems.items || menuItems.items.length === 0) {
    return (
      <Typography variant="h6" color="error" align="center">
        No Menu Items Available
      </Typography>
    );
  }

 

  const navItems = menuItems.items.map((item) => { // Use the memoized menuItems
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;