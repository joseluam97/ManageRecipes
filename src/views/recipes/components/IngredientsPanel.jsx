import { Box, IconButton, Button, TextField, Typography, Paper, Stack } from '@mui/material';
import { useState } from 'react';
import { Add, DragIndicator } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DroppableComponentIngredients from 'src/components/droppable/droppable_component_ingredients'

export default function IngredientsPanel({ onClose, setIdIngredients }) {

  const [steps, setSteps] = useState(['', '', '']);

  const saveIngredients = () => {

    steps.map(element => {
      setIdIngredients({
        name: "ig1",
        quantity: 1,
        units: "Kg"
      });
    })

    onClose();
  }

  return (
    <Box sx={{ width: '100%', pl: 2 }}>
      <Typography variant="h5" gutterBottom>Ingredients</Typography>

      <Box sx={{ width: '100%', paddingBottom: '20px', paddingTop: '20px' }}>
        <DroppableComponentIngredients
          steps={steps}
          setSteps={(steps) => setSteps(steps)}
          title="List ingredients"
        />
      </Box>

      <Button variant="contained" color="primary" onClick={saveIngredients}>
        Save ingredients
      </Button>
    </Box>
  );
}