import axios from 'axios';
import { createAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabase";

import {
  GET_ALL_SOURCES,
  INIT_VALUE,
} from './types';

export const initValue = createAction(INIT_VALUE);

export const getAllSources = createAsyncThunk(
  GET_ALL_SOURCES,
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('Sources')
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
