import { selectLoginError, selectLoginLoading } from './usersSlice';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { type ChangeEvent, type FormEvent, useState } from 'react';
import type { LoginMutation } from "../../types";
import { googleLogin, login } from './usersThunk';
import { Alert, Avatar, Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";


const Login = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectLoginLoading);
    const error = useAppSelector(selectLoginError);
    const navigate = useNavigate();


    const [state, setState] = useState<LoginMutation>({ username: '', password: '' });


    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState((prev) => ({ ...prev, [name]: value }));
    };


    const submitFormHandler = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(login(state)).unwrap();
            navigate('/');
        } catch {}
    };

    const googleLoginHandler = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            await dispatch(googleLogin(credentialResponse.credential)).unwrap();
            navigate('/');
        }
    };

    return (
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOpenIcon /></Avatar>
            <Typography component="h1" variant="h5">Sign in</Typography>
            {error && (
                <Alert severity={'error'} sx={{ mt: 3 }}>{error.error}</Alert>
            )}
            <Box sx={{ pt: 2 }}>
                <GoogleLogin onSuccess={googleLoginHandler} />
            </Box>
            <Box component="form" noValidate onSubmit={submitFormHandler} sx={{ my: 3, maxWidth: 400, width: '100%' }}>
                <Stack spacing={2}>
                    <TextField required label="Username" name="username" value={state.username} onChange={inputChangeHandler} />
                    <TextField type="password" required label="Password" name="password" value={state.password} onChange={inputChangeHandler} />
                    <Button type="submit" fullWidth variant="contained" sx={{ mb: 2 }} loading={loading}>Sign In</Button>
                </Stack>
            </Box>
            <Link component={RouterLink} to="/register">Don't have an account yet? Register</Link>
        </Box>
    );
};
export default Login;