import { Box, Button, Typography } from '@mui/material';
import AssignIngredientList from 'src/features/ingredients/assign-ingredients/AssignIngredientList'
import Label from 'src/components/label';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setListCurrentIngredient } from 'src/redux/assign_ingredients/actions'
import { TextField } from '@mui/material';
import { submitTextToRead } from 'src/utils/format-text'
import { postIngredient } from 'src/redux/ingredients/actions'
import { postUnit } from 'src/redux/units/actions'
import { useRecipeData } from 'src/contexts/RecipeDataContext'
import { setGroupList } from 'src/redux/assign_ingredients/actions'

export default function AssignIngredientsPanel({ onClose, setIdIngredients }) {

  const { refreshData } = useRecipeData();

  const [enterIngredientsManual, setEnterIngredientsManual] = useState(true);
  const [processReadIngredientEnd, setProcessReadIngredientEnd] = useState(false);

  const [errorListIngredients, setErrorListIngredients] = useState(false);
  const [delayRender, setDelayRender] = useState(false);
  const [textIngredient, setTextIngredient] = useState('');

  const location = useLocation();
  const dispatch = useDispatch();

  const [listIngredientsBackup, setListIngredientsBackup] = useState([]);
  const listIngredientsNewRecipesAPI = useSelector((state) => state.assignIngredientsComponent.listCurrentIngredients);

  const modeWindowEditIngredientAPI = useSelector((state) => state.assignIngredientsComponent.modeWindowEditIngredient);
  const errorListIngredientAPI = useSelector((state) => state.assignIngredientsComponent.errorListIngredient);
  const listAllIngredientsAPI = useSelector((state) => state.ingredientsComponent.listAllIngredients);
  const listAllUnitsAPI = useSelector((state) => state.unitsComponent.listAllUnits);

  const [showValidationError, setShowValidationError] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setDelayRender(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setErrorListIngredients(errorListIngredientAPI)
  }, [errorListIngredientAPI]);

  useEffect(() => {
    setListIngredientsBackup(Object.values(listIngredientsNewRecipesAPI))
  }, [location.pathname]);

  const cancelSave = () => {
    dispatch(setListCurrentIngredient([]));
    setIdIngredients(listIngredientsNewRecipesAPI);
    onClose();
    dispatch(setGroupList([]));
  }

  const saveIngredients = () => {

    if (!checkIngredientsValid()) {
      setShowValidationError(true);
    }
    else {
      let newListElement = [...listIngredientsNewRecipesAPI]
      setIdIngredients(newListElement);
      onClose();
      dispatch(setGroupList([]));
    }
  }

  const checkIngredientsValid = () => {
    let listIngredients = Object.values(listIngredientsNewRecipesAPI);

    if (listIngredients.length === 0) return false;

    for (let index in listIngredients) {
      if (listIngredients[index].name == "" ||
        listIngredients[index].quantity == "" ||
        listIngredients[index].quantity == 0 ||
        listIngredients[index].unit == ""
      ) {
        return false;
      }
    }

    return true;
  }

  const postNewIngredient = async (name_ingredient) => {
    const resultAction = await dispatch(postIngredient(name_ingredient));
    if (postIngredient.fulfilled.match(resultAction)) {
      if (resultAction.payload != undefined) {
        refreshData();
        const newIngredientsReceive = Object.values(resultAction.payload);

        return newIngredientsReceive
      }
    }
  };

  const postNewUnit = async (name_unit) => {
    const resultAction = await dispatch(postUnit(name_unit));
    if (postUnit.fulfilled.match(resultAction)) {
      if (resultAction.payload != undefined) {
        refreshData();
        const newUnitReceive = Object.values(resultAction.payload);

        return newUnitReceive
      }
    }
  };

  const readText = () => {
    let text_complete = submitTextToRead(textIngredient)

    const listCurrentIngredients = Object.values(listAllIngredientsAPI);
    const listCurrentUnits = Object.values(listAllUnitsAPI);

    let new_ingredients_created = 0;
    let new_units_created = 0;

    let newIngredientsByText = []
    for (let element in text_complete) {

      let ingredient_recipe = "";
      if (text_complete[element]["description"] != null && text_complete[element]["description"] != undefined && text_complete[element]["description"] != "") {
        let description_search = text_complete[element]["description"];
        let result_ingredient_search = listCurrentIngredients.filter(element => element.name == description_search)

        if (result_ingredient_search.length == 0) {
          // Create new ingredient
          ingredient_recipe = postNewIngredient(text_complete[element]["description"])
          new_ingredients_created = new_ingredients_created + 1;
        }
        else {
          // Set ingredient register
          ingredient_recipe = result_ingredient_search[0]
        }
      }

      let unit_recipe = "";
      if (text_complete[element]["unitOfMeasure"] != null && text_complete[element]["unitOfMeasure"] != undefined && text_complete[element]["unitOfMeasure"] != "") {
        let unit_search = text_complete[element]["unitOfMeasure"];
        let result_unit_search = listCurrentUnits.filter(element => element.name == unit_search)

        if (result_unit_search.length == 0) {
          // Create new ingredient
          unit_recipe = postNewUnit(text_complete[element]["unitOfMeasure"])
          new_units_created = new_units_created + 1;
        }
        else {
          // Set ingredient register
          unit_recipe = result_unit_search[0]
        }
      }

      // Create new element
      let update_element = {
        ingredient: ingredient_recipe,
        quantity: text_complete[element]["quantity"],
        unit: unit_recipe,
      };

      newIngredientsByText.push(update_element)
    }

    dispatch(setListCurrentIngredient(newIngredientsByText));

    setProcessReadIngredientEnd(true)

  }

  const changeMethodSubmitIngredient = () => {
    setShowValidationError(false)
    setEnterIngredientsManual(!enterIngredientsManual)
  }

  return (
    <Box sx={{ width: '100%', pl: 2 }}>
      <Typography variant="h5" gutterBottom>{modeWindowEditIngredientAPI == "edit" ? "Edit Ingredients" : "Add Ingredients"}</Typography>

      {modeWindowEditIngredientAPI == "new" && (
        <Button
          variant="contained"
          color="primary"
          target="_blank"
          onClick={changeMethodSubmitIngredient}
          sx={{ mt: 2, mb: 2 }}
        >
          {enterIngredientsManual == true ? "Enter ingredients manually" : "Enter ingredients using text"}
        </Button>
      )}

      {enterIngredientsManual == false && (
        <>
          <TextField
            label="Ingredients text"
            multiline
            rows={enterIngredientsManual == true || processReadIngredientEnd == true ? 5 : 20}
            value={textIngredient}
            onChange={(e) => setTextIngredient(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            color="primary"
            onClick={readText}
            sx={{ mt: 2, mb: 2 }}
          >
            Read
          </Button>
        </>
      )}

      {(enterIngredientsManual == true || processReadIngredientEnd == true) && (
        <Box sx={{ width: '100%', paddingBottom: '20px', paddingTop: '20px' }}>
          {delayRender && (
            <AssignIngredientList
              title="List ingredients"
            />
          )}
        </Box>
      )}

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

      {(enterIngredientsManual == true || processReadIngredientEnd == true) && (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={saveIngredients}
            disabled={errorListIngredients}
          >
            Save ingredients
          </Button>
          <Button
            variant="contained"
            color="red"
            sx={{ marginLeft: 2, color: "#FFFFFF" }}
            onClick={cancelSave}
          >
            Cancel
          </Button>
        </>
      )}
    </Box>
  );
}
