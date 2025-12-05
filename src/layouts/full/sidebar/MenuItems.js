import {
  IconLayoutDashboard, IconLogin, IconMeat
} from '@tabler/icons';

import { uniqueId } from 'lodash';
const list_roles = {
  ALWAYS_VISIBLE: "ALWAYS_VISIBLE", 
  VISIBLE_WITH_LOGIN: "VISIBLE_WITH_LOGIN", 
  VISIBLE_WITHOUT_LOGIN: "VISIBLE_WITHOUT_LOGIN"
}; 

const Menuitems = [
  {
    id: uniqueId(),
    title: 'Home',
    icon: IconLayoutDashboard,
    href: '/dashboard',
    role_item: list_roles.ALWAYS_VISIBLE,
  },
  {
    navlabel: true,
    subheader: 'Recipes',
    role_item: list_roles.ALWAYS_VISIBLE,
  },
  {
    id: uniqueId(),
    title: 'Recipes',
    icon: IconLayoutDashboard,
    href: '/recipes',
    role_item: list_roles.ALWAYS_VISIBLE,
  },
  {
    id: uniqueId(),
    title: 'Ingredients',
    icon: IconMeat,
    href: '/ingredients',
    role_item: list_roles.VISIBLE_WITH_LOGIN,
  },
  {
    navlabel: true,
    subheader: 'Auth',
    role_item: list_roles.VISIBLE_WITHOUT_LOGIN,
  },
  {
    id: uniqueId(),
    title: 'Login',
    icon: IconLogin,
    href: '/auth/login',
    role_item: list_roles.VISIBLE_WITHOUT_LOGIN,
  },
];

export default Menuitems;
