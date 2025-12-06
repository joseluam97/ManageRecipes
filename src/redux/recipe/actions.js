import { createAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "src/utils/supabase";

import {
  GET_ALL_RECIPES,
  SET_STEPS_NEW_RECIPES,
  INIT_VALUE,
  POST_RECIPE,
  PUT_RECIPE,
  DELETE_RECIPE,
  GET_RECIPE_BY_ID
} from './types';

export const initValue = createAction(INIT_VALUE);

export const setListStepsNewRecipe = createAsyncThunk(
  SET_STEPS_NEW_RECIPES,
  async (listSteps, { rejectWithValue }) => {
    return listSteps;
  }
);


export const getRecipeById = createAsyncThunk(
  GET_RECIPE_BY_ID,
  async (id_recipe, { rejectWithValue }) => {
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
        .eq('id', id_recipe)
        .single();

      if (error) {
        return rejectWithValue(error.message);
      }

      return data || {};

    } catch (error) {
      return rejectWithValue(error.message || "Error inesperado");
    }
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

      console.log("Mensaje enviado:", data);

      return data;

    } catch (error) {
      console.error("Error al enviar el mensaje:", error.message);
    }
  }
);

export const putRecipe = createAsyncThunk(
  PUT_RECIPE, // define esta constante igual que hiciste con POST_RECIPE
  async (updatedRecipe, { rejectWithValue }) => {

    console.log("-updateRecipe-");
    console.log(updatedRecipe);

    try {
      const { id, ...fieldsToUpdate } = updatedRecipe;

      const { data, error } = await supabase
        .from('Recipes')
        .update(fieldsToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.log("ERROR:");
        console.log(error.message);
        throw new Error(error.message);
      }

      console.log("Receta actualizada:", data);

      return data;

    } catch (error) {
      console.error("Error al actualizar la receta:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteRecipe = createAsyncThunk(
  DELETE_RECIPE,
  async (id, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('Recipes')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("ERROR al eliminar:", error.message);
        return rejectWithValue(error.message);
      }

      console.log("Recipe eliminado:", data);
      return data;

    } catch (error) {
      console.error("Excepción al eliminar:", error.message);
      return rejectWithValue(error.message || "Error al eliminar la receta");
    }
  }
);
