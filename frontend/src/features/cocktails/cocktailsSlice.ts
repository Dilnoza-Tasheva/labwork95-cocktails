import { createSlice } from '@reduxjs/toolkit';
import { createCocktail, deleteCocktail, fetchMine, fetchOne, fetchPublic, setPublished } from './cocktailsThunk';
import type {Cocktail} from "../../types";

interface State {
    publicItems: Cocktail[];
    mine: Cocktail[];
    current: Cocktail | null;
    listLoading: boolean;
    mineLoading: boolean;
    createLoading: boolean;
    toggling: boolean;
    deleting: boolean;
}

const initialState: State = {
    publicItems: [],
    mine: [],
    current: null,
    listLoading: false,
    mineLoading: false,
    createLoading: false,
    toggling: false,
    deleting: false,
};

const cocktailsSlice = createSlice({
    name: 'cocktails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublic.pending, (state) => {
                state.listLoading = true;
            })
            .addCase(fetchPublic.fulfilled, (state, { payload }) => {
                state.listLoading = false; state.publicItems = payload;
            })
            .addCase(fetchPublic.rejected, (state) => {
                state.listLoading = false;
            });
        builder
            .addCase(fetchMine.pending, (state) => {
                state.mineLoading = true;
            })
            .addCase(fetchMine.fulfilled, (state, { payload }) => {
                state.mineLoading = false; state.mine = payload;
            })
            .addCase(fetchMine.rejected, (state) => {
                state.mineLoading = false;
            });
        builder
            .addCase(createCocktail.pending, (state) => {
                state.createLoading = true;
            })
            .addCase(createCocktail.fulfilled, (state) => {
                state.createLoading = false;
            })
            .addCase(createCocktail.rejected, (state) => {
                state.createLoading = false;
            });
        builder
            .addCase(setPublished.pending, (state) => {
                state.toggling = true;
            })
            .addCase(setPublished.fulfilled, (state) => {
                state.toggling = false;
            })
            .addCase(setPublished.rejected, (state) => {
                state.toggling = false;
            });
        builder
            .addCase(deleteCocktail.pending, (state) => {
                state.deleting = true; })
            .addCase(deleteCocktail.fulfilled, (state) => {
                state.deleting = false;
            })
            .addCase(deleteCocktail.rejected, (state) => {
                state.deleting = false;
            });
        builder
            .addCase(fetchOne.pending, (state) => {
                state.current = null;
            })
            .addCase(fetchOne.fulfilled, (state, { payload }) => {
                state.current = payload;
            })
            .addCase(fetchOne.rejected, (state) => {
                state.current = null;
            });
    },
    selectors: {
        selectPublic: (state) => state.publicItems,
        selectMine: (state) => state.mine,
        selectCurrent: (state) => state.current,
        selectListLoading: (state) => state.listLoading,
        selectMineLoading: (state) => state.mineLoading,
        selectCreateLoading: (state) => state.createLoading,
        selectToggling: (state) => state.toggling,
    },
});

export const cocktailsReducer = cocktailsSlice.reducer;
export const { selectPublic, selectMine, selectCurrent, selectListLoading, selectMineLoading, selectCreateLoading, selectToggling } = cocktailsSlice.selectors;