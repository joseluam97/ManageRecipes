import { Box, IconButton, Button, TextField, Typography, Paper, Stack } from '@mui/material';
import { useState } from 'react';
import { Add, DragIndicator } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function IngredientsPanel({ onClose }) {
  return (
    <Box sx={{ width: '100%', pl: 2 }}>
      <Typography variant="h5" gutterBottom>Ingredients</Typography>
      {/* Aquí podrías colocar un componente para gestionarlos */}
      <Button variant="contained" color="primary" onClick={onClose}>
        Save ingredients
      </Button>
    </Box>
  );
}