import { Add, DragIndicator } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useLocation } from 'react-router-dom';
import { getAllUnits } from 'src/redux/units/actions'
import { useDispatch, useSelector } from 'react-redux';
import { getAllIngredients } from 'src/redux/ingredients/actions'
import IngredientFormFields from './IngredientFormFields'
import { setListCurrentIngredient, setGroupSpecify, setGroupList } from 'src/redux/assign_ingredients/actions'
import { IconTrash } from '@tabler/icons';
import { useState, useEffect } from 'react';
import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Box, Stack, Typography, IconButton, TextField, Chip, Paper } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useSnackbar } from 'src/components/snackbar/SnackbarProvider';

export default function AssignIngredientList({ title }) {

    const location = useLocation();
    const dispatch = useDispatch();
    const { showSnackbar } = useSnackbar();

    const [idIngredientDuplicated, setIdIngredientDuplicated] = useState(0);
    const [openError, setOpenError] = useState(false);

    const [groupInput, setGroupInput] = useState('');

    const modeWindowEditIngredientAPI = useSelector((state) => state.assignIngredientsComponent.modeWindowEditIngredient);
    const groupSpecifyAPI = useSelector((state) => state.assignIngredientsComponent.groupSpecify);
    const listIngredientsNewRecipesAPI = useSelector((state) => state.assignIngredientsComponent.listCurrentIngredients);
    const groupListAPI = useSelector((state) => state.assignIngredientsComponent.groupList);
    const errorListIngredientAPI = useSelector((state) => state.assignIngredientsComponent.errorListIngredient);
    const idIngredientErrorAPI = useSelector((state) => state.assignIngredientsComponent.idIngredientError);

    useEffect(() => {
        if (listIngredientsNewRecipesAPI !== undefined && modeWindowEditIngredientAPI == "edit" && groupListAPI.length == 0) {
            console.log("Mode edit is available")
            console.log(listIngredientsNewRecipesAPI)

            const uniqueGroups = [...new Set(listIngredientsNewRecipesAPI.map(item => item.group).filter(g => g != undefined && g?.trim() !== ""))];

            dispatch(setGroupList(uniqueGroups));
        }
    }, [listIngredientsNewRecipesAPI]);

    useEffect(() => {
        getListIngredients();
        getListUnits();
        if (Object.values(listIngredientsNewRecipesAPI).length == 0) {
            handleAdd();
        }
    }, [location.pathname]);

    useEffect(() => {
        setOpenError(errorListIngredientAPI)
        setIdIngredientDuplicated(idIngredientErrorAPI)
    }, [errorListIngredientAPI, idIngredientErrorAPI]);

    const getListUnits = async () => {
        const resultAction = await dispatch(getAllUnits());
    };

    const getListIngredients = async () => {
        const resultAction = await dispatch(getAllIngredients());
    };

    const handleAdd = () => {
        let listIngredientsNewRecipes = [...Object.values(listIngredientsNewRecipesAPI)]
        listIngredientsNewRecipes.push({
            name: "",
            quantity: 0,
            unit: ""
        })
        dispatch(setListCurrentIngredient(listIngredientsNewRecipes));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        let listIngredientsNewRecipes = [...Object.values(listIngredientsNewRecipesAPI)]
        const newIngredients = Array.from(listIngredientsNewRecipes);
        const [removed] = newIngredients.splice(result.source.index, 1);
        newIngredients.splice(result.destination.index, 0, removed);
        dispatch(setListCurrentIngredient(newIngredients));
    };

    const deleteIngredients = (indexToDelete) => {
        const currentIngredients = [...Object.values(listIngredientsNewRecipesAPI)];
        const newIngredients = currentIngredients.filter((_, index) => index !== indexToDelete);
        dispatch(setListCurrentIngredient(newIngredients));
    };

    const handleChange = (event) => {
        dispatch(setGroupSpecify(event.target.checked));
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && groupInput.trim() !== '') {
            event.preventDefault();
            if (!groupListAPI.includes(groupInput.trim())) {
                dispatch(setGroupList([...groupListAPI, groupInput.trim()]));
            }
            setGroupInput('');
        }
    };

    const handleDelete = (chipToDelete) => {
        let result = listIngredientsNewRecipesAPI.filter(element => element.group == chipToDelete);
        if (result.length != 0) {
            showSnackbar('The group trying to eliminate this is in some of the ingredients', 'error');
            return;
        }
        
        let resultUpdate = groupListAPI.filter((chip) => chip !== chipToDelete);
        dispatch(setGroupList(resultUpdate));
    };

    return (
        <Box>
            {modeWindowEditIngredientAPI == "new" && (
                <FormControlLabel control={
                    <Switch
                        checked={groupSpecifyAPI}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                } label="Especificar grupos" />
            )}

            {(groupSpecifyAPI || modeWindowEditIngredientAPI == "edit") && (
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Añadir grupo"
                        value={groupInput}
                        onChange={(e) => setGroupInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                        {groupListAPI.map((group, index) => (
                            <Chip
                                key={index}
                                label={group}
                                onDelete={() => handleDelete(group)}
                                sx={{ mb: 1 }}
                            />
                        ))}
                    </Stack>
                </Box>
            )}

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
                            {listIngredientsNewRecipesAPI.map((ingredient, index) => (
                                <Draggable key={`ingredient-key-${ingredient.name}-${index}`} draggableId={`ingredient-${ingredient.name}-${index}`} index={index}>
                                    {(provided) => (
                                        <Box>
                                            <Paper
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1 }}
                                            >
                                                <Box {...provided.dragHandleProps} sx={{ mr: 1 }}>
                                                    <DragIndicator />
                                                </Box>
                                                <IngredientFormFields
                                                    ingredient_recipe={ingredient}
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

                                            {/* ✅ Mensaje de error si hay ingrediente duplicado */}
                                            {openError && idIngredientDuplicated == ingredient?.ingredient?.id && (
                                                <Typography variant="body2" color="error" sx={{ ml: 4, mb: 1 }}>
                                                    The ingredient is duplicated
                                                </Typography>
                                            )}
                                        </Box>
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