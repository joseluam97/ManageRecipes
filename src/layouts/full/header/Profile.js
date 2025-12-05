import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Typography,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useSelector } from 'react-redux';

import ProfileImg from 'src/assets/images/profile/user-1.jpg';

const Profile = () => {

  const [nameUserLogin, setNameUserLogin] = React.useState("");

  const data_user_login = useSelector((state) => state.userComponent.userLogin);

  useEffect(() => {
    checkIfUserIsLogin();
  }, []);

  useEffect(() => {
    checkIfUserIsLogin();
  }, [data_user_login]);

  const checkIfUserIsLogin = () => {
    if (data_user_login != undefined && data_user_login != null) {
      let string_display = data_user_login.email + " (" + data_user_login.role + ")";
      setNameUserLogin(string_display);
    }
    else {
      setNameUserLogin("Guest User");
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
      >
        <Avatar
          src={ProfileImg}
          alt={ProfileImg}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      <Typography variant="h4" color="#000" fontWeight="bold" gutterBottom>{nameUserLogin}</Typography>
    </Box>
  );
};

export default Profile;
