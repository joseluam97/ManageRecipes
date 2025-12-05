import axios from 'axios';
import { createAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "src/utils/supabase";
import {toLowerCaseSentence} from "src/utils/format-text"

import {
  GET_ALL_UNITS,
  INIT_VALUE,
  POST_UNIT,
} from './types';

export const initValue = createAction(INIT_VALUE);

export const getAllUnits = createAsyncThunk(
  GET_ALL_UNITS,
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('Units')
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

export const postUnit = createAsyncThunk(
  POST_UNIT,
  async (name_unit, { rejectWithValue }) => {

    console.log("-name_unit-")
    console.log(name_unit)

    let name_unit_formatted = toLowerCaseSentence(name_unit);

    const newUnit = {
      name: name_unit_formatted,
    };

    console.log("-name_unit_formatted-")
    console.log(name_unit_formatted)

    try {
      // Hacer el insert en Supabase
      const { data, error } = await supabase
        .from('Units')
        .insert([newUnit])
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
      return rejectWithValue(error.message || "Error when you created a new unit");
    }
  }
);