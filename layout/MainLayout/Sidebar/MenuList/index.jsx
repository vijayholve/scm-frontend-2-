// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { useSelector } from 'react-redux';
import { filterMenuByPermissions } from 'menu-items/utilities';
import { useEffect, useState } from 'react';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {

 // permissions from Redux store
const permissions = useSelector((state) => state.user.permissions || []);
const [menuItemFilter, setMenuItemFilter] = useState([]);

useEffect(() => {
  // console.log('MenuList permissions:', permissions);
   // Filter menu items based on permissions
  //  console.log("menuItem ===>",menuItem);
   const filteredMenu = filterMenuByPermissions(menuItem, permissions ||  []);  
  //  console.log("filteredMenu ===>",filteredMenu);
   setMenuItemFilter(filteredMenu);
}, [permissions]);

console.log('MenuList permissions:', menuItemFilter);

  if (!menuItem || !menuItem.items || menuItem.items.length === 0) {
    return (
      <Typography variant="h6" color="error" align="center">
        No Menu Items Available
      </Typography>
    );
  }

 

  const navItems = menuItemFilter?.items?.map((item) => {
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
