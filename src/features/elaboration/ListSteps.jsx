import { Box, IconButton, TextField, Typography, Paper, Stack } from '@mui/material';
import { Add, DragIndicator } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { setListStepsNewRecipe } from 'src/redux/recipe/actions'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { IconTrash } from '@tabler/icons';

export default function ListSteps({ title }) {

    const location = useLocation();
    const dispatch = useDispatch();

    const listStepsNewRecipeAPI = useSelector((state) => state.recipesComponent.listStepsNewRecipes);

    const listSteps = Object.values(listStepsNewRecipeAPI);

    useEffect(() => {
        if (listSteps.length == 0) {
            handleAdd();
        }
    }, [location.pathname]);

    const handleAdd = () => {
        let listStepsNewRecipe = [...Object.values(listStepsNewRecipeAPI)]
        listStepsNewRecipe.push('')
        dispatch(setListStepsNewRecipe(listStepsNewRecipe));
    };

    const handleChange = (index, value) => {
        const newSteps = [...listSteps];
        newSteps[index] = value;
        dispatch(setListStepsNewRecipe(newSteps));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const newSteps = Array.from(listSteps);
        const [removed] = newSteps.splice(result.source.index, 1);
        newSteps.splice(result.destination.index, 0, removed);
        dispatch(setListStepsNewRecipe(newSteps));
    };


    const deleteStep = (indexToDelete) => {
        const listSteps = [...Object.values(listStepsNewRecipeAPI)];
        const currentStep = listSteps.filter((_, index) => index !== indexToDelete);
        dispatch(setListStepsNewRecipe(currentStep));
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
                <Droppable droppableId="steps">
                    {(provided) => (
                        <Box ref={provided.innerRef} {...provided.droppableProps}>
                            {listSteps.map((step, index) => (
                                <Draggable key={`step-recipe-${index}`} draggableId={`step-${index}`} index={index}>
                                    {(provided) => (
                                        <Paper
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1 }}
                                        >
                                            <Box {...provided.dragHandleProps} sx={{ mr: 1 }}>
                                                <DragIndicator />
                                            </Box>
                                            <TextField
                                                fullWidth
                                                value={step}
                                                onChange={(e) => handleChange(index, e.target.value)}
                                            />

                                            <IconButton
                                                fullWidth
                                                color="inherit"
                                                aria-controls="msgs-menu"
                                                aria-haspopup="true"
                                                onClick={() => deleteStep(index)}
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