import {
    Container,
    Box,
    Divider,
    Grid,
    Paper,
    CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useEntityUtils } from '../../hooks/useEntityUtils';
import { useParams } from 'react-router-dom';
import { useRecipeData } from '../../contexts/RecipeDataContext';
import { getListCountries } from 'src/utils/countries'
import HeaderRecipe from 'src/features/recipes/details-recipe/HeaderRecipe'
import EditDetailsRecipe from 'src/features/recipes/details-recipe/EditDetailsRecipe'
import DetailsRecipe from 'src/features/recipes/details-recipe/DetailsRecipe'
import ListIngredientsRecipes from 'src/features/recipes/details-recipe/ListIngredientsRecipes'
import ListStepsRecipes from 'src/features/recipes/details-recipe/ListStepsRecipes'
import {getRecipe} from 'src/services/recipeService'

export default function RecipeView() {

    const { id } = useParams();

    const { listRecipes, refreshData } = useRecipeData();
    const location = useLocation();
    const dispatch = useDispatch();

    const [recipe, setRecipe] = useState();
    const [countries, setCountries] = useState([]);
    
    const [removeInProgress, setRemoveInProgress] = useState(false);
    const [editRecipe, setEditRecipe] = useState(false);
    const [editIngredients, setEditIngredients] = useState(false);
    const [editSteps, setEditSteps] = useState(false);

    useEffect(() => {
        getRecipeReceive();

        // Get list Countries
        fetchCountries();
    }, [location.pathname, listRecipes]);

    useEffect(() => {
        refreshData();

        getRecipeReceive();
    }, [editRecipe]);

    const fetchCountries = async () => {
        const listCountries = await getListCountries();
        setCountries(listCountries);
    };

    const getRecipeReceive = async () => {
        /*let listRecipesReceive = Object.values(listRecipes);
        let recipeSelected = listRecipesReceive.filter(element => element.id == id)[0]
        setRecipe(recipeSelected);*/
        let recipeSelected = await getRecipe(Number(id), dispatch);
        console.log("-recipeSelected-")
        console.log(recipeSelected)
        setRecipe(recipeSelected);
    };

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                <Grid container spacing={4}>
                    {/* Mode edit details */}
                    {editRecipe && (
                        <EditDetailsRecipe
                            recipe={recipe}
                            countries={countries}
                            setEditRecipe={setEditRecipe}
                        />
                    )}

                    {/* Header */}
                    {!editRecipe && (
                        <HeaderRecipe
                            recipe={recipe}
                            setRemoveInProgress={setRemoveInProgress}
                        />
                    )}

                    {/* Información principal */}
                    {!editRecipe && (
                        <DetailsRecipe
                            recipe={recipe}
                            countries={countries}
                            setEditRecipe={setEditRecipe}
                        />
                    )}
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Box display="flex" flexDirection="row" gap={5}>

                    {/* Ingredientes */}
                    {!editSteps && (
                        <ListIngredientsRecipes
                            id_recipe={id}
                            setEditIngredients={setEditIngredients}
                        />
                    )}

                    {/* Elaboration steps */}
                    {!editIngredients && (
                        <ListStepsRecipes
                            recipe={recipe}
                            setEditSteps={setEditSteps}
                        />
                    )}


                </Box>

            </Paper>

            {/* Overlay con spinner */}
  {removeInProgress && (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'rgba(255,255,255,0.6)', // semitransparente
        zIndex: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'all', // bloquea interacción debajo
        borderRadius: 4,
      }}
    >
      <CircularProgress />
    </Box>
  )}
        </Container>
    );

}
