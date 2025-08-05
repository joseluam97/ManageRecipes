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
    Skeleton,
    Stack
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
    COUNTRY_DEFAULT
} from 'src/utils/constant';

import { useEntityUtils } from '../../hooks/useEntityUtils';
import Menu1 from 'src/assets/images/menu/menu1.jpg';
import { useParams } from 'react-router-dom';
import { useRecipeData } from '../../contexts/RecipeDataContext';
import { getIngredientsByRecipe } from 'src/redux/ingredients/actions'
import { getListCountries } from 'src/utils/countries'
import { toTitleCase } from 'src/utils/format-text'
import { Edit } from '@mui/icons-material';

export default function RecipeView() {

    const { id } = useParams();
    const { getNameIngredient, getNameUnit, getNameType, getNameLevel, getNameOrder, getNameSource } = useEntityUtils();

    const { listRecipes, refreshData } = useRecipeData();
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
                        {recipe ? (
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<Edit />}
                                href={recipe?.link}
                                target="_blank"
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Edit
                            </Button>
                        ) : (
                            <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2, borderRadius: 1 }} />
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
                                    <Typography>{recipe?.type?.name}</Typography>
                                ) : (
                                    <Skeleton width="80%" />
                                )}
                            </Grid>

                            <Grid item xs={6} key={2}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Difficulty
                                </Typography>
                                {recipe ? (
                                    <Typography>{recipe?.difficulty?.name}</Typography>
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
                                    <Typography>{recipe?.order?.name}</Typography>
                                ) : (
                                    <Skeleton width="80%" />
                                )}
                            </Grid>

                            <Grid item xs={6} key={4}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Source
                                </Typography>
                                {recipe ? (
                                    <Typography>{recipe?.source?.name}</Typography>
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

                <Box display="flex" flexDirection="row" gap={5}>

                    {/* Ingredientes */}
                    <Box width="35%">
                        <Typography variant="h5" fontWeight="medium" gutterBottom>
                            Ingredients
                        </Typography>

                        {listIngredientsRecipe.length > 0 ? (
                            <Box display="flex" flexDirection="column" gap={2}>
                                {listIngredientsRecipe.map((grupoItem, grupoIdx) => (
                                    <Box key={grupoIdx} display="flex" flexDirection="column" gap={1}>
                                        {grupoItem.grupo != "" ? (
                                            <Typography variant="body1" fontWeight="bold">
                                                {grupoItem.grupo}
                                            </Typography>
                                        ) : <></>}

                                        {grupoItem.ingredientes.map((item, idx) => (
                                            <Paper
                                                key={grupoIdx + "-" + idx}
                                                elevation={1}
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: 'primary.main',
                                                            width: 24,
                                                            height: 24,
                                                            fontSize: 12,
                                                        }}
                                                    >
                                                        {item.ingredient?.name.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {toTitleCase(item?.ingredient?.name)}
                                                    </Typography>
                                                </Box>
                                                <Stack direction="row" spacing={1}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item.cuantity}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {toTitleCase(item?.unit?.name)}
                                                    </Typography>
                                                </Stack>
                                            </Paper>
                                        ))}
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Skeleton variant="rectangular" width="100%" height={100} />
                        )}

                    </Box>

                    {/* Elaboration steps */}
                    <Box width="65%">
                        <Typography variant="h5" fontWeight="medium" gutterBottom>
                            Elaboration
                        </Typography>
                        <Box component="ol" sx={{ pl: 3 }}>
                            {recipe ? (
                                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                    {recipe.elaboration.map((step, idx) => (
                                        <Box
                                            component="li"
                                            key={idx}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                mb: 1,
                                                listStyle: 'none',
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    bgcolor: 'primary.main',
                                                    width: 24,
                                                    height: 24,
                                                    fontSize: 12,
                                                }}
                                            >
                                                {idx + 1}
                                            </Avatar>
                                            <Typography variant="body2">{step}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                [1, 2, 3].map((i) => (
                                    <li key={i}>
                                        <Skeleton width="90%" />
                                    </li>
                                ))
                            )}
                        </Box>
                    </Box>

                </Box>

            </Paper>
        </Container>
    );

}
