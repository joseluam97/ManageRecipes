import { Autocomplete, Box, IconButton, TextField, Typography, Paper, Stack } from '@mui/material';
import { Add, DragIndicator } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllUnits } from '../../redux/units/actions'
import { useDispatch, useSelector } from 'react-redux';

export default function DroppableComponentIngredients({ steps, setSteps, title }) {

    const location = useLocation();
    const dispatch = useDispatch();

    const [listUnits, setListUnits] = useState([]);

    useEffect(() => {
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

    const handleAdd = () => {
        setSteps([...steps, {
            name: "",
            quantity: 0,
            unit: ""
        }]);

    };

    const handleChange = (index, label, value) => {
        /*const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);*/

        console.log("-index-")
        console.log(index)
        console.log("-label-")
        console.log(label)
        console.log("-value-")
        console.log(value)
        
        console.log("-------------------")

        const newSteps = [...steps];

        if (newSteps.length > index) {
            console.log("-IN IF-")

            if (label == "name") {
                newSteps[index] = {
                    name: value,
                    quantity: newSteps[index].quantity,
                    unit: newSteps[index].unit
                };
            }
            else if (label == "quantity") {
                newSteps[index] = {
                    name: newSteps[index].name,
                    quantity: value,
                    unit: newSteps[index].unit
                };
            }
            else if (label == "units") {
                newSteps[index] = {
                    name: newSteps[index].name,
                    quantity: newSteps[index].quantity,
                    unit: value
                };
            }
        }

        setSteps(newSteps);

        console.log("-newSteps-")
        console.log(newSteps)
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const newSteps = Array.from(steps);
        const [removed] = newSteps.splice(result.source.index, 1);
        newSteps.splice(result.destination.index, 0, removed);
        setSteps(newSteps);
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
                            {steps.map((step, index) => (
                                <Draggable key={index} draggableId={`step-${index}`} index={index}>
                                    {(provided) => (
                                        <Paper
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1 }}
                                        >
                                            <Box {...provided.dragHandleProps} sx={{ mr: 1 }}>
                                                <DragIndicator />
                                            </Box>
                                            <Box {...provided.dragHandleProps} display="flex" flexDirection="row" gap={2}>
                                                <TextField
                                                    fullWidth
                                                    placeholder="Name"
                                                    value={step}
                                                    onChange={(e) => handleChange(index, "name", e.target.value)}
                                                />
                                                <TextField
                                                    fullWidth
                                                    placeholder="Quantity"
                                                    value={step}
                                                    type='number'
                                                    onChange={(e) => handleChange(index, "quantity", e.target.value)}
                                                />
                                                <Autocomplete
                                                    options={listUnits}
                                                    getOptionLabel={(option) => option.name}
                                                    //onChange={(e, newValue) => se}
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