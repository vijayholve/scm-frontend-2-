// src/menu-items/index.js (or wherever your navigation data lives)
// import pages from './pages'; // Assuming you have nested menu items
// import dashboard from './dashboard';

import pages from 'menu-items/pages';
import dashboard from 'menu-items/dashboard';
const navigation = {
  items: [dashboard, pages] // This 'navigation' object is what Breadcrumbs likely expects
};

export default navigation;