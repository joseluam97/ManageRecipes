import axios from 'axios';
import { createAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabase";

import {
  GET_ALL_RECIPES,
  SET_INGREDIENTS_NEW_RECIPES,
  SET_STEPS_NEW_RECIPES,
  INIT_VALUE,
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
        .select('*')
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
