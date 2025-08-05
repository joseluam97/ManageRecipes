import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const IngredientsRecipeDialog = ({ open, onClose, ingredientsData }) => {
  const navigate = useNavigate();

  const handleGoToRecipe = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Recipes in which the ingredient has been found</DialogTitle>

      <DialogContent dividers>
        <List>
          {ingredientsData.map((item, index) => {
            const { recipe } = item;

            return (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography variant="h6">
                        {recipe.id} - {recipe.name}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        component="a"
                        href={recipe.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: 'primary.main' }}
                      >
                        {recipe.link}
                      </Typography>
                    }
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleGoToRecipe(recipe.id)}
                  >
                    Ver receta
                  </Button>
                </ListItem>
                {index < ingredientsData.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IngredientsRecipeDialog;
