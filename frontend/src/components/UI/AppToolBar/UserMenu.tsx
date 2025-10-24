import { type FC, useState, type MouseEvent } from 'react';
import { Avatar, Button, Menu, MenuItem, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import type {User} from "../../../types";
import {useAppDispatch} from "../../../app/hooks.ts";
import {API_URL} from "../../../constants.ts";
import {logout} from "../../../features/users/usersThunk.ts";


interface Props { user: User; }


const UserMenu: FC<Props> = ({ user }) => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


    const handleClick = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);


    const avatarSrc = user.avatar?.startsWith('http') ? user.avatar : `${API_URL}/${user.avatar}`;


    return (
        <>
            <Button onClick={handleClick} color="inherit">
                <Stack direction="row" gap={1} alignItems="center">
                    <Avatar src={avatarSrc} sx={{ width: 28, height: 28 }} />
                    {user.displayName}
                </Stack>
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem component={Link} to="/cocktails/mine">My cocktails</MenuItem>
                <MenuItem onClick={() => dispatch(logout())}>Logout</MenuItem>
            </Menu>
        </>
    );
};
export default UserMenu;