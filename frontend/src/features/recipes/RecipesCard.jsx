import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { formatMinutesToTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Menu1 from 'src/assets/images/menu/menu1.jpg';

import {
  LOWER_LEVEL_DIFFICULTY_RECIPE,
  MEDIUM_LEVEL_DIFFICULTY_RECIPE,
  COLOR_DEFAULT_TYPE_RECIPES
} from 'src/utils/constant';

// ----------------------------------------------------------------------

export default function RecipeCard({ recipe }) {

  const renderStatus = (
    <>
      <Label
        variant="filled"
        sx={{
          zIndex: 9,
          top: 16,
          left: 16,
          position: 'absolute',
          textTransform: 'uppercase',
          backgroundColor: recipe.type.color
        }}
      >
        {recipe.type != undefined ? recipe.type?.name : "Not defined"}
      </Label>


      <Label
        variant="filled"
        color='info'
        sx={{
          zIndex: 9,
          top: 16,
          right: 16,
          position: 'absolute',
        }}
      >
        {formatMinutesToTime(recipe.preparation_time)}
      </Label>

    </>
  );

  const renderImg = (
    <Box
      component="img"
      alt={recipe?.name}
      src={Menu1}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderTittle = (
    <Stack direction="column" alignItems="left" justifyContent="space-between">
      <Link color="inherit" underline="hover" variant="h6" noWrap>
        {recipe?.name}
      </Link>
      <Typography
        component="span"
        variant="filled"
        color='info'
        sx={{
          color: 'text.disabled',
        }}
      >
        {recipe.order != undefined ? recipe.order?.name : "Not defined"}
      </Typography>
    </Stack>
  );

  const renderPrice = (
    <Label
      variant="filled"
      color={recipe.difficulty == LOWER_LEVEL_DIFFICULTY_RECIPE ? 'green' :
        recipe.difficulty == MEDIUM_LEVEL_DIFFICULTY_RECIPE ? 'yellow' :
          'red'
      }
      sx={{
        top: 16,
        right: 16,
        color: '#ffffff',
      }}
    >
      {recipe.difficulty != undefined ? recipe.difficulty?.name : "Not defined"}
    </Label>
  );


  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {renderStatus}
        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {renderTittle}
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {renderPrice}
        </Stack>

      </Stack>
    </Card>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.object,
};
