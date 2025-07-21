import { createReducer } from "@reduxjs/toolkit";

import {
    initValue,
    getAllGroups,
    postGroup
} from "./actions";

// Cada reducer tiene su propio state
const initialState = {
    listAllGroups: [],
    newGroup: undefined,
    error: null,
    loading: false,
}


export default createReducer(initialState, (builder) => {
    builder
        .addCase(initValue, () => {
            return initialState;
        })
        .addCase(getAllGroups.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                listAllGroups: { ...action.payload },
            };
        })
        .addCase(postGroup.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                newGroup: action.payload,
            };
        })
        .addDefaultCase((state) => {
            return state;
        });
});