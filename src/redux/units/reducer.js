import { createReducer } from "@reduxjs/toolkit";

import {
    initValue,
    getAllUnits,
    postUnit
} from "./actions";

// Cada reducer tiene su propio state
const initialState = {
    listAllUnits: [],
    newUnit: undefined,
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
        .addCase(postUnit.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                newUnit: action.payload,
            };
        })
        .addDefaultCase((state) => {
            return state;
        });
});