import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { blue, yellow, red, grey, green } from '@mui/material/colors';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import HelpIcon from '@mui/icons-material/Help';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function Alert({ title, description, type }) {
  const getIconToDisplay = (type) => {
    if (type == 'info') {
      return (
        <Avatar sx={{ bgcolor: green[500] }} aria-label="recipe">
          <InfoIcon />
        </Avatar>
      );
    } else if (type == 'warning') {
      return (
        <Avatar sx={{ bgcolor: yellow[500] }} aria-label="recipe">
          <WarningIcon />
        </Avatar>
      );
    } else if (type == 'error') {
      return (
        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
          <ErrorIcon />
        </Avatar>
      );
    } else if (type == 'success') {
      return (
        <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe">
          <CheckCircleOutlineIcon />
        </Avatar>
      );
    } else {
      return (
        <Avatar sx={{ bgcolor: grey[500] }} aria-label="recipe">
          <HelpIcon />
        </Avatar>
      );
    }
  };

  const getColorToDisplay = (type) => {
    if (type == 'info') {
      return blue[500];
    } else if (type == 'warning') {
      return yellow[500];
    } else if (type == 'error') {
      return red[500];
    } else {
      return grey[500];
    }
  };

  return (
    <Card sx={{ border: 2, borderRadius: 2, marginTop: 1}}>
      <CardHeader
        avatar={getIconToDisplay(type)}
        sx={{ p: 1 }}
        title={
          <Typography variant="h6" sx={{ color: 'text.secondary', wordWrap: 'break-word' }}>
            {title}
          </Typography>
        }
        subheader={
          <Typography variant="body2" sx={{ color: 'text.secondary', wordWrap: 'break-word' }}>
            {description}
          </Typography>
        }
      />
    </Card>
  );
}

Alert.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.string,
};
