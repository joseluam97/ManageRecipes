import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import RecipeCard from './components/recipes-card';
import TablePagination from '@mui/material/TablePagination';

import { useTheme } from '@mui/material/styles';

import Typography from '@mui/material/Typography';

import {
  getAllRecipes
} from '../../redux/recipe/actions';

// ----------------------------------------------------------------------

const Recipes = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const [listRecipeos, setListRecipeos] = useState([]);
  const [paginatedRecipes, setPaginatedRecipes] = useState([]);

  const listRecipesZalando = [];

  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;

  //Getion de paginas
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangePageSize = (event) => {
    setPageSize(event.target.value);
    setPage(0); // Al cambiar el tamaño de la página, volvemos a la primera página
  };

  useEffect(() => {
  }, []);

  useEffect(() => {
    setArraysRecipeos(listRecipeos);
  }, [page, pageSize]);

  const setArraysRecipeos = (listRecipeos) => {
    let listSlice = listRecipeos.slice(startIndex, endIndex);
    setListRecipeos(listRecipeos);
    setPaginatedRecipes(listSlice);
  };

  useEffect(() => {
    if (listRecipesZalando.length !== 0) {
      setArraysRecipeos(listRecipesZalando);

      let precioMinimo = 0;
      let precioMaximo = 0;
      if (
        listRecipesZalando[0].precio_actual_talla !== '' &&
        listRecipesZalando[0].precio_actual_talla !== null &&
        listRecipesZalando[0].precio_actual_talla !== undefined
      ) {
        let preciosNumericos = [
          ...listRecipesZalando.map((recipeo) => recipeo.precio_actual_talla),
        ];
        precioMaximo = Math.max.apply(null, preciosNumericos);
        precioMinimo = Math.min.apply(null, preciosNumericos);
      }
    }
  }, [listRecipesZalando]);

  const handleClick = (recipe) => {
    // Redirigir a la URL específica del recipeo
    navigate(`/recipes/${recipe._id}`);
  };

  return (
    <Container>
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
          count={listRecipeos.length}
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
