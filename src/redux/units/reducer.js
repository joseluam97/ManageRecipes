import { createReducer } from "@reduxjs/toolkit";

import {
    initValue,
    getAllUnits
} from "./actions";

// Cada reducer tiene su propio state
const initialState = {
    listAllUnits: [],
    error: null,
    loading: false,
}


export default createReducer(initialState, (builder) => {
    builder
        .addCase(initValue, () => {
            return initialState;
        })
        .addCase(getAllUnits.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                listAllUnits: { ...action.payload },
            };
        })
        .addDefaultCase((state) => {
            return state;
        });
});