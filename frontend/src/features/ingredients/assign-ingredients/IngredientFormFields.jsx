import { Autocomplete, Box, IconButton, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IconPlus } from '@tabler/icons';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { setListCurrentIngredient, setErrorListIngredient, setIdIngredientError } from 'src/redux/assign_ingredients/actions'
import { postNewIngredient, getListIngredients } from 'src/services/ingredientService'

export default function IngredientFormFields(
    { ingredient_recipe, index }
) {

    const location = useLocation();
    const dispatch = useDispatch();

    const [nameIngredientCreate, setNameIngredientCreate] = useState('');

    const [activateOptionCreateIngredient, setActivateOptionCreateIngredient] = useState(false);

    const listAllIngredientsAPI = useSelector((state) => state.ingredientsComponent.listAllIngredients);
    const listAllUnitsAPI = useSelector((state) => state.unitsComponent.listAllUnits);
    const modeWindowEditIngredientAPI = useSelector((state) => state.assignIngredientsComponent.modeWindowEditIngredient);
    const groupSpecifyAPI = useSelector((state) => state.assignIngredientsComponent.groupSpecify);
    const groupListAPI = useSelector((state) => state.assignIngredientsComponent.groupList);
    const listIngredientsNewRecipesAPI = useSelector((state) => state.assignIngredientsComponent.listCurrentIngredients);

    const addIngredientInList = (ingredient, index) => {
        let current_elements = [...listIngredientsNewRecipesAPI]

        // Check if ingredients exits in list
        if (ingredient.ingredient != undefined) {
            let list_search_element = [...current_elements]
            let result_filter = list_search_element.filter((element, indice) => element?.ingredient?.id == ingredient?.ingredient?.id && indice != index)
            if (result_filter.length != 0) {
                // The ingredient is duplicated
                dispatch(setIdIngredientError(ingredient.ingredient.id))
                dispatch(setErrorListIngredient(true));
            }
            else {
                dispatch(setIdIngredientError(0))
                dispatch(setErrorListIngredient(false));
            }
        }
        console.log("-ingredient-")
        console.log(ingredient)
        // Add new ingredient
        current_elements[index] = ingredient

        dispatch(setListCurrentIngredient(current_elements));
    }

    const handleChangeIngredient = (index, value) => {

        let update_element = {
            ingredient: value,
            quantity: ingredient_recipe.quantity,
            unit: ingredient_recipe.unit,
            group: ingredient_recipe.group != undefined ? ingredient_recipe.group : ""
        };

        addIngredientInList(update_element, index)

    }
    const handleChangeQuantity = (index, value) => {

        let update_element = {
            id: ingredient_recipe.id != undefined ? ingredient_recipe.id : "",
            ingredient: ingredient_recipe.ingredient,
            quantity: value,
            unit: ingredient_recipe.unit,
            group: ingredient_recipe.group != undefined ? ingredient_recipe.group : ""
        };

        addIngredientInList(update_element, index)
    }
    const handleChangeUnit = (index, value) => {

        let update_element = {
            id: ingredient_recipe.id != undefined ? ingredient_recipe.id : "",
            ingredient: ingredient_recipe.ingredient,
            quantity: ingredient_recipe.quantity,
            unit: value,
            group: ingredient_recipe.group != undefined ? ingredient_recipe.group : ""
        };

        addIngredientInList(update_element, index)
    }

    const handleChangeGroup = (index, event) => {

        const value = event.target.value;
        let update_element = {
            id: ingredient_recipe.id != undefined ? ingredient_recipe.id : "",
            ingredient: ingredient_recipe.ingredient,
            quantity: ingredient_recipe.quantity,
            unit: ingredient_recipe.unit,
            group: value
        };

        addIngredientInList(update_element, index)
    }

    const createNewIngredients = async () => {
        if (nameIngredientCreate != "") {
            // Create new ingredients
            let result_new_ingredient = await postNewIngredient(nameIngredientCreate, dispatch);

            // Update list ingredientes
            let listIngredientsReceive = await getListIngredients(dispatch);

            //Select the ingredients create
            const postNewElement = listIngredientsReceive.findIndex(element => element.name === nameIngredientCreate);

            // Notify AssignIngredientList
            handleChangeIngredient(index, listIngredientsReceive[postNewElement])

            // Disable buton
            setActivateOptionCreateIngredient(false);
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
                value={ingredient_recipe?.ingredient || null}
                getOptionLabel={(option) => option?.name ?? ''}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                noOptionsText="The option that you have searched not found..."
                fullWidth
                filterOptions={filterIngredientsList}
                sx={{ width: groupSpecifyAPI || modeWindowEditIngredientAPI === "edit" ? '40%' : '45%' }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Name"
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                activateOptionCreateIngredient && (
                                    <IconButton
                                        color="inherit"
                                        aria-controls="msgs-menu"
                                        aria-haspopup="true"
                                        onClick={createNewIngredients}
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
                            ),
                        }}
                    />
                )}
                onChange={(event, value) => handleChangeIngredient(index, value)}
                onInputChange={(event, newInputValue) => setNameIngredientCreate(newInputValue)}
            />

            <TextField
                label="Quantity"
                value={ingredient_recipe?.quantity || ''}
                placeholder="Quantity"
                type='number'
                sx={{ width: groupSpecifyAPI || modeWindowEditIngredientAPI === "edit" ? '10%' : '25%' }}
                onChange={(e) => handleChangeQuantity(index, e.target.value)}
            />

            <Autocomplete
                value={ingredient_recipe?.unit || null}
                options={Object.values(listAllUnitsAPI)}
                getOptionLabel={(option) => option?.name ?? ''}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                renderInput={(params) => (
                    <TextField {...params} label="Unit" />
                )}
                sx={{ width: groupSpecifyAPI || modeWindowEditIngredientAPI === "edit" ? '20%' : '30%' }}
                onChange={(event, value) => handleChangeUnit(index, value)}
            />

            {(groupSpecifyAPI === true || modeWindowEditIngredientAPI === "edit") && (
                <FormControl sx={{ width: '30%' }}>
                    <InputLabel id="demo-multiple-name-label">Group</InputLabel>
                    <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        value={ingredient_recipe?.group || ''}
                        onChange={(event) => handleChangeGroup(index, event)}
                        input={<OutlinedInput label="Group" />}
                    >
                        {groupListAPI?.map((name) => (
                            <MenuItem key={name} value={name}>
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
        </Box>

    );
}