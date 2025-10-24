import { useEffect } from 'react';
import { fetchPublic, fetchPending, setPublished } from './cocktailsThunk';
import { selectListLoading, selectPublic, selectToggling, selectPending, selectPendingLoading } from './cocktailsSlice';
import {
    Alert, Card, CardActionArea, CardActions, CardContent, CardMedia,
    CircularProgress, Grid, Stack, Typography, Button, Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import { selectUser } from '../users/usersSlice';
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {API_URL} from "../../constants.ts";

const PublicList = () => {
    const dispatch = useAppDispatch();
    const items = useAppSelector(selectPublic);
    const loading = useAppSelector(selectListLoading);

    const user = useAppSelector(selectUser);
    const isAdmin = user?.role === 'admin';

    const pending = useAppSelector(selectPending);
    const pendingLoading = useAppSelector(selectPendingLoading);
    const toggling = useAppSelector(selectToggling);

    useEffect(() => {
        dispatch(fetchPublic());
        if (isAdmin) dispatch(fetchPending());
    }, [dispatch, isAdmin]);

    const renderCard = (c: any) => {
        const img = c.image ? (c.image.startsWith('http') ? c.image : `${API_URL}/${c.image}`) : '';
        return (
            <Card>
                <CardActionArea component={Link} to={`/cocktails/${c._id}`} state={{ cocktail: c }}>
                    {img && <CardMedia sx={{ height: 180 }} image={img} />}
                    <CardContent>
                        <Stack spacing={1}>
                            <Typography variant="h6">{c.title}</Typography>
                            <Typography variant="body2">by {c.user.displayName}</Typography>
                        </Stack>
                    </CardContent>
                </CardActionArea>
                {isAdmin && !c.published && (
                    <CardActions>
                        <Button
                            size="small"
                            disabled={toggling}
                            onClick={() => dispatch(setPublished({ id: c._id, published: true }))
                                .then(() => {
                                    dispatch(fetchPending());
                                    dispatch(fetchPublic());
                                })}
                        >
                            Publish
                        </Button>
                    </CardActions>
                )}
            </Card>
        );
    };

    return (
        <Stack spacing={3} sx={{ width: '100%' }}>
            {isAdmin && (
                <Stack spacing={2}>
                    <Typography variant="h5">Pending moderation</Typography>
                    {pendingLoading ? (
                        <CircularProgress />
                    ) : pending.length === 0 ? (
                        <Alert severity="success">No cocktails awaiting moderation </Alert>
                    ) : (
                        <Grid container spacing={2}>
                            {pending.map((c) => (
                                <Grid key={c._id} item xs={12} sm={6} md={4} lg={3}>
                                    {renderCard(c)}
                                </Grid>
                            ))}
                        </Grid>
                    )}
                    <Divider />
                </Stack>
            )}

            <Stack spacing={2}>
                <Typography variant="h5">Published cocktails</Typography>
                {loading ? (
                    <CircularProgress />
                ) : items.length === 0 ? (
                    <Alert severity="info">No cocktails yet.</Alert>
                ) : (
                    <Grid container spacing={2}>
                        {items.map((c) => (
                            <Grid key={c._id} item xs={12} sm={6} md={4} lg={3}>
                                {renderCard(c)}
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Stack>
        </Stack>
    );
};

export default PublicList;
