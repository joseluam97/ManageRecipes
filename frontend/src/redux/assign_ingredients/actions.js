import axios from 'axios';
import { createAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "src/utils/supabase";
import {toLowerCaseSentence} from "src/utils/format-text"

import {
  INIT_VALUE,
  MODE_WINDOW_ADD_EDIT_INGREDIENT,
  LIST_CURRENT_INGREDIENTS,
  GROUP_SPECIFY,
  GROUP_LIST
} from './types';

export const initValue = createAction(INIT_VALUE);

export const setModeWindowIngredient = createAsyncThunk(
  MODE_WINDOW_ADD_EDIT_INGREDIENT,
  async (new_mode, { rejectWithValue }) => {
    return new_mode;
  }
);

export const setListCurrentIngredient = createAsyncThunk(
  LIST_CURRENT_INGREDIENTS,
  async (listCurrentIngredients, { rejectWithValue }) => {
    return listCurrentIngredients;
  }
);

export const setGroupSpecify = createAsyncThunk(
  GROUP_SPECIFY,
  async (groupSpecify, { rejectWithValue }) => {
    return groupSpecify;
  }
);

export const setGroupList = createAsyncThunk(
  GROUP_LIST,
  async (groupList, { rejectWithValue }) => {
    return groupList;
  }
);
