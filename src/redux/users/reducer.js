import { createReducer } from "@reduxjs/toolkit";

import {
    initValue,
    getUserValidate
} from "./actions";

// Cada reducer tiene su propio state
const initialState = {
    userLogin: undefined,
    error: null,
    loading: false,
}


export default createReducer(initialState, (builder) => {
    builder
        .addCase(initValue, () => {
            return initialState;
        })
        .addCase(getUserValidate.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                userLogin: action.payload,
            };
        })
        .addDefaultCase((state) => {
            return state;
        });
});