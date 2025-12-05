import axios from 'axios';
import { createAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "src/utils/supabase";

import {
  LAUNCH_TASK,
  GET_STATE_PROGRESS,
  INIT_VALUE,
} from './types';

const API_AI_SERVICES = "http://192.168.1.100:8004"

export const initValue = createAction(INIT_VALUE);

export const launchProcess = createAsyncThunk(
  LAUNCH_TASK,
  async (url, { rejectWithValue }) => {
    try {
      const response = await fetch(API_AI_SERVICES + "/procesar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      return data.task_id;

    } catch (error) {
      console.error("❌ Error en getRecipeByIA:", error.message);
      return rejectWithValue(error.message || "Error inesperado");
    }
  }
);

export const getStateProcess = createAsyncThunk(
  GET_STATE_PROGRESS,
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await fetch(API_AI_SERVICES + `/estado/${taskId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Error inesperado");
    }
  }
);
