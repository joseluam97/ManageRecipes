import { Autocomplete, Box, IconButton, TextField, Typography, Paper, Stack, Badge } from '@mui/material';
import { Add, DragIndicator } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllUnits } from '../../redux/units/actions'
import { useDispatch, useSelector } from 'react-redux';
import { getAllIngredients } from 'src/redux/ingredients/actions'
import { IconLayoutGridAdd, IconMenu } from '@tabler/icons';

export default function DetailsIngredients({ listIngredients, listUnits, handleChange, index }) {

    const location = useLocation();
    const dispatch = useDispatch();

    const [nameIngredientCreate, setNameIngredientCreate] = useState('');

    const [ingredientSelected, setIngredientSelected] = useState(null);
    const [ingredientDisabled, setIngredientDisabled] = useState(false);

    const [activateOptionCreateIngredient, setActivateOptionCreateIngredient] = useState(false);

    useEffect(() => {

    }, [location.pathname]);

    const createNewIngredients = () => {
        console.log("-createNewIngredients-")
        console.log(nameIngredientCreate)

        // Create new ingredients

        // Update list ingredientes
        //getListIngredients();

        //Select the ingredients create
        //listIngredients.filter(element => element.)
        setIngredientSelected(listIngredients[1]);

        // Block the input
        setIngredientDisabled(true)
    };

    const filterIngredientsList = (options, state) => {

        const filtered = options.filter(option =>
            option.toLowerCase().includes(state.inputValue.toLowerCase())
        );

        if (filtered.length == 0) {
            setActivateOptionCreateIngredient(true);
        }
        else {
            setActivateOptionCreateIngredient(false);
        }

        return filtered;
    }

    return (
        <Box sx={{ width: '100%' }} display="flex" flexDirection="row" gap={2}>
            <Autocomplete
                options={listIngredients}
                value={ingredientSelected}
                disabled={ingredientDisabled}
                getOptionLabel={(option) => option}
                noOptionsText="The option that you have searched not found. If you want add this ingredients, you must touch the add button. "
                fullWidth
                freeSolo
                filterOptions={filterIngredientsList}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Name"
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                activateOptionCreateIngredient && <IconButton
                                    size="large"
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
                                    <Badge variant="dot" color="primary">
                                        <IconLayoutGridAdd size="12" stroke="1.0" />
                                    </Badge>

                                </IconButton>
                            )
                        }}
                    />
                )}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                onInputChange={(event, newInputValue) => {
                    setNameIngredientCreate(newInputValue);
                }}
            />

            <TextField
                sx={{ width: '100%' }}
                placeholder="Quantity"
                type='number'
                onChange={(e) => handleChange(index, "quantity", e.target.value)}
            />
            <Autocomplete
                sx={{ width: '100%' }}
                options={listUnits}
                getOptionLabel={(option) => option.units}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Unit"
                        fullWidth
                    />
                )}
                onChange={(e) => handleChange(index, "units", e.target.value)}
            />
        </Box>
    );
}