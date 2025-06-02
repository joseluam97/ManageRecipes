import { Box, IconButton, TextField, Typography, Paper, Stack } from '@mui/material';
import { useState } from 'react';
import { Add, DragIndicator } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function ElaborationStepsInput({ steps, setSteps }) {
    const handleAdd = () => {
        setSteps([...steps, '']);
    };

    const handleChange = (index, value) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
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
            <Stack direction="row" flexShrink={0} sx={{ my: 0, width: '100%' }} justifyContent="flex-start" alignItems= "center">
                <Typography variant="subtitle1" gutterBottom>Pasos de elaboración</Typography>
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
                                            <TextField
                                                fullWidth
                                                value={step}
                                                onChange={(e) => handleChange(index, e.target.value)}
                                            />
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