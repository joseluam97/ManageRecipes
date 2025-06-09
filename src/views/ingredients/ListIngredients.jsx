import { Autocomplete, Box, IconButton, TextField, Typography, Paper, Stack, Badge } from '@mui/material';
import { Add, DragIndicator } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllUnits } from '../../redux/units/actions'
import { useDispatch, useSelector } from 'react-redux';
import { getAllIngredients } from 'src/redux/ingredients/actions'
import { IconLayoutGridAdd, IconMenu } from '@tabler/icons';
import DetailsIngredients from './DetailsIngredients'
export default function ListIngredients({ ingredients, setIngredients, title }) {

    const location = useLocation();
    const dispatch = useDispatch();

    const [nameIngredientCreate, setNameIngredientCreate] = useState('');

    const [ingredientSelected, setIngredientSelected] = useState(null);
    const [ingredientDisabled, setIngredientDisabled] = useState(false);

    const [listUnits, setListUnits] = useState([]);
    const [listIngredients, setListIngredients] = useState([]);
    const [activateOptionCreateIngredient, setActivateOptionCreateIngredient] = useState(false);

    useEffect(() => {
        getListIngredients();
        getListUnits();
    }, [location.pathname]);


    const getListUnits = async () => {
        const resultAction = await dispatch(getAllUnits());
        if (getAllUnits.fulfilled.match(resultAction)) {
            if (resultAction.payload != undefined) {
                const listUnitsReceive = Object.values(resultAction.payload);
                setListUnits(listUnitsReceive);

                console.log("-listUnitsReceive-");
                console.log(listUnitsReceive);
            }
        }
    };

    const getListIngredients = async () => {
        const resultAction = await dispatch(getAllIngredients());
        if (getAllIngredients.fulfilled.match(resultAction)) {
            if (resultAction.payload != undefined) {
                const listIngredientsReceive = Object.values(resultAction.payload);
                setListIngredients(listIngredientsReceive);

                console.log("-listIngredientsReceive-");
                console.log(listIngredientsReceive);
            }
            else {
                const listStaticIngredients = ["Lechuga", "Patata", "Ajo"]
                console.log("-listStaticIngredients-");
                console.log(listStaticIngredients);
                setListIngredients(listStaticIngredients);
            }
        }
        else {
            const listStaticIngredients = ["Lechuga", "Patata", "Ajo"]
            console.log("-listStaticIngredients-");
            console.log(listStaticIngredients);
            setListIngredients(listStaticIngredients);
        }
    };

    const handleAdd = () => {
        setIngredients([...ingredients, {
            name: "",
            quantity: 0,
            unit: ""
        }]);

    };

    const getValueAboutIntegredients = (value_fields) => {
        if (value_fields != undefined) {
            return value_fields;
        }
        return "";
    }

    const handleChange = (index, label, value) => {
        const newIngredients = [...ingredients];

        if (newIngredients.length > index) {
            console.log("-IN IF-")

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

        setIngredients(newIngredients);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const newIngredients = Array.from(ingredients);
        const [removed] = newIngredients.splice(result.source.index, 1);
        newIngredients.splice(result.destination.index, 0, removed);
        setIngredients(newIngredients);
    };

    const createNewIngredients = () => {
        console.log("-createNewIngredients-")
        console.log(nameIngredientCreate)

        // Create new ingredients

        // Update list ingredientes
        getListIngredients();

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
                            {ingredients.map((ingredient, index) => (
                                <Draggable key={index} draggableId={`ingredient-${index}`} index={index}>
                                    {(provided) => (
                                        <Paper
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1 }}
                                        >
                                            <Box {...provided.dragHandleProps} sx={{ mr: 1 }}>
                                                <DragIndicator />
                                            </Box>
                                            {/*<Box {...provided.dragHandleProps}>*/}
                                                <DetailsIngredients
                                                    listIngredients={listIngredients}
                                                    listUnits={listUnits}
                                                    handleChange={handleChange}
                                                    index={index}
                                                />
                                            {/*</Box>*/}
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