import axios from 'axios';
import { createAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "src/utils/supabase";
import {toLowerCaseSentence} from "src/utils/format-text"

import {
  GET_ALL_GROUPS,
  INIT_VALUE,
  POST_GROUP,
} from './types';

export const initValue = createAction(INIT_VALUE);

export const getAllGroups = createAsyncThunk(
  GET_ALL_GROUPS,
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('Groups')
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

export const postGroup = createAsyncThunk(
  POST_GROUP,
  async (name_group, { rejectWithValue }) => {

    const newGroup = {
      name: name_group,
    };

    try {
      // Hacer el insert en Supabase
      const { data, error } = await supabase
        .from('Groups_Ingredients')
        .insert([newGroup])
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
      return rejectWithValue(error.message || "Error when you created a new group");
    }
  }
);