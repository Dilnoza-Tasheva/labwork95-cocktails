import { createAsyncThunk } from '@reduxjs/toolkit';
import type { GlobalError, LoginMutation, RegisterMutation, User, ValidationError } from "../../types";
import { isAxiosError } from 'axios';
import axiosApi from "../../axiosApi.ts";
import {unsetUser} from "./usersSlice.ts";


export const register = createAsyncThunk<User, RegisterMutation, { rejectValue: ValidationError }>(
    'users/register',
    async (payload, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('username', payload.username);
            formData.append('password', payload.password);
            formData.append('displayName', payload.displayName);
            if (payload.avatar) formData.append('avatar', payload.avatar);
            const { data } = await axiosApi.post<User>('/users', formData);
            return data;
        } catch (e) {
            if (isAxiosError(e) && e.response?.status === 400) return rejectWithValue(e.response.data);
            throw e;
        }
    }
);

export const login = createAsyncThunk<User, LoginMutation, { rejectValue: GlobalError }>(
    'users/login',
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axiosApi.post<User>('/users/sessions', payload);
            return data;
        } catch (e) {
            if (isAxiosError(e) && e.response?.status === 400) return rejectWithValue(e.response.data);
            throw e;
        }
    }
);

export const googleLogin = createAsyncThunk<User, string, { rejectValue: GlobalError }>(
    'users/googleLogin',
    async (credential, { rejectWithValue }) => {
        try {
            const { data } = await axiosApi.post<User>('/users/google', { credential });
            return data;
        } catch (e) {
            if (isAxiosError(e) && e.response?.status === 400) return rejectWithValue(e.response.data);
            throw e;
        }
    }
);

export const logout = createAsyncThunk('users/logout', async (_, { dispatch }) => {
    await axiosApi.delete('/users/sessions');
    dispatch(unsetUser());
});