import { Box, Button, Typography } from '@mui/material';
import ListSteps from 'src/views/elaboration/ListSteps'
import Label from 'src/components/label';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export default function ElaborationPanel({ onClose, setIdSteps }) {

  const [showValidationError, setShowValidationError] = useState(false);

  const listStepsNewRecipeAPI = useSelector((state) => state.recipesComponent.listStepsNewRecipes);

  const saveElaborationSteps = () => {

    if (!checkStepsValid()) {
      console.log("ERROR");
      setShowValidationError(true);
    }
    else {
      setIdSteps(Object.values(listStepsNewRecipeAPI));
      onClose();
    }
  }

  const checkStepsValid = () => {
    let listIngredients = Object.values(listStepsNewRecipeAPI);
    if (listIngredients.length === 0) return false;

    let searchBlank = listIngredients.filter(element => (element == "" || !element));

    if (searchBlank.length != 0) return false;

    return true;
  }

  return (
    <Box sx={{ width: '100%', pl: 2 }}>
      <Typography variant="h5" gutterBottom>Steps</Typography>

      <Box sx={{ width: '100%', paddingBottom: '20px', paddingTop: '20px' }}>
        <ListSteps
          title="List elaboration steps"
        />
      </Box>

      <Box sx={{ width: '100%', paddingBottom: '5px', paddingTop: '5px' }}>
        {showValidationError && (
          <Label
            variant="filled"
            color="red"
            sx={{
              top: 16,
              right: 16,
              color: '#ffffff',
            }}
          >
            Complete the steps fields
          </Label>
        )}
      </Box>

      <Button variant="contained" color="primary" onClick={saveElaborationSteps}>
        Save steps
      </Button>
    </Box>
  );
}