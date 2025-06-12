import { createReducer } from "@reduxjs/toolkit";

import {
    initValue,
    getAllSources
} from "./actions";

// Cada reducer tiene su propio state
const initialState = {
    listAllSources: [],
    error: null,
    loading: false,
}


export default createReducer(initialState, (builder) => {
    builder
        .addCase(initValue, () => {
            return initialState;
        })
        .addCase(getAllSources.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                listAllSources: { ...action.payload },
            };
        })
        .addDefaultCase((state) => {
            return state;
        });
});