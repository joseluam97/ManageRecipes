import { createReducer } from "@reduxjs/toolkit";

import {
    initValue,
    getAllTags
} from "./actions";

// Cada reducer tiene su propio state
const initialState = {
    listAllTags: [],
    error: null,
    loading: false,
}


export default createReducer(initialState, (builder) => {
    builder
        .addCase(initValue, () => {
            return initialState;
        })
        .addCase(getAllTags.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                listAllTags: { ...action.payload },
            };
        })
        .addDefaultCase((state) => {
            return state;
        });
});