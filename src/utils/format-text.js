import { parseIngredient } from 'parse-ingredient';
import { UNIT_MAP, SPECIAL_UNITS_ES, ADJECTIVES_ES } from '../utils/constant';

export function toLowerCaseSentence(str) {
  return str;
}

export function toTitleCase(str) {
  if (str != undefined) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return str
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
  clean = clean.replace(/[\u0000-\u001F\u007F-\u009F\u2000-\u200F\u2028-\u202F\u205F-\u206F]/g, '');
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

export const submitTextToRead = (textIngredient) => {
  const list_ingredients_parsed = textIngredient
    .split('\n')
    .map(sanitizeLine)
    .filter(line => line.length > 0)
    .filter(line => !line.match(/^[\w\s]+:$/)); // filtra encabezados como "Secos:"

  let list_complete = ""
  list_complete = list_ingredients_parsed.map(line => {
    let readLine = parseIngredient(line, { normalizeUOM: true })[0]

    if (readLine) {
      // arregla unidades especiales y adjetivos
      readLine = fixSpecialUnitsAndDescription(readLine);
    }

    console.log(readLine);
    return readLine
  });

  return list_complete

}