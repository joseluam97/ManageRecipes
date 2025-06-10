import { createReducer } from "@reduxjs/toolkit";

import {
    initValue,
    getAllIngredients,
    postIngredient
} from "./actions";

// Cada reducer tiene su propio state
const initialState = {
    newIngredient: undefined,
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
        .addCase(postIngredient.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                newIngredient: action.payload,
            };
        })
        .addDefaultCase((state) => {
            return state;
        });
});