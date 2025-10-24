import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants';
import {usersReducer} from "../features/users/usersSlice.ts";
import {cocktailsReducer} from "../features/cocktails/cocktailsSlice.ts";

const userPersistConfig = {
  key: 'cocktails:users',
  storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  users: persistReducer(userPersistConfig, usersReducer),
  cocktails: cocktailsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
  },
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
