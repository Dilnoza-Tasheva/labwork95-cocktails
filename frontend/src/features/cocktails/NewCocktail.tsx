import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createCocktail } from './cocktailsThunk';
import { selectCreateLoading } from './cocktailsSlice';
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import CocktailForm from "./CocktailForm.tsx";

const NewCocktail = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectCreateLoading);
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        const message = await dispatch(createCocktail(data)).unwrap();
        navigate('/cocktails/mine', { state: { createdMessage: message } });
    };

    return (
        <>
            <Typography variant="h4" sx={{ mb: 2 }}>New Cocktail</Typography>
            <CocktailForm onSubmit={onSubmit} loading={loading} />
        </>
    );
};
export default NewCocktail;