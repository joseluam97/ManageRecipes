import { createReducer } from "@reduxjs/toolkit";

import {
    initValue,
    launchProcess,
    getStateProcess
} from "./actions";

// Cada reducer tiene su propio state
const initialState = {
    id_process_launch: '',
    state_process: {},
    error: null,
    loading: false,
}


export default createReducer(initialState, (builder) => {
    builder
        .addCase(initValue, () => {
            return initialState;
        })
        .addCase(launchProcess.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                id_process_launch: { ...action.payload },
            };
        })
        .addCase(getState.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                state_process: action.payload,
            };
        })
        .addDefaultCase((state) => {
            return state;
        });
});