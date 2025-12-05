import { createReducer } from "@reduxjs/toolkit";

import {
    initValue,
    getAllRecipes,
    setListStepsNewRecipe,
    postNewRecipe
} from "./actions";

// Cada reducer tiene su propio state
const initialState = {
    listAllRecipes: [],
    listIngredientsNewRecipes: [],
    listStepsNewRecipes: [],
    createdNewRecipe: {},
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
        .addCase(setListStepsNewRecipe.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                listStepsNewRecipes: { ...action.payload },
            };
        })
        .addCase(postNewRecipe.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                createdNewRecipe: { ...action.payload },
            };
        })
        .addDefaultCase((state) => {
            return state;
        });
});