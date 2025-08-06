import { Add, DragIndicator } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useLocation } from 'react-router-dom';
import { getAllUnits } from 'src/redux/units/actions'
import { useDispatch, useSelector } from 'react-redux';
import { getAllIngredients } from 'src/redux/ingredients/actions'
import IngredientFormFields from './IngredientFormFields'
import { setListIngredientsNewRecipe } from 'src/redux/recipe/actions'
import { IconTrash } from '@tabler/icons';
import { useState, useEffect } from 'react';
import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Box, Stack, Typography, IconButton, TextField, Chip, Paper } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function AssignIngredientList({ title, setErrorListIngredients }) {

    const location = useLocation();
    const dispatch = useDispatch();

    const [idIngredientDuplicated, setIdIngredientDuplicated] = useState(0);
    const [openError, setOpenError] = useState(false);

    const [groupSpecify, setGroupSpecify] = React.useState(false);
    const [groupInput, setGroupInput] = useState('');
    const [groupList, setGroupList] = useState([]);

    const modeWindowEditIngredientAPI = useSelector((state) => state.ingredientsComponent.modeWindowEditIngredient);

    const listIngredientsNewRecipesAPI = useSelector((state) => state.recipesComponent.listIngredientsNewRecipes);

    const [listIngredients, setListIngredients] = useState([]);
    //const listIngredients = Object.values(listIngredientsNewRecipesAPI);

    useEffect(() => {
        if (listIngredients !== undefined) {
            // Solo actualiza si realmente ha cambiado el contenido
            let listIngredientsNewRecipesAPIFormated = Object.values(listIngredientsNewRecipesAPI);
            if (JSON.stringify(listIngredientsNewRecipesAPIFormated) !== JSON.stringify(listIngredients)) {
                dispatch(setListIngredientsNewRecipe(listIngredients));
            }

            if (modeWindowEditIngredientAPI == true) {
                console.log("Mode edit is available")
                console.log(listIngredientsNewRecipesAPIFormated)
                let listGroupsEdit = [];
                for (let index in listIngredientsNewRecipesAPIFormated) {
                    console.log("GROUP: " + index)
                    console.log(listIngredientsNewRecipesAPIFormated[index]?.group)
                    if (listIngredientsNewRecipesAPIFormated[index]?.group != "" && listIngredientsNewRecipesAPIFormated[index]?.group != undefined) {
                        listGroupsEdit.push(listIngredientsNewRecipesAPIFormated[index]?.group)
                    }
                }
                setGroupList(listGroupsEdit)

            }
        }
    }, [listIngredients]);

    useEffect(() => {
        getListIngredients();
        getListUnits();
        if (Object.values(listIngredientsNewRecipesAPI).length == 0) {
            handleAdd();
        }
        else {
            let listIngredients = Object.values(listIngredientsNewRecipesAPI)
            setListIngredients([...listIngredients])
        }
    }, [location.pathname]);

    useEffect(() => {
        let listIngredientsReceive = Object.values(listIngredientsNewRecipesAPI)
        if (listIngredientsReceive.length != 0) {
            setListIngredients(listIngredientsReceive)
        }
    }, [listIngredientsNewRecipesAPI]);

    const changeListIngredient = (ingredient, index) => {
        let current_elements = [...listIngredients]

        // Check if ingredients exits in list
        if (ingredient.ingredient != undefined) {
            let list_search_element = [...current_elements]
            let result_filter = list_search_element.filter((element, indice) => element?.ingredient?.id == ingredient?.ingredient?.id && indice != index)
            if (result_filter.length != 0) {
                // The ingredient is duplicated
                setIdIngredientDuplicated(ingredient.ingredient.id)
                setOpenError(true);
                setErrorListIngredients(true);
            }
            else {
                setIdIngredientDuplicated(0)
                setOpenError(false);
                setErrorListIngredients(false);
            }
        }
        // Add new ingredient
        current_elements[index] = ingredient

        setListIngredients(current_elements)
    };

    const getListUnits = async () => {
        const resultAction = await dispatch(getAllUnits());
    };

    const getListIngredients = async () => {
        const resultAction = await dispatch(getAllIngredients());
    };

    const handleAdd = () => {
        let listIngredientsNewRecipes = [...Object.values(listIngredients)]
        listIngredientsNewRecipes.push({
            name: "",
            quantity: 0,
            unit: ""
        })
        setListIngredients(listIngredientsNewRecipes);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        let listIngredientsNewRecipes = [...Object.values(listIngredients)]
        const newIngredients = Array.from(listIngredientsNewRecipes);
        const [removed] = newIngredients.splice(result.source.index, 1);
        newIngredients.splice(result.destination.index, 0, removed);
        setListIngredients(newIngredients);
        //dispatch(setListIngredientsNewRecipe(newIngredients));
    };

    const deleteIngredients = (indexToDelete) => {
        const currentIngredients = [...Object.values(listIngredients)];
        const newIngredients = currentIngredients.filter((_, index) => index !== indexToDelete);
        setListIngredients(newIngredients);
        //dispatch(setListIngredientsNewRecipe(newIngredients));
    };

    const handleChange = (event) => {
        setGroupSpecify(event.target.checked);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && groupInput.trim() !== '') {
            event.preventDefault();
            if (!groupList.includes(groupInput.trim())) {
                setGroupList([...groupList, groupInput.trim()]);
            }
            setGroupInput('');
        }
    };

    const handleDelete = (chipToDelete) => {
        setGroupList((chips) => chips.filter((chip) => chip !== chipToDelete));
    };

    return (
        <Box>
            {modeWindowEditIngredientAPI == false && (
                <FormControlLabel control={
                    <Switch
                        checked={groupSpecify}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                } label="Especificar grupos" />
            )}

            {(groupSpecify || modeWindowEditIngredientAPI == true) && (
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
                        {groupList.map((group, index) => (
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
                            {listIngredients.map((ingredient, index) => (
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
                                                    changeListIngredient={changeListIngredient}
                                                    groupSpecify={groupSpecify}
                                                    groupList={groupList}
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