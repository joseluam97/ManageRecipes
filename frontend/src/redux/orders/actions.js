import axios from 'axios';
import { createAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "src/utils/supabase";

import {
  GET_ALL_ORDERS,
  INIT_VALUE,
} from './types';

export const initValue = createAction(INIT_VALUE);

export const getAllOrders = createAsyncThunk(
  GET_ALL_ORDERS,
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('Orders')
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
