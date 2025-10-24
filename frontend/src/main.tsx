import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { persistor, store } from './app/store.ts';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {GOOGLE_CLIENT_ID} from "../constants.ts";
import theme from "../theme.ts";
import {addInterceptors} from "../axiosApi.ts";


addInterceptors(store);

createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <BrowserRouter>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <App />
                    </ThemeProvider>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </GoogleOAuthProvider>,
);