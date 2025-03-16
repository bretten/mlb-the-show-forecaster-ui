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
import {Link, useNavigate} from "react-router-dom";
import {ToggleColorMode} from "./ToggleColorMode.tsx";
import {SeasonSwitcher} from "../../season/SeasonSwitcher.tsx";
import {PaletteMode} from "@mui/material/styles";
import {useLayout} from "../../../contexts/LayoutContext.ts";
import {LoginRounded} from "@mui/icons-material";

interface SideMenuMobileProps {
    open: boolean | undefined;
    toggleDrawer: (newOpen: boolean) => () => void;
    mode: PaletteMode;
    toggleColorMode: () => void;
}

export default function SideMenuMobile({open, toggleDrawer, mode, toggleColorMode}: SideMenuMobileProps) {
    const auth = useAuth();
    const navigate = useNavigate();
    const {setIsLoading} = useLayout();

    const handleLogout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setIsLoading(true);
        e.preventDefault();
        auth.logout(() => {
            setIsLoading(false);
            navigate("/");
        });
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
                    <MenuContent onClick={toggleDrawer(false)}/>
                    <Stack
                        direction="row"
                        sx={{
                            p: 2,
                            gap: 1,
                            alignItems: 'center'
                        }}
                    >
                        <ToggleColorMode data-screenshot="toggle-mode" mode={mode} toggleColorMode={toggleColorMode}/>
                        <SeasonSwitcher/>
                    </Stack>
                </Stack>
                <Divider/>
                <Stack sx={{p: 2}}>
                    {
                        auth.isAuthenticated ? (
                                <>
                                    <Button variant="outlined" fullWidth
                                            startIcon={<LogoutRoundedIcon/>}
                                            onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </>
                            ) :
                            (
                                <>
                                    <Link to={"login"} onClick={toggleDrawer(false)}>
                                        <Button variant="outlined" fullWidth
                                                startIcon={<LoginRounded/>}>
                                            Login
                                        </Button>
                                    </Link>
                                </>
                            )
                    }
                </Stack>
            </Stack>
        </Drawer>
    );
}
