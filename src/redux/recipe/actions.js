import axios from 'axios';
import { createAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabase";

import {
  GET_ALL_RECIPES,
  INIT_VALUE,
} from './types';

export const initValue = createAction(INIT_VALUE);

export const getAllRecipes = createAsyncThunk(
  GET_ALL_RECIPES,
  async ({}) => {
    try {
      const { data: resultData, error } = await supabase
        .from('Recipes')
        .select('*')
        .order('name', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return resultData || [];

    } catch (error) {
      // Maneja errores de red u otros problemas
      console.error("Network or unexpected error:", error.message);
    }
  }
);
