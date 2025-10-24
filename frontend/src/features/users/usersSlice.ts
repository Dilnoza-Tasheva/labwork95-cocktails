
import { googleLogin, login, register } from './usersThunk';
import {createSlice} from "@reduxjs/toolkit";
import type {GlobalError, User, ValidationError} from "../../types";


interface UsersState {
    user: User | null;
    registerLoading: boolean;
    registerError: ValidationError | null;
    loginLoading: boolean;
    loginError: GlobalError | null;
}

const initialState: UsersState = {
    user: null,
    registerLoading: false,
    registerError: null,
    loginLoading: false,
    loginError: null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: { unsetUser: (state) => { state.user = null; } },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.registerLoading = true; state.registerError = null;
            })
            .addCase(register.fulfilled, (state, { payload }) => {
                state.registerLoading = false; state.user = payload;
            })
            .addCase(register.rejected, (state, { payload }) => {
                state.registerLoading = false; state.registerError = payload || null;
            });


        builder
            .addCase(login.pending, (state) => {
                state.loginLoading = true; state.loginError = null;
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.loginLoading = false; state.user = payload;
            })
            .addCase(login.rejected, (state, { payload }) => {
                state.loginLoading = false; state.loginError = payload || null;
            });


        builder
            .addCase(googleLogin.pending, (state) => {
                state.loginLoading = true; state.loginError = null;
            })
            .addCase(googleLogin.fulfilled, (state, { payload }) => {
                state.loginLoading = false; state.user = payload;
            })
            .addCase(googleLogin.rejected, (state, { payload }) => {
                state.loginLoading = false; state.loginError = payload || null;
            });
    },
    selectors: {
        selectUser: (s) => s.user,
        selectRegisterLoading: (s) => s.registerLoading,
        selectRegisterError: (s) => s.registerError,
        selectLoginLoading: (s) => s.loginLoading,
        selectLoginError: (s) => s.loginError,
    }
});


export const usersReducer = usersSlice.reducer;
export const { unsetUser } = usersSlice.actions;
export const { selectUser, selectRegisterLoading, selectRegisterError, selectLoginLoading, selectLoginError } = usersSlice.selectors;