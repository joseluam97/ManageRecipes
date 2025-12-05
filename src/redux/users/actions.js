import axios from 'axios';
import { createAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "src/utils/supabase";

import {
  INIT_VALUE,
  GET_USER_VALIDATE,
} from './types';

export const initValue = createAction(INIT_VALUE);

export const getUserValidate = createAsyncThunk(
  GET_USER_VALIDATE,
  async ({email, password}, { rejectWithValue }) => {

    console.log("-GET_USER_VALIDATE-")
    console.log("-email-")
    console.log(email)
    console.log("-password-")
    console.log(password)

    try {
      // Hacer el insert en Supabase
      const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
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