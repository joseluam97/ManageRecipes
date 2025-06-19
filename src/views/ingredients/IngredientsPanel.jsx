import { Box, Button, Typography } from '@mui/material';
import ListIngredients from 'src/views/ingredients/ListIngredients'
import Label from 'src/components/label';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setListIngredientsNewRecipe } from '../../redux/recipe/actions'
import { TextField } from '@mui/material';
import { parseIngredient } from 'parse-ingredient';
import { UNIT_MAP, SPECIAL_UNITS_ES, ADJECTIVES_ES } from '../../utils/constant';

export default function IngredientsPanel({ onClose, setIdIngredients }) {

  const [delayRender, setDelayRender] = useState(false);
  const [textIngredient, setTextIngredient] = useState('');

  const location = useLocation();
  const dispatch = useDispatch();

  const [listIngredientsBackup, setListIngredientsBackup] = useState([]);
  const listIngredientsNewRecipesAPI = useSelector((state) => state.recipesComponent.listIngredientsNewRecipes);

  const [showValidationError, setShowValidationError] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setDelayRender(true), 10);
    return () => clearTimeout(timeout);
  }, []);

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

  const translateUnits = (line) => {
    return line.replace(/\b([a-záéíóúñ]+)\b/gi, (match) => {
      const normalized = match.toLowerCase();
      return UNIT_MAP[normalized] || match;
    });
  };

  // Procesa líneas y arregla unidades especiales y descripción
  const fixSpecialUnitsAndDescription = ({ quantity, unitOfMeasureID, unitOfMeasure, description }) => {
    if (!description) return { quantity, unitOfMeasureID, unitOfMeasure, description };

    let words = description.trim().split(' ');
    if (words.length > 1) {
      const posibleUnidad = words[0].toLowerCase();
      if (SPECIAL_UNITS_ES[posibleUnidad]) {
        const unidad_en = SPECIAL_UNITS_ES[posibleUnidad];
        return {
          quantity,
          unitOfMeasureID: unidad_en,
          unitOfMeasure: unidad_en,
          description: cleanAdjectives(words.slice(1).join(' '))
        };
      }
    }

    // Si no es unidad especial, limpia adjetivos normales
    return {
      quantity,
      unitOfMeasureID,
      unitOfMeasure,
      description: cleanAdjectives(description)
    };
  };

  const removeInvisibleAndEmojis = (text) => {
    // elimina emojis
    let clean = text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
    // elimina caracteres no imprimibles al inicio (incluyendo zero-width spaces)
    clean = clean.replace(/^[^\S\r\n]+/, '');
    // elimina cualquier caracter Unicode invisible más específico (cero width spaces, etc)
    clean = clean.replace(/[\u200B-\u200D\uFEFF]/g, '');
    clean = clean.replace(/\uFE0F/g, ''); // elimina variation selector-16
    return clean.trim();
  };

  // Elimina adjetivos del nombre (por ejemplo "aguacate maduro" -> "aguacate")
  const cleanAdjectives = (text) => {
    let cleanText = text;
    ADJECTIVES_ES.forEach(adj => {
      // usar expresión regular para eliminar la frase adjetiva completa, ignorando mayúsculas
      const regex = new RegExp(`\\b${adj}\\b`, 'gi');
      cleanText = cleanText.replace(regex, '');
    });
    // luego limpiar espacios sobrantes
    return cleanText.trim().replace(/\s{2,}/g, ' ');
  };

  const sanitizeLine = (line) => {
    let clean = line.trim();

    clean = clean.replace(/^-+\s*/, '');  // elimina guiones al principio
    clean = clean.replace(/^[-•\u2022]+\s*/, '');  // elimina guiones, viñetas • y bullets Unicode al principio
    clean = removeInvisibleAndEmojis(clean);
    clean = clean.replace(/\(.*?\)/g, '');  // elimina paréntesis
    clean = clean.replace(/(\d)([a-zA-Z]+)/g, '$1 $2'); // inserta espacio entre número y unidad pegada
    clean = translateUnits(clean);          // traduce unidades
    clean = clean.replace(/\bde\b\s+/gi, ''); // elimina la palabra 'de'
    clean = clean.replace('.', ''); // elimina los puntos (.)
    clean = clean.trim();

    return clean;
  };

  const submitTextToRead = () => {
    const list_ingredients_parsed = textIngredient
      .split('\n')
      .map(sanitizeLine)
      .filter(line => line.length > 0)
      .filter(line => !line.match(/^[\w\s]+:$/)); // filtra encabezados como "Secos:"

    console.log("-TEXTO A PROCESAR-");
    console.log(list_ingredients_parsed);

    console.log("-INGREDIENTS-");
    list_ingredients_parsed.map(line => {
      let readLine = parseIngredient(line, { normalizeUOM: true })[0]

      if (readLine) {
        // arregla unidades especiales y adjetivos
        readLine = fixSpecialUnitsAndDescription(readLine);
      }

      console.log(readLine);
    }
    );
    console.log("-END INGREDIENTS-");

  }

  return (
    <Box sx={{ width: '100%', pl: 2 }}>
      <Typography variant="h5" gutterBottom>Ingredients</Typography>

      <TextField
        label="Descripción"
        multiline
        rows={20}
        value={textIngredient}
        onChange={(e) => setTextIngredient(e.target.value)}
        fullWidth
      />


      <Button variant="contained" color="primary" onClick={submitTextToRead}>
        Send
      </Button>


      <Box sx={{ width: '100%', paddingBottom: '20px', paddingTop: '20px' }}>
        {delayRender && (
          <ListIngredients title="List ingredients" />
        )}
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
