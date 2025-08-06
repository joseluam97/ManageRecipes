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
import { getIngredientsByRecipe } from 'src/redux/ingredients/actions'
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
    const [listIngredientsRecipe, setListIngredientsRecipes] = useState([]);

    const [countries, setCountries] = useState([]);

    const [editIngredients, setEditIngredients] = useState(false);
    const [editSteps, setEditSteps] = useState(false);

    useEffect(() => {
        getRecipeReceive();
        getListIngredientsByRecipe();

        // Get list Countries
        fetchCountries();
    }, [location.pathname, listRecipes]);


    const fetchCountries = async () => {
        const listCountries = await getListCountries();
        setCountries(listCountries);
    };

    const getListIngredientsByRecipe = async () => {
        const resultAction = await dispatch(getIngredientsByRecipe(id));
        if (getIngredientsByRecipe.fulfilled.match(resultAction) && resultAction.payload != undefined) {
            const listIngredientsByRecipe = Object.values(resultAction.payload);

            let pruebaIngredientes = [...listIngredientsByRecipe]

            const agrupado = pruebaIngredientes.reduce((acc, item) => {
                const grupo = item?.group?.name || '';
                if (!acc[grupo]) {
                    acc[grupo] = [];
                }
                acc[grupo].push(item);
                return acc;
            }, {});

            const grupos = Object.entries(agrupado).map(([grupo, items]) => ({
                grupo,
                ingredientes: items
            }));
            const list_groups = Object.values(grupos);

            const list_group_sort = [
                ...list_groups.filter(item => item.grupo === ""),
                ...list_groups.filter(item => item.grupo !== "")
            ];

            setListIngredientsRecipes(Object.values(list_group_sort))
        }
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
                            listIngredientsRecipe={listIngredientsRecipe}
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
