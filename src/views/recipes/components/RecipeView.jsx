import {
    Container,
    Box,
    Typography,
    Divider,
    TextField,
    MenuItem,
    Button,
    Autocomplete,
    Avatar,
    Chip,
    Grid,
    Paper,
    Skeleton
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
    COUNTRY_DEFAULT
} from 'src/utils/constant';

import { useEntityUtils } from '../../../hooks/useEntityUtils';
import Menu1 from 'src/assets/images/menu/menu1.jpg';
import { useParams } from 'react-router-dom';
import { useRecipeData } from '../../../contexts/RecipeDataContext';
import { getIngredientsByRecipe } from '../../../redux/ingredients/actions'
import { getListCountries } from '../../../utils/countries'

export default function RecipeView() {

    const { id } = useParams();
    const { getNameIngredient, getNameUnit, getNameType, getNameLevel, getNameOrder, getNameSource } = useEntityUtils();

    const { listRecipes } = useRecipeData();
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState();
    const [listIngredientsRecipe, setListIngredientsRecipes] = useState([]);

    const [countries, setCountries] = useState([]);


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
            setListIngredientsRecipes(listIngredientsByRecipe)
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
                    <Grid item xs={12} md={4}>
                        {recipe ? (
                            <Box
                                component="img"
                                src={Menu1}
                                alt={recipe?.name}
                                sx={{ width: '100%', height: 'auto', borderRadius: 2 }}
                            />
                        ) : (
                            <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
                        )}
                        {recipe?.link ? (
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<LaunchIcon />}
                                href={recipe?.link}
                                target="_blank"
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Visit Link
                            </Button>
                        ) : (
                            <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2, borderRadius: 1 }} />
                        )}
                    </Grid>

                    {/* Información principal */}
                    <Grid item xs={12} md={8}>
                        {recipe ? (
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                {recipe.name}
                            </Typography>
                        ) : (
                            <Skeleton width="60%" height={40} />
                        )}

                        <Grid container spacing={2}>

                            <Grid item xs={6} key={1}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Type
                                </Typography>
                                {recipe ? (
                                    <Typography>{getNameType(recipe?.type)}</Typography>
                                ) : (
                                    <Skeleton width="80%" />
                                )}
                            </Grid>

                            <Grid item xs={6} key={2}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Difficulty
                                </Typography>
                                {recipe ? (
                                    <Typography>{getNameLevel(recipe?.difficulty)}</Typography>
                                ) : (
                                    <Skeleton width="80%" />
                                )}
                            </Grid>

                            <Grid item xs={6} key={3}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Country of origin
                                </Typography>
                                {recipe ? (
                                    <Box display="flex" gap={1}>
                                        <Avatar
                                            src={
                                                countries.find(c => c.label === recipe.country_origin)?.flag
                                            }
                                            sx={{ width: 24, height: 24, mr: 1 }}
                                        />
                                        <Typography>{recipe?.country_origin}</Typography>
                                    </Box>
                                ) : (
                                    <Skeleton width="80%" />
                                )}
                            </Grid>

                            <Grid item xs={6} key={4}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Preparation time
                                </Typography>
                                {recipe ? (
                                    <Typography>{recipe?.preparation_time ? `${recipe?.preparation_time} min` : ''}</Typography>
                                ) : (
                                    <Skeleton width="80%" />
                                )}
                            </Grid>

                            <Grid item xs={6} key={4}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Order
                                </Typography>
                                {recipe ? (
                                    <Typography>{getNameOrder(recipe?.order)}</Typography>
                                ) : (
                                    <Skeleton width="80%" />
                                )}
                            </Grid>

                            <Grid item xs={6} key={4}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Source
                                </Typography>
                                {recipe ? (
                                    <Typography>{getNameSource(recipe?.source)}</Typography>
                                ) : (
                                    <Skeleton width="80%" />
                                )}
                            </Grid>

                        </Grid>

                        {recipe ? (
                            <Box mt={3}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Tags
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                    {recipe.tag.map((tag, idx) => (
                                        <Chip
                                            key={idx}
                                            label={tag}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        ) : (
                            <Box mt={3}>
                                <Skeleton width="20%" />
                                <Box display="flex" gap={1} mt={1}>
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} variant="rounded" width={60} height={32} />
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* Ingredientes */}
                <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Ingredients
                    </Typography>

                    {listIngredientsRecipe.length > 0 ? (
                        <Grid container spacing={2}>
                            {listIngredientsRecipe.map((item, idx) => (
                                <Grid item xs={12} sm={6} md={3} key={idx}>
                                    <Paper elevation={1} sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: 14 }}>
                                            {getNameIngredient(item.ingredient).charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body1" fontWeight="medium">
                                                {getNameIngredient(item.ingredient)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {item.cuantity} {getNameUnit(item.unit)}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Skeleton variant="rectangular" width="100%" height={100} />
                    )}
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Elaboration steps */}
                <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Elaboration
                    </Typography>
                    <Box component="ol" sx={{ pl: 3 }}>
                        {recipe ? (
                            recipe.elaboration.map((step, idx) => (
                                <li key={idx}>
                                    <Typography>{step}</Typography>
                                </li>
                            ))
                        ) : (
                            [1, 2, 3].map((i) => (
                                <li key={i}>
                                    <Skeleton width="90%" />
                                </li>
                            ))
                        )}
                    </Box>
                </Box>

            </Paper>
        </Container>
    );

}
