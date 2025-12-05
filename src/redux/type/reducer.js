import { createReducer } from "@reduxjs/toolkit";

import {
    initValue,
    getAllTypesRecipes
} from "./actions";

// Cada reducer tiene su propio state
const initialState = {
    listAllTypesRecipes: [],
    error: null,
    loading: false,
}


export default createReducer(initialState, (builder) => {
    builder
        .addCase(initValue, () => {
            return initialState;
        })
        .addCase(getAllTypesRecipes.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                listAllTypesRecipes: { ...action.payload },
            };
        })
        .addDefaultCase((state) => {
            return state;
        });
});