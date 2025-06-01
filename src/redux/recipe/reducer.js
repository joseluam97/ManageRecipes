import { createReducer } from "@reduxjs/toolkit";

import {
    initValue,
    getAllRecipes
} from "./actions";

// Cada reducer tiene su propio state
const initialState = {
    getAllRecipes: [],
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
                getAllRecipes: { ...action.payload },
            };
        })
        .addDefaultCase((state) => {
            return state;
        });
});