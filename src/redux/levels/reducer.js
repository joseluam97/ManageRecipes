import { createReducer } from "@reduxjs/toolkit";

import {
    initValue,
    getAllLevels
} from "./actions";

// Cada reducer tiene su propio state
const initialState = {
    listAllLevels: [],
    error: null,
    loading: false,
}


export default createReducer(initialState, (builder) => {
    builder
        .addCase(initValue, () => {
            return initialState;
        })
        .addCase(getAllLevels.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                listAllLevels: { ...action.payload },
            };
        })
        .addDefaultCase((state) => {
            return state;
        });
});