import axios from 'axios';
import { createAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabase";
import {toLowerCaseSentence} from "../../utils/format-text"

import {
  GET_ALL_INGREDIENTS,
  POST_INGREDIENT,
  POST_INGREDIENTS_RECIPE,
  GET_INGREDIENTS_BY_RECIPE,
  INIT_VALUE,
} from './types';

export const initValue = createAction(INIT_VALUE);

export const getIngredientsByRecipe = createAsyncThunk(
  GET_INGREDIENTS_BY_RECIPE,
  async (idRecipe, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('Ingredients_recipes')
        .select(`
          id,
          cuantity,
          unit:Units(*),
          recipe,
          ingredient:Ingredients(*),
          group (
            id,
            name
          )
        `)
        .eq('recipe', idRecipe)
        .order('id', { ascending: false });

      if (error) {
        return rejectWithValue(error.message);
      }

      return data || [];

    } catch (error) {
      return rejectWithValue(error.message || "Error inesperado");
    }
  }
);

export const getAllIngredients = createAsyncThunk(
  GET_ALL_INGREDIENTS,
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('Ingredients')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        return rejectWithValue(error.message);
      }

      return data || [];

    } catch (error) {
      return rejectWithValue(error.message || "Error inesperado");
    }
  }
);

export const postIngredient = createAsyncThunk(
  POST_INGREDIENT,
  async (name_ingredient, { rejectWithValue }) => {

    let name_ingredient_formatted = toLowerCaseSentence(name_ingredient);

    const newIngredient = {
      name: name_ingredient_formatted,
    };

    try {
      // Hacer el insert en Supabase
      const { data, error } = await supabase
        .from('Ingredients')
        .insert([newIngredient])
        .select()
        .single();

      if (error) {
        console.log("ERROR:");
        console.log(error.message);
        return rejectWithValue(error.message);
      }

      // Opcional: Puedes hacer algo con la respuesta, como agregar el mensaje a la lista localmente
      console.log("Mensaje enviado:", data);

      return data;

    } catch (error) {
      return rejectWithValue(error.message || "Error when you created a new ingredients");
    }
  }
);


export const postIngredientRecipe = createAsyncThunk(
  POST_INGREDIENTS_RECIPE,
  async (newIngredients, { rejectWithValue }) => {

    console.log("-newIngredients-")
    console.log(newIngredients)

    try {
      // Hacer el insert en Supabase
      const { data, error } = await supabase
        .from('Ingredients_recipes')
        .insert([newIngredients])
        .select()
        .single();

      if (error) {
        console.log("ERROR:");
        console.log(error.message);
        throw new Error(error.message);
      }

      // Opcional: Puedes hacer algo con la respuesta, como agregar el mensaje a la lista localmente
      console.log("Mensaje enviado:", data);

      return data;

    } catch (error) {
      console.error("Error al enviar el mensaje:", error.message);
    }
  }
);
