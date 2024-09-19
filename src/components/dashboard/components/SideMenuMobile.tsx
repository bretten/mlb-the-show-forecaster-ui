import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, {drawerClasses} from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import {MenuContent} from './MenuContent';
import {useAuth} from "../../../contexts/AuthContext.ts";
import * as React from "react";
import {useNavigate} from "react-router-dom";

interface SideMenuMobileProps {
    open: boolean | undefined;
    toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({open, toggleDrawer}: SideMenuMobileProps) {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        auth.logout(() => navigate("/"));
    }

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={toggleDrawer(false)}
            sx={{
                display: {xs: 'block', md: 'none'},
                [`& .${drawerClasses.paper}`]: {
                    backgroundImage: 'none',
                    backgroundColor: 'background.paper',
                },
            }}
        >
            <Stack
                sx={{
                    maxWidth: '70dvw',
                    height: '100%',
                }}
            >
                {
                    auth.isAuthenticated ? (
                        <>
                            <Stack direction="row" sx={{p: 2, pb: 0, gap: 1}}>
                                <Stack
                                    direction="row"
                                    sx={{gap: 1, alignItems: 'center', flexGrow: 1, p: 1}}
                                >
                                    <Avatar
                                        sizes="small"
                                        alt={auth.username}
                                        sx={{width: 24, height: 24}}
                                    >
                                        {auth.username.substring(0, 1)}
                                    </Avatar>
                                    <Typography component="p" variant="h6">
                                        {auth.username}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Divider/>
                        </>
                    ) : (
                        <></>
                    )
                }
                <Stack sx={{flexGrow: 1}}>
                    <MenuContent/>
                    <Divider/>
                </Stack>
                {
                    auth.isAuthenticated ? (
                            <>
                                <Stack sx={{p: 2}}>
                                    <Button variant="outlined" fullWidth
                                            startIcon={<LogoutRoundedIcon/>}
                                            onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </Stack>
                            </>
                        ) :
                        (
                            <></>
                        )
                }
            </Stack>
        </Drawer>
    );
}
