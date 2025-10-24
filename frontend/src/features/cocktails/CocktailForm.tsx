import {type ChangeEvent, type FormEvent, useState} from 'react';
import { Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type {CocktailMutation} from "../../types";
import FileInput from "../../components/UI/FileInput/FileInput.tsx";

interface Props { onSubmit: (c: CocktailMutation) => void; loading: boolean; }

const CocktailForm = ({ onSubmit, loading }: Props) => {
    const [state, setState] = useState<CocktailMutation>({
        title: '', recipe: '', image: null, ingredients: [{ name: '', amount: '' }],
    });

    const change = (e: ChangeEvent<HTMLInputElement>) => setState((s) => ({ ...s, [e.target.name]: e.target.value }));

    const changeIngredient = (i: number, field: 'name'|'amount', value: string) => {
        setState((s) => {
            const copy = [...s.ingredients];
            copy[i] = { ...copy[i], [field]: value };
            return { ...s, ingredients: copy };
        });
    };

    const addIngredient = () => setState((s) => ({ ...s, ingredients: [...s.ingredients, { name: '', amount: '' }] }));
    const removeIngredient = (i: number) => setState((s) => ({ ...s, ingredients: s.ingredients.filter((_, idx) => idx !== i) }));

    const submit = (e: FormEvent) => { e.preventDefault(); onSubmit(state); };

    return (
        <Stack component="form" spacing={2} onSubmit={submit}>
            <TextField required label="Title" name="title" value={state.title} onChange={change} />
            <TextField required multiline minRows={3} label="Recipe" name="recipe" value={state.recipe} onChange={change} />
            <Typography variant="subtitle1">Ingredients</Typography>
            <Stack spacing={1}>
                {state.ingredients.map((ing, idx) => (
                    <Stack key={idx} direction="row" gap={1} alignItems="center">
                        <TextField required label="Name" value={ing.name} onChange={(e) => changeIngredient(idx, 'name', e.target.value)} />
                        <TextField required label="Amount" value={ing.amount} onChange={(e) => changeIngredient(idx, 'amount', e.target.value)} />
                        <IconButton aria-label="remove" onClick={() => removeIngredient(idx)}><DeleteIcon /></IconButton>
                    </Stack>
                ))}
            </Stack>
            <Button variant="outlined" onClick={addIngredient}>Add ingredient</Button>
            <FileInput label="Image" name="image" onChange={(e) => { if (e.target.files) setState((s) => ({ ...s, image: e.target.files![0] })); }} />
            <Button type="submit" variant="contained" loading={loading}>Create</Button>
        </Stack>
    );
};
export default CocktailForm;