import { createReducer } from "@reduxjs/toolkit";

import {
    initValue,
    getAllOrders
} from "./actions";

// Cada reducer tiene su propio state
const initialState = {
    listAllOrders: [],
    error: null,
    loading: false,
}


export default createReducer(initialState, (builder) => {
    builder
        .addCase(initValue, () => {
            return initialState;
        })
        .addCase(getAllOrders.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                listAllOrders: { ...action.payload },
            };
        })
        .addDefaultCase((state) => {
            return state;
        });
});