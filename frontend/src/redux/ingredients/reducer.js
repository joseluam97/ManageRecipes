import { createReducer } from "@reduxjs/toolkit";

import {
    initValue,
    getAllIngredients,
    putIngredient,
    postIngredientRecipe,
    deleteIngredient,
    postIngredient,
    putIngredientRecipe,
} from "./actions";

// Cada reducer tiene su propio state
const initialState = {
    newIngredient: undefined,
    updateIngredient: undefined,
    eraseIngredient: undefined,
    listAllIngredients: [],
    createdNewIngredientRecipe: {},
    updateIngredientRecipe: {},
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
        .addCase(putIngredient.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                updateIngredient: action.payload,
            };
        })
        .addCase(deleteIngredient.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                eraseIngredient: action.payload,
            };
        })
        .addCase(postIngredientRecipe.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                createdNewIngredientRecipe: action.payload,
            };
        })
        .addCase(putIngredientRecipe.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                updateIngredientRecipe: action.payload,
            };
        })
        .addDefaultCase((state) => {
            return state;
        });
});