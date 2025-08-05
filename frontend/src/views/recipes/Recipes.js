import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import RecipeCard from './components/recipes-card';
import TablePagination from '@mui/material/TablePagination';
import { Stack, IconButton, Badge, Button } from '@mui/material';
import { IconLayoutGridAdd } from '@tabler/icons';
import RecipeFormPage from './components/RecipeForm';
import { Add } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import { useLocation } from 'react-router-dom';

import {
  getAllRecipes
} from '../../redux/recipe/actions';

import { useRecipeData } from '../../contexts/RecipeDataContext'
import { launchProcess, getStateProcess } from '../../redux/ai_service/actions'

const Recipes = () => {

  const { listRecipes, refreshData } = useRecipeData();

  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const [listAllRecipes, setListAllRecipes] = useState([]);
  const [paginatedRecipes, setPaginatedRecipes] = useState([]);

  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;

  const [taskId, setTaskId] = useState(null);
  const [estadoTarea, setEstadoTarea] = useState(null);

  const newRecipeCreated = useSelector((state) => state.recipesComponent.createdNewRecipe);

  //Getion de paginas
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangePageSize = (event) => {
    setPageSize(event.target.value);
    setPage(0);
  };

  useEffect(() => {
    console.log("-execute-")
    getRecipes();
  }, [location.pathname, newRecipeCreated]);

  const getRecipes = async () => {
    const resultAction = await dispatch(getAllRecipes(newRecipe));
    if (getAllRecipes.fulfilled.match(resultAction)) {
      if (resultAction.payload != undefined) {
        const listRecipesReceive = Object.values(resultAction.payload);

        setListAllRecipes(listRecipesReceive);

        // Set details page
        let listSlice = listRecipesReceive.slice(startIndex, endIndex);
        setPaginatedRecipes(listSlice);

      }
    }
  }

  const newRecipe = () => {
    navigate(`/recipesForm`);
  };

  const handleClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`);
  };

  const getRecipeByIA = async () => {
    console.log("-getRecipeByIA-");
    const url_search = "https://www.tiktok.com/@comiendobienn/video/7518837827455552790";
    const resultAction = await dispatch(launchProcess(url_search));

    if (launchProcess.fulfilled.match(resultAction)) {
      const id_new_task = resultAction.payload;
      setTaskId(id_new_task); // Guarda el ID
    }
  };

  useEffect(() => {
    if (!taskId) return;

    console.log("-useEffect polling activado-");
    const interval = setInterval(async () => {
      const resultAction = await dispatch(getStateProcess(taskId));
      if (getStateProcess.fulfilled.match(resultAction)) {
        const estado = resultAction.payload;
        console.log("Estado actual:", estado);
        setEstadoTarea(estado);

        if (estado.estado === "SUCCESS" || estado.estado === "FAILURE") {
          console.log("RESULTADO");
          console.log(estado.resultado);
          clearInterval(interval); // Detén el polling
        }
      }
    }, 3000);

    return () => clearInterval(interval); // Limpieza al desmontar componente
  }, [taskId]);


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
        <IconButton onClick={getRecipeByIA} color="primary">
          <Add />
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
          count={listAllRecipes.length}
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
