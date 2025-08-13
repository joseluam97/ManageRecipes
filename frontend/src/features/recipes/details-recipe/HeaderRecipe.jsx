import {
    Box,
    Button,
    Grid,
    Skeleton,
    CircularProgress
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import Menu1 from 'src/assets/images/menu/menu1.jpg';
import { Edit, Delete } from '@mui/icons-material';
import { deleteRecipe } from 'src/redux/recipe/actions'
import { useDispatch, useSelector } from 'react-redux';
import { getIngredientsByRecipe, deleteIngredientRecipe } from 'src/redux/ingredients/actions'
import { deleteGroup } from 'src/redux/groups/actions'
import { useNavigate } from 'react-router-dom';

export default function HeaderRecipe({ recipe, setRemoveInProgress }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const listIngredientsByRecipeAPI = useSelector((state) => state.ingredientsComponent.listIngredientsByRecipe);

    const handleDeleteRecipe = async () => {
        setRemoveInProgress(true);
        const listIngredientsRecipeToDelete = [...Object.values(listIngredientsByRecipeAPI)];
        const listGroupsDelete = getGroupsByRecipe();

        for (const ingredient of listIngredientsRecipeToDelete) {
            console.log("ID INGREDIENT: " + ingredient?.id)
            await removeIngredientRecipe(ingredient?.id)
        }

        for (const group of listGroupsDelete) {
            console.log("ID GROUP: " + group?.id)
            await removeGroup(group?.id)
        }


        console.log("ID RECIPE: " + recipe?.id)
        await removeRecipe(recipe?.id)
    }

    const removeRecipe = async (idRecipe) => {
        const resultDeleteRecipe = await dispatch(deleteRecipe(idRecipe));
        if (deleteRecipe.fulfilled.match(resultDeleteRecipe)) {
            if (resultDeleteRecipe.payload != undefined) {
                const idRecipeReceive = resultDeleteRecipe.payload;
                setRemoveInProgress(false);
                navigate(`/recipes`);
                return idRecipeReceive
            }
        }
    }

    const removeGroup = async (idGroup) => {
        const resultDeleteGroup = await dispatch(deleteGroup(idGroup));
        if (deleteGroup.fulfilled.match(resultDeleteGroup)) {
            if (resultDeleteGroup.payload != undefined) {
                const idGroupReceive = resultDeleteGroup.payload;
                return idGroupReceive
            }
        }
    }

    const removeIngredientRecipe = async (id_ingredient) => {
        const resultDeleteIngredient = await dispatch(deleteIngredientRecipe(id_ingredient));
        if (deleteIngredientRecipe.fulfilled.match(resultDeleteIngredient)) {
            if (resultDeleteIngredient.payload != undefined) {
                const ingredient_delete = resultDeleteIngredient.payload;
                return ingredient_delete
            }
        }
    }

    const getGroupsByRecipe = () => {
        const listIngredientsReceive = [...Object.values(listIngredientsByRecipeAPI)];

        const uniqueGroupsMap = new Map();

        listIngredientsReceive.forEach(item => {
            if (item.group) {
                uniqueGroupsMap.set(item.group.id, item.group);
            }
        });

        const uniqueGroups = Array.from(uniqueGroupsMap.values());

        return uniqueGroups;
    }


    return (
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
            {recipe ? (
                <Button
                    variant="contained"
                    color="red"
                    endIcon={<Delete />}
                    target="_blank"
                    fullWidth
                    onClick={handleDeleteRecipe}
                    sx={{ mt: 2, color: "#FFFFFF" }}
                >
                    Delete
                </Button>
            ) : (
                <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2, borderRadius: 1 }} />
            )}
        </Grid>
    );

}
