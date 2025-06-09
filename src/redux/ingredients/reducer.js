import { createReducer } from "@reduxjs/toolkit";

import {
    initValue,
    getAllIngredients
} from "./actions";

// Cada reducer tiene su propio state
const initialState = {
    listAllIngredients: [],
    error: null,
    loading: false,
}


export default createReducer(initialState, (builder) => {
    builder
        .addCase(initValue, () => {
            return initialState;
        })
        .addCase(getAllIngredients.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                listAllIngredients: { ...action.payload },
            };
        })
        .addDefaultCase((state) => {
            return state;
        });
});