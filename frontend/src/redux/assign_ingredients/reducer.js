import { createReducer } from "@reduxjs/toolkit";

import {
    initValue,
    setListCurrentIngredient,
    setGroupSpecify,
    setModeWindowIngredient,
    setGroupList
} from "./actions";

// Cada reducer tiene su propio state
const initialState = {
    modeWindowEditIngredient: '',
    listCurrentIngredients: [],
    groupSpecify: false,
    groupList: [],
    error: null,
    loading: false,
}

export default createReducer(initialState, (builder) => {
    builder
        .addCase(initValue, () => {
            return initialState;
        })
        .addCase(setModeWindowIngredient.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                modeWindowEditIngredient: action.payload,
            };
        })
        .addCase(setListCurrentIngredient.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                listCurrentIngredients: {...action.payload},
            };
        })
        .addCase(setGroupSpecify.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                groupSpecify: action.payload,
            };
        })
        .addCase(setGroupList.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                groupList: {...action.payload},
            };
        })
        .addDefaultCase((state) => {
            return state;
        });
});