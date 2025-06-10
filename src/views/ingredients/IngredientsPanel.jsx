import { Box, Button, Typography } from '@mui/material';
import ListIngredients from 'src/views/ingredients/ListIngredients'
import Label from 'src/components/label';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setListIngredientsNewRecipe } from '../../redux/recipe/actions'

export default function IngredientsPanel({ onClose, setIdIngredients }) {

  const location = useLocation();
  const dispatch = useDispatch();

  const [listIngredientsBackup, setListIngredientsBackup] = useState([]);
  const listIngredientsNewRecipesAPI = useSelector((state) => state.recipesComponent.listIngredientsNewRecipes);

  const [showValidationError, setShowValidationError] = useState(false);

  useEffect(() => {
    setListIngredientsBackup(Object.values(listIngredientsNewRecipesAPI))
  }, [location.pathname]);

  const cancelSave = () => {

    dispatch(setListIngredientsNewRecipe(listIngredientsBackup));
    onClose();

  }

  const saveIngredients = () => {

    if (!checkIngredientsValid()) {
      console.log("ERROR");
      setShowValidationError(true);
    }
    else {
      setIdIngredients(Object.values(listIngredientsNewRecipesAPI));
      onClose();
    }
  }

  const checkIngredientsValid = () => {
    let listIngredients = Object.values(listIngredientsNewRecipesAPI);
    if (listIngredients.length === 0) return false;

    for (let index in listIngredients) {
      if (
        !listIngredients[index].name ||
        !listIngredients[index].quantity ||
        !listIngredients[index].unit
      ) {
        return false;
      }
    }

    return true;
  }

  return (
    <Box sx={{ width: '100%', pl: 2 }}>
      <Typography variant="h5" gutterBottom>Ingredients</Typography>

      <Box sx={{ width: '100%', paddingBottom: '20px', paddingTop: '20px' }}>
        <ListIngredients
          title="List ingredients"
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
            Complete the ingredient fields
          </Label>
        )}
      </Box>

      <Button variant="contained" color="primary" onClick={saveIngredients}>
        Save ingredients
      </Button>
      <Button variant="contained" color="red" sx={{ marginLeft: 2, color: "#FFFFFF" }} onClick={cancelSave}>
        Cancel
      </Button>
    </Box>
  );
}
