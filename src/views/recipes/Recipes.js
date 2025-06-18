import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import RecipeCard from './components/recipes-card';
import TablePagination from '@mui/material/TablePagination';
import { Stack, IconButton, Badge, Button } from '@mui/material';
import { IconLayoutGridAdd, IconMenu } from '@tabler/icons';
import RecipeFormPage from './components/RecipeForm';

import { useTheme } from '@mui/material/styles';

import { useLocation } from 'react-router-dom';

import {
  getAllRecipes
} from '../../redux/recipe/actions';

import { useRecipeData } from '../../contexts/RecipeDataContext'

const Recipes = () => {

  const { listRecipes, refreshData } = useRecipeData();

  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const [listRecipesAPI, setListRecipes] = useState([]);
  const [paginatedRecipes, setPaginatedRecipes] = useState([]);

  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;

  //Getion de paginas
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangePageSize = (event) => {
    setPageSize(event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getListRecipes();
  }, [location.pathname, listRecipes]);

  useEffect(() => {
    setArraysRecipeos(listRecipesAPI);
  }, [page, pageSize, listRecipesAPI]);

  const getListRecipes = async () => {
    const listRecipesReceive = Object.values(listRecipes);
    setListRecipes(listRecipesReceive);
  };

  const setArraysRecipeos = (listRecipesAPI) => {
    let listSlice = listRecipesAPI.slice(startIndex, endIndex);
    setListRecipes(listRecipesAPI);
    setPaginatedRecipes(listSlice);
  };

  const newRecipe = () => {
    navigate(`/recipesForm`);
  };

  const handleClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <Container>
      <Stack direction="row" flexShrink={0} sx={{ my: 4, width: '100%' }} justifyContent="flex-end">
        <IconButton
          size="large"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
          onClick={() => newRecipe()}
          sx={{
            ...(typeof anchorEl2 === 'object' && {
              color: 'primary.main',
            }),
          }}
        >
          <Badge variant="dot" color="primary">
            <IconLayoutGridAdd size="21" stroke="1.5" />
          </Badge>

        </IconButton>
      </Stack>
      <Grid container spacing={3}>
        {paginatedRecipes.map((recipe) => (
          <Grid key={recipe.id} xs={12} sm={6} md={3} onClick={(e) => handleClick(recipe)}>
            <RecipeCard key={recipe._id} recipe={recipe} />
          </Grid>
        ))}
      </Grid>
      <Stack direction="row" flexShrink={0} sx={{ my: 4, width: '100%' }} justifyContent="flex-end">
        <TablePagination
          component="div"
          count={listRecipesAPI.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangePageSize}
          rowsPerPageOptions={[20, 40, 60, 80, 100]}
        />
      </Stack>
    </Container>
  );
};

export default Recipes;
