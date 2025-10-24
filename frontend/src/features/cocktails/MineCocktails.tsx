import { useEffect, useState } from 'react';
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    CircularProgress,
    Grid,
    Snackbar,
    Stack,
    Typography
} from '@mui/material';
import { selectUser } from '../users/usersSlice';
import {Link, useLocation } from 'react-router-dom';
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {selectMine, selectMineLoading, selectToggling} from "./cocktailsSlice.ts";
import {deleteCocktail, fetchMine, setPublished} from "./cocktailsThunk.ts";
import {API_URL} from "../../constants.ts";

const MineCocktails = () => {
    const dispatch = useAppDispatch();
    const items = useAppSelector(selectMine);
    const loading = useAppSelector(selectMineLoading);
    const toggling = useAppSelector(selectToggling);
    const user = useAppSelector(selectUser);
    const location = useLocation() as { state?: { createdMessage?: string } };

    const [snackOpen, setSnackOpen] = useState(Boolean(location.state?.createdMessage));
    const snackMsg = location.state?.createdMessage || '';

    useEffect(() => { dispatch(fetchMine()); }, [dispatch]);

    if (loading) return <CircularProgress />;

    return (
        <>
            <Snackbar open={snackOpen} autoHideDuration={3000} message={snackMsg} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} />
            <Grid container spacing={2}>
                {items.map((c) => {
                    const img = c.image ? (c.image.startsWith('http') ? c.image : `${API_URL}/${c.image}`) : '';
                    const canPublish = user?.role === 'admin';
                    const canDelete = user?.role === 'admin' || user?._id === c.user?._id;


                    return (
                        <Grid key={c._id} xs={12} sm={6} md={4} lg={3}>
                            <Card>
                                <CardActionArea component={Link} to={`/cocktails/${c._id}`} state={{ cocktail: c }}>
                                    {img && <CardMedia sx={{ height: 180 }} image={img} />}
                                    <CardContent>
                                        <Stack spacing={1}>
                                            <Typography variant="h6">{c.title}</Typography>
                                            <Typography variant="body2">
                                                Status: {c.published ? 'Published' : 'Your cocktail is being reviewed'}
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    {canPublish && (
                                        <Button size="small" disabled={toggling} onClick={() => dispatch(setPublished({ id: c._id, published: !c.published })).then(() => dispatch(fetchMine()))}>
                                            {c.published ? 'Unpublish' : 'Publish'}
                                        </Button>
                                    )}
                                    {canDelete && (
                                        <Button size="small" color="error" onClick={() => dispatch(deleteCocktail(c._id)).then(() => dispatch(fetchMine()))}>
                                            Delete
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
};
export default MineCocktails;