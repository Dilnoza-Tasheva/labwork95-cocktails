
import { useEffect, useMemo } from 'react';
import { useLocation, useParams, Link as RouterLink } from 'react-router-dom';
import {
    selectMine,
    selectPublic,
    selectCurrent,
    selectToggling,
    selectMineLoading,
    selectListLoading,
} from './cocktailsSlice';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Divider,
    Grid,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';
import { setPublished, deleteCocktail, fetchMine, fetchOne } from './cocktailsThunk';
import { selectUser } from '../users/usersSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {API_URL} from "../../constants.ts";

type LocationState = { cocktail?: any };

const OneCocktail = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation() as unknown as { state?: LocationState };
    const fromState = location.state?.cocktail;

    const publicItems = useAppSelector(selectPublic);
    const mine = useAppSelector(selectMine);
    const current = useAppSelector(selectCurrent);

    const listLoading = useAppSelector(selectListLoading);
    const mineLoading = useAppSelector(selectMineLoading);
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const toggling = useAppSelector(selectToggling);

    const cocktail = useMemo(
        () =>
            fromState ||
            publicItems.find((c) => c._id === id) ||
            mine.find((c) => c._id === id) ||
            current,
        [fromState, publicItems, mine, current, id],
    );

    useEffect(() => {
        if (!fromState && !publicItems.length && !mine.length && id) {
            dispatch(fetchOne(id));
        }
    }, [dispatch, id, fromState, publicItems.length, mine.length]);


    const isInitialLoading =
        !cocktail && (listLoading || mineLoading || (!fromState && !!id && !publicItems.length && !mine.length));

    if (isInitialLoading) {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button variant="text" component={RouterLink} to={-1 as unknown as string} startIcon={<ArrowBackIcon />}>
                        Back
                    </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <Skeleton variant="rectangular" height={360} />
                        <CardContent>
                            <Stack spacing={1}>
                                <Skeleton variant="text" width="60%" />
                                <Skeleton variant="text" width="40%" />
                                <Divider />
                                <Skeleton variant="text" width="30%" />
                                <Skeleton variant="rectangular" height={120} />
                                <Divider />
                                <Skeleton variant="text" width="30%" />
                                <Skeleton variant="rectangular" height={120} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }


    if (!cocktail) {
        return (
            <Alert severity="error">
                Cocktail not found or you don’t have access. (Unpublished cocktails are visible only to the author and admins.)
            </Alert>
        );
    }

    const img = cocktail.image
        ? cocktail.image.startsWith('http')
            ? cocktail.image
            : `${API_URL}/${cocktail.image}`
        : '';
    const authorAvatar =
        cocktail.user?.avatar?.startsWith?.('http') ? cocktail.user.avatar : `${API_URL}/${cocktail.user?.avatar || ''}`;

    const isAdmin = user?.role === 'admin';
    const isOwner = user?._id === cocktail.user?._id;
    const canPublish = isAdmin;
    const canDelete = isAdmin || isOwner;

    const togglePublish = async () => {
        await dispatch(setPublished({ id: cocktail._id, published: !cocktail.published }));
        if (isOwner || isAdmin) await dispatch(fetchMine());
        if (id) await dispatch(fetchOne(id)); // refresh the details view
    };

    const handleDelete = async () => {
        await dispatch(deleteCocktail(cocktail._id));
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/';
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Button variant="text" component={RouterLink} to={-1 as unknown as string} startIcon={<ArrowBackIcon />}>
                    Back
                </Button>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card>
                    {img && <CardMedia sx={{ height: 360 }} image={img} title={cocktail.title} />}
                    <CardContent>
                        <Stack spacing={1}>
                            <Typography variant="h4">{cocktail.title}</Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                {authorAvatar && (
                                    <img
                                        src={authorAvatar}
                                        alt={cocktail.user?.displayName}
                                        style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                )}
                                <Typography variant="body2">by {cocktail.user?.displayName}</Typography>
                                <Chip
                                    size="small"
                                    color={cocktail.published ? 'success' : 'default'}
                                    label={cocktail.published ? 'Published' : 'Pending review'}
                                />
                            </Stack>

                            <Divider />
                            <Typography variant="h6">Recipe</Typography>
                            <Typography whiteSpace="pre-wrap">{cocktail.recipe}</Typography>

                            <Divider />
                            <Typography variant="h6">Ingredients</Typography>
                            <Box component="ul" sx={{ pl: 3, m: 0 }}>
                                {cocktail.ingredients.map(
                                    (ing: { name: string; amount: string }, idx: number) => (
                                        <li key={idx}>
                                            <Typography>
                                                <strong>{ing.name}</strong> — {ing.amount}
                                            </Typography>
                                        </li>
                                    ),
                                )}
                            </Box>

                            {(canPublish || canDelete) && (
                                <>
                                    <Divider />
                                    <Stack direction="row" spacing={1}>
                                        {canPublish && (
                                            <Button variant="outlined" disabled={toggling} onClick={togglePublish}>
                                                {cocktail.published ? 'Unpublish' : 'Publish'}
                                            </Button>
                                        )}
                                        {canDelete && (
                                            <Button variant="outlined" color="error" onClick={handleDelete}>
                                                Delete
                                            </Button>
                                        )}
                                    </Stack>
                                </>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default OneCocktail;
