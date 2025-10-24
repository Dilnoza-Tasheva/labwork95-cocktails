import { AppBar, styled, Toolbar, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import UserMenu from "./UserMenu.tsx";
import AnonymousMenu from "./AnonymousMenu.tsx";
import {selectUser} from "../../../features/users/usersSlice.ts";
import {useAppSelector} from "../../../app/hooks.ts";


const AppToolbar = () => {
    const user = useAppSelector(selectUser);


    const StyledLink = styled(Link)({
        color: 'inherit', textDecoration: 'none', '&:hover': { color: 'inherit' },
    });


    return (
        <AppBar position="sticky" sx={{ mb: 2 }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" component="div">
                    <StyledLink to={'/'}>Cocktails</StyledLink>
                </Typography>
                <Box>{user ? <UserMenu user={user} /> : <AnonymousMenu />}</Box>
            </Toolbar>
        </AppBar>
    );
};
export default AppToolbar;