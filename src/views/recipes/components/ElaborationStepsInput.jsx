import { Box, IconButton, Button, TextField, Typography, Paper, Stack } from '@mui/material';
import { useState } from 'react';
import { Add, DragIndicator } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DroppableComponent from 'src/components/droppable/droppable_component'

export default function ElaborationSteps({ onClose, setIdSteps }) {

  const [steps, setSteps] = useState(['','','']);

  const saveElaborationSteps = () => {
    setIdSteps([1]);

    onClose();
  }

  return (
    <Box sx={{ width: '100%', pl: 2 }}>
      <Typography variant="h5" gutterBottom>Steps</Typography>

      <Box sx={{ width: '100%', paddingBottom: '20px', paddingTop: '20px' }}>
        <DroppableComponent
          steps={steps}
          setSteps={(steps) => setSteps(steps)}
          title="List elaboration steps"
        />
      </Box>

      <Button variant="contained" color="primary" onClick={saveElaborationSteps}>
        Save steps
      </Button>
    </Box>
  );
}