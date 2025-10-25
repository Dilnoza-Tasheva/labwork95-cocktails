import { createAsyncThunk } from '@reduxjs/toolkit';
import type {Cocktail, CocktailMutation} from "../../types";
import axiosApi from "../../axiosApi.ts";


export const fetchPublic = createAsyncThunk<Cocktail[]>('cocktails/fetchPublic', async () => {
    const { data } = await axiosApi.get<Cocktail[]>('/cocktails');
    return data;
});

export const fetchMine = createAsyncThunk<Cocktail[]>('cocktails/fetchMine', async () => {
    const { data } = await axiosApi.get<Cocktail[]>('/cocktails/mine');
    return data;
});

export const fetchOne = createAsyncThunk<Cocktail, string>('cocktails/fetchOne', async (id) => {
    const { data } = await axiosApi.get<Cocktail>(`/cocktails/${id}`);
    return data;
});

export const createCocktail = createAsyncThunk<string, CocktailMutation>(
    'cocktails/create',
    async (payload) => {
        const form = new FormData();
        form.append('title', payload.title);
        form.append('recipe', payload.recipe);
        if (payload.image) form.append('image', payload.image);
        form.append('ingredients', JSON.stringify(payload.ingredients));
        const { data } = await axiosApi.post<{ message: string; cocktail: any }>('/cocktails', form);
        return data.message;
    }
);

export const setPublished = createAsyncThunk<void, { id: string; published: boolean }>(
    'cocktails/setPublished',
    async ({ id, published }) => { await axiosApi.patch(`/cocktails/${id}/published`, { published }); }
);

export const deleteCocktail = createAsyncThunk<void, string>('cocktails/delete', async (id) => {
    await axiosApi.delete(`/cocktails/${id}`);
});

export const fetchPending = createAsyncThunk<Cocktail[]>(
    'cocktails/fetchPending',
    async () => {
        const { data } = await axiosApi.get<Cocktail[]>('/cocktails/pending');
        return data;
    }
);