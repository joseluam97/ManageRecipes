import { Autocomplete, Box, IconButton, TextField, Typography, Paper, Stack, Badge } from '@mui/material';
import { Add, DragIndicator } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllUnits } from '../../redux/units/actions'
import { useDispatch, useSelector } from 'react-redux';
import { getAllIngredients } from 'src/redux/ingredients/actions'
import DetailsIngredients from './DetailsIngredients'
import { setListIngredientsNewRecipe } from '../../redux/recipe/actions'
import { IconTrash } from '@tabler/icons';

export default function ListIngredients({ title }) {

    const location = useLocation();
    const dispatch = useDispatch();

    const listIngredientsNewRecipesAPI = useSelector((state) => state.recipesComponent.listIngredientsNewRecipes);

    const listIngredients = Object.values(listIngredientsNewRecipesAPI);

    useEffect(() => {
        getListIngredients();
        getListUnits();
        if (Object.values(listIngredientsNewRecipesAPI).length == 0) {
            handleAdd();
        }
    }, [location.pathname]);

    const getListUnits = async () => {
        const resultAction = await dispatch(getAllUnits());
        console.log("-getListUnits-")
        console.log(resultAction)
    };

    const getListIngredients = async () => {
        const resultAction = await dispatch(getAllIngredients());
        console.log("-getListIngredients-")
        console.log(resultAction)
    };

    const handleAdd = () => {
        let listIngredientsNewRecipes = [...Object.values(listIngredientsNewRecipesAPI)]
        listIngredientsNewRecipes.push({
            name: "",
            quantity: 0,
            unit: ""
        })
        dispatch(setListIngredientsNewRecipe(listIngredientsNewRecipes));

    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        let listIngredientsNewRecipes = [...Object.values(listIngredientsNewRecipesAPI)]
        const newIngredients = Array.from(listIngredientsNewRecipes);
        const [removed] = newIngredients.splice(result.source.index, 1);
        newIngredients.splice(result.destination.index, 0, removed);
        dispatch(setListIngredientsNewRecipe(newIngredients));
    };

    const deleteIngredients = (indexToDelete) => {
        const currentIngredients = [...Object.values(listIngredientsNewRecipesAPI)];
        const newIngredients = currentIngredients.filter((_, index) => index !== indexToDelete);
        dispatch(setListIngredientsNewRecipe(newIngredients));
    };

    return (
        <Box>
            <Stack direction="row" flexShrink={0} sx={{ my: 0, width: '100%' }} justifyContent="flex-start" alignItems="center">
                <Typography variant="subtitle1" gutterBottom>{title}</Typography>
                <IconButton onClick={handleAdd} color="primary">
                    <Add />
                </IconButton>
            </Stack>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="ingredients">
                    {(provided) => (
                        <Box ref={provided.innerRef} {...provided.droppableProps}>
                            {listIngredients.map((ingredient, index) => (
                                <Draggable key={ingredient.name} draggableId={`ingredient-${ingredient.name}`} index={index}>
                                    {(provided) => (
                                        <Paper
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1 }}
                                        >
                                            <Box {...provided.dragHandleProps} sx={{ mr: 1 }}>
                                                <DragIndicator />
                                            </Box>
                                            <DetailsIngredients
                                                ingredient={ingredient}
                                                index={index}
                                            />
                                            <IconButton
                                                fullWidth
                                                color="inherit"
                                                aria-controls="msgs-menu"
                                                aria-haspopup="true"
                                                onClick={() => deleteIngredients(index)}
                                                sx={{
                                                    ...(typeof anchorEl2 === 'object' && {
                                                        color: 'primary.main',
                                                        width: 24,
                                                        height: 24,
                                                    }),
                                                }}
                                            >
                                                <IconTrash size="20" stroke="1.0" />

                                            </IconButton>
                                        </Paper>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    );
}