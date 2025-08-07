import {
    Container,
    Box,
    Divider,
    Grid,
    Paper,
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
import DetailsRecipe from 'src/features/recipes/details-recipe/DetailsRecipe'
import ListIngredientsRecipes from 'src/features/recipes/details-recipe/ListIngredientsRecipes'
import ListStepsRecipes from 'src/features/recipes/details-recipe/ListStepsRecipes'

export default function RecipeView() {

    const { id } = useParams();

    const { listRecipes } = useRecipeData();
    const location = useLocation();
    const dispatch = useDispatch();

    const [recipe, setRecipe] = useState();
    const [countries, setCountries] = useState([]);

    const [editIngredients, setEditIngredients] = useState(false);
    const [editSteps, setEditSteps] = useState(false);

    useEffect(() => {
        getRecipeReceive();

        // Get list Countries
        fetchCountries();
    }, [location.pathname, listRecipes]);


    const fetchCountries = async () => {
        const listCountries = await getListCountries();
        setCountries(listCountries);
    };


    const getRecipeReceive = () => {
        let listRecipesReceive = Object.values(listRecipes);
        let recipeSelected = listRecipesReceive.filter(element => element.id == id)[0]
        setRecipe(recipeSelected);
    };

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                <Grid container spacing={4}>

                    {/* Header */}
                    <HeaderRecipe
                        recipe={recipe}
                    />

                    {/* Información principal */}
                    <DetailsRecipe
                        recipe={recipe}
                        countries={countries}
                    />
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
        </Container>
    );

}
