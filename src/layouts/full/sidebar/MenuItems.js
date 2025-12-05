import {
  IconLayoutDashboard, IconLogin, IconMeat
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
    title: 'Recipes',
    icon: IconLayoutDashboard,
    href: '/recipes',
  },
  {
    id: uniqueId(),
    title: 'Ingredients',
    icon: IconMeat,
    href: '/ingredients',
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
