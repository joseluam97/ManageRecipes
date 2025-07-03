import {
  IconLayoutDashboard, IconLogin
} from '@tabler/icons';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    id: uniqueId(),
    title: 'Home',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },
  {
    navlabel: true,
    subheader: 'Recipes',
  },
  {
    id: uniqueId(),
    title: 'List',
    icon: IconLayoutDashboard,
    href: '/recipes',
  },
  {
    navlabel: true,
    subheader: 'Auth',
  },
  {
    id: uniqueId(),
    title: 'Login',
    icon: IconLogin,
    href: '/auth/login',
  },
];

export default Menuitems;
