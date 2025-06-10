import { Autocomplete, Box, IconButton, TextField, Typography, Paper, Stack, Badge } from '@mui/material';
import { Add, DragIndicator } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllUnits } from '../../redux/units/actions'
import { useDispatch, useSelector } from 'react-redux';
import { getAllIngredients, postIngredient } from 'src/redux/ingredients/actions'
import { IconPlus } from '@tabler/icons';
import { setListIngredientsNewRecipe } from '../../redux/recipe/actions'

export default function DetailsIngredients({ ingredient, index }) {

    const location = useLocation();
    const dispatch = useDispatch();

    const [nameIngredientCreate, setNameIngredientCreate] = useState('');
    const [unitSelected, setUnitSelected] = useState('');
    const [quantitySelected, setQuantitySelected] = useState('');

    const [ingredientSelected, setIngredientSelected] = useState(null);

    const [activateOptionCreateIngredient, setActivateOptionCreateIngredient] = useState(false);

    const listAllIngredientsAPI = useSelector((state) => state.ingredientsComponent.listAllIngredients);
    const listAllUnitsAPI = useSelector((state) => state.unitsComponent.listAllUnits);


    const listIngredientsNewRecipesAPI = useSelector((state) => state.recipesComponent.listIngredientsNewRecipes);

    const getValueAboutIntegredients = (value_fields) => {
        if (value_fields != undefined) {
            return value_fields;
        }
        return "";
    }

    const handleChange = (index, label, value) => {
        const newIngredients = [...Object.values(listIngredientsNewRecipesAPI)];

        if (newIngredients.length > index) {
            if (label == "name") {
                newIngredients[index] = {
                    name: value,
                    quantity: getValueAboutIntegredients(newIngredients[index].quantity),
                    unit: getValueAboutIntegredients(newIngredients[index].unit)
                };
            }
            else if (label == "quantity") {
                newIngredients[index] = {
                    name: getValueAboutIntegredients(newIngredients[index].name),
                    quantity: value,
                    unit: getValueAboutIntegredients(newIngredients[index].unit)
                };
            }
            else if (label == "units") {
                newIngredients[index] = {
                    name: getValueAboutIntegredients(newIngredients[index].name),
                    quantity: getValueAboutIntegredients(newIngredients[index].quantity),
                    unit: value
                };
            }
        }

        dispatch(setListIngredientsNewRecipe(newIngredients));
    };

    useEffect(() => {
        let listIngredientsNewRecipes = [...Object.values(listIngredientsNewRecipesAPI)];
        if (listIngredientsNewRecipes != undefined && listIngredientsNewRecipes.length != 0 && listIngredientsNewRecipes.length > index) {
            // There are values selected => name
            const listAllIngredients = Object.values(listAllIngredientsAPI);
            const posNameIngredient = listAllIngredients.findIndex(element => element.id === ingredient.name);

            setIngredientSelected(listAllIngredients[posNameIngredient]);

            handleChange(index, "name", listAllIngredients[posNameIngredient]?.id)

            // There are values selected => name
            setQuantitySelected(ingredient.quantity);

            handleChange(index, "quantity", ingredient?.quantity)

            // There are values selected => unit
            const listAllUnits = Object.values(listAllUnitsAPI);
            const posUnitIngredient = listAllUnits.findIndex(element => element.id === ingredient?.unit);
            setUnitSelected(listAllUnits[posUnitIngredient]);

            handleChange(index, "unit", listAllUnits[posUnitIngredient]?.id)
        }
    }, [location.pathname]);

    const createNewIngredients = async () => {
        console.log("-createNewIngredients-")
        console.log(nameIngredientCreate)

        if (nameIngredientCreate != "") {
            // Create new ingredients
            postNewIngredient();
        }
    };


    const postNewIngredient = async () => {
        const resultAction = await dispatch(postIngredient(nameIngredientCreate));
        if (postIngredient.fulfilled.match(resultAction)) {
            if (resultAction.payload != undefined) {
                const newIngredientsReceive = Object.values(resultAction.payload);

                // Update list ingredientes
                getListIngredients()
            }
        }
    };

    const getListIngredients = async () => {
        const resultAction = await dispatch(getAllIngredients());
        if (getAllIngredients.fulfilled.match(resultAction)) {
            if (resultAction.payload != undefined) {
                const listIngredientsReceive = Object.values(resultAction.payload);

                //Select the ingredients create
                const postNewElement = listIngredientsReceive.findIndex(element => element.name === nameIngredientCreate);
                console.log("-listIngredientsReceive[postNewElement]-")
                console.log(listIngredientsReceive[postNewElement])
                setIngredientSelected(listIngredientsReceive[postNewElement]);

                // Notify ListIngredients
                handleChange(index, "name", listIngredientsReceive[postNewElement].id)

                // Disable buton
                setActivateOptionCreateIngredient(false);
            }
        }
    };


    const filterIngredientsList = (options, state) => {

        if (state.inputValue != "") {
            const filtered = options.filter(option =>
                option.name.toLowerCase().includes(state.inputValue.toLowerCase())
            );

            if (filtered.length == 0) {
                setActivateOptionCreateIngredient(true);
            }
            else {
                setActivateOptionCreateIngredient(false);
            }
            return filtered;
        }
        else {
            setActivateOptionCreateIngredient(false);
            return options;
        }

    }

    return (
        <Box sx={{ width: '100%' }} display="flex" flexDirection="row" gap={2}>
            <Autocomplete
                options={Object.values(listAllIngredientsAPI)}
                value={ingredientSelected}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                noOptionsText="The option that you have searched not found. If you want add this ingredients, you must touch the add button. "
                fullWidth
                filterOptions={filterIngredientsList}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Name"
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                activateOptionCreateIngredient && <IconButton
                                    fullWidth
                                    color="inherit"
                                    aria-controls="msgs-menu"
                                    aria-haspopup="true"
                                    onClick={() => createNewIngredients()}
                                    sx={{
                                        ...(typeof anchorEl2 === 'object' && {
                                            color: 'primary.main',
                                            width: 24,
                                            height: 24,
                                        }),
                                    }}
                                >
                                    <IconPlus size="20" stroke="3.0" />

                                </IconButton>
                            )
                        }}
                    />
                )}
                onChange={(event, value) => {
                    setIngredientSelected(value)
                    handleChange(index, "name", value.id)
                }}
                onInputChange={(event, newInputValue) => {
                    setNameIngredientCreate(newInputValue);
                }}
            />

            <TextField
                fullWidth
                value={quantitySelected}
                placeholder="Quantity"
                type='number'
                onChange={(e) => {
                    setQuantitySelected(e.target.value)
                    handleChange(index, "quantity", e.target.value)
                }}
            />
            <Autocomplete
                fullWidth
                value={unitSelected}
                options={Object.values(listAllUnitsAPI)}
                getOptionLabel={(option) => option?.name ?? ''}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Unit"
                        fullWidth
                    />
                )}
                onChange={(event, value) => {
                    setUnitSelected(value)
                    handleChange(index, "units", value.id)
                }}
            />

        </Box>
    );
}