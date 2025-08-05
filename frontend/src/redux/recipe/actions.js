import { createAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "src/utils/supabase";

import {
  GET_ALL_RECIPES,
  SET_INGREDIENTS_NEW_RECIPES,
  SET_STEPS_NEW_RECIPES,
  INIT_VALUE,
  POST_RECIPE
} from './types';

export const initValue = createAction(INIT_VALUE);

export const setListIngredientsNewRecipe = createAsyncThunk(
  SET_INGREDIENTS_NEW_RECIPES,
  async (listIngredient, { rejectWithValue }) => {
    return listIngredient;
  }
);

export const setListStepsNewRecipe = createAsyncThunk(
  SET_STEPS_NEW_RECIPES,
  async (listSteps, { rejectWithValue }) => {
    return listSteps;
  }
);

export const getAllRecipes = createAsyncThunk(
  GET_ALL_RECIPES,
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('Recipes')
        .select(`
          *,
          type:Types(*),
          difficulty:Levels(*),
          order:Orders(*),
          source:Sources(*)
        `)
        .order('name', { ascending: false });


      if (error) {
        return rejectWithValue(error.message);
      }

      return data || [];

    } catch (error) {
      return rejectWithValue(error.message || "Error inesperado");
    }
  }
);

export const postNewRecipe = createAsyncThunk(
  POST_RECIPE,
  async (newRecipe, { rejectWithValue }) => {

    console.log("-newMessage-")
    console.log(newRecipe)

    try {
      // Hacer el insert en Supabase
      const { data, error } = await supabase
        .from('Recipes')
        .insert([newRecipe])
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
