import React, { useEffect, useState } from 'react';
import Menuitems from './MenuItems';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Box, List } from '@mui/material';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';

const SidebarItems = () => {
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const [listNav, setListNav] = React.useState([]);
  const [userIsLogin, setUserIsLogin] = React.useState(false);
      
  const data_user_login = useSelector((state) => state.userComponent.userLogin);

  useEffect(() => {
    checkIfUserIsLogin();
  }, []);

  useEffect(() => {
    checkIfUserIsLogin();
  }, [data_user_login]);

  const checkIfUserIsLogin = () => {
    if(data_user_login != undefined && data_user_login != null){
      setUserIsLogin(true);
    }
    else{
      setUserIsLogin(false);
    }
  }

  useEffect(() => {
    const filteredMenu = filterMenuByLoginStatus();
    setListNav(filteredMenu);
  }, [userIsLogin]);

  const filterMenuByLoginStatus = () => {
    let listNavComplete = [...Menuitems];
    if (userIsLogin == false) {
      // Filter out items that not require login
      return listNavComplete.filter(item => item.role_item === 'ALWAYS_VISIBLE' || item.role_item === 'VISIBLE_WITHOUT_LOGIN');
    } else {
      // Filter out items that require login
      return listNavComplete.filter(item => item.role_item === 'ALWAYS_VISIBLE' || item.role_item === 'VISIBLE_WITH_LOGIN');
    } 
  };
    

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {listNav.map((item) => {
          // {/********SubHeader**********/}
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} />;

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else {
            return (
              <NavItem item={item} key={item.id} pathDirect={pathDirect} />
            );
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
