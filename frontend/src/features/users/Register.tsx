import { type ChangeEvent, type FormEvent, useState } from 'react';
import { Avatar, Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { selectRegisterError, selectRegisterLoading } from './usersSlice';
import { register } from './usersThunk';
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import type {RegisterMutation} from "../../types";
import FileInput from "../../components/UI/FileInput/FileInput.tsx";


const Register = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectRegisterLoading);
    const error = useAppSelector(selectRegisterError);
    const navigate = useNavigate();

    const [state, setState] = useState<RegisterMutation>({
        username: '', password: '', displayName: '', avatar: null,
    });

    const getFieldError = (fieldName: string) => error?.errors?.[fieldName]?.message;

    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState((prev) => ({ ...prev, [name]: value }));
    }

    const submitFormHandler = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(register(state)).unwrap();
            navigate('/');
        } catch {}
    };

    return (
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlineIcon /></Avatar>
            <Typography component="h1" variant="h5">Sign up</Typography>
            <Box component="form" noValidate onSubmit={submitFormHandler} sx={{ my: 3, maxWidth: 400, width: '100%' }}>
                <Stack spacing={2}>
                    <TextField required label="Username" name="username" value={state.username} onChange={inputChangeHandler} autoComplete="new-username" error={Boolean(getFieldError('username'))} helperText={getFieldError('username')} />
                    <TextField type="password" required label="Password" name="password" value={state.password} onChange={inputChangeHandler} autoComplete="new-password" error={Boolean(getFieldError('password'))} helperText={getFieldError('password')} />
                    <TextField required label="Display name" name="displayName" value={state.displayName} onChange={inputChangeHandler} />
                    <FileInput label="Avatar" name="avatar" onChange={(e) => { if (e.target.files) setState((s) => ({ ...s, avatar: e.target.files![0] })); }} />
                    <Button type="submit" fullWidth variant="contained" sx={{ mb: 2 }} loading={loading}>Sign Up</Button>
                </Stack>
            </Box>
            <Link component={RouterLink} to="/login">Already have an account? Sign in</Link>
        </Box>
    );
};
export default Register;