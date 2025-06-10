import { createReducer } from "@reduxjs/toolkit";

import {
    initValue,
    getAllRecipes,
    setListIngredientsNewRecipe
} from "./actions";

// Cada reducer tiene su propio state
const initialState = {
    listAllRecipes: [],
    listIngredientsNewRecipes: [],
    error: null,
    loading: false,
}


export default createReducer(initialState, (builder) => {
    builder
        .addCase(initValue, () => {
            return initialState;
        })
        .addCase(getAllRecipes.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                listAllRecipes: { ...action.payload },
            };
        })
        .addCase(setListIngredientsNewRecipe.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                listIngredientsNewRecipes: { ...action.payload },
            };
        })
        .addDefaultCase((state) => {
            return state;
        });
});