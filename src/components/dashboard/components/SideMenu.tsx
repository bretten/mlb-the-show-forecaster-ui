import {PaletteMode, styled} from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, {drawerClasses} from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {MenuContent} from './MenuContent';
import {OptionsMenu} from './OptionsMenu';
import {ToggleColorMode} from "./ToggleColorMode.tsx";
import {LoginRounded, SportsBaseball} from "@mui/icons-material";
import {useAuth} from "../../../contexts/AuthContext.ts";
import {SeasonSwitcher} from "../../season/SeasonSwitcher.tsx";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: 'border-box',
    mt: 10,
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
    },
});

interface SideMenuProps {
    mode: PaletteMode;
    toggleColorMode: () => void;
}

export const SideMenu = ({mode, toggleColorMode}: SideMenuProps) => {
    const auth = useAuth();

    return (
        <Drawer
            variant="permanent"
            sx={{
                display: {xs: 'none', md: 'block'},
                [`& .${drawerClasses.paper}`]: {
                    backgroundColor: 'background.paper',
                },
            }}
        >
            <Box
                justifyContent="center"
                alignItems="center"
                sx={{
                    display: 'flex',
                    mt: '10px',
                    p: 1.5,
                }}
            >
                <Stack
                    direction="row"
                    sx={{
                        alignItems: 'center',
                    }}
                >
                    <SportsBaseball sx={{fontSize: 50}}/>
                    <Typography variant="body2" sx={{fontWeight: 500, lineHeight: '16px'}}>
                        MLB The Show Forecaster
                    </Typography>
                </Stack>

            </Box>
            <Divider/>
            <MenuContent/>

            <Box
                justifyContent="center"
                alignItems="center"
                sx={{
                    display: 'flex',
                    mt: '10px',
                    p: 1.5,
                }}
            >
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
            </Box>

            {auth.isAuthenticated ? (
                <>
                    <Stack
                        direction="row"
                        sx={{
                            p: 2,
                            gap: 1,
                            alignItems: 'center',
                            borderTop: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Avatar
                            sizes="small"
                            alt={auth.username}
                            sx={{width: 36, height: 36}}
                        >
                            {auth.username.substring(0, 1)}
                        </Avatar>
                        <Box sx={{mr: 'auto'}}>
                            <Typography variant="body2" sx={{fontWeight: 500, lineHeight: '16px'}}>
                                {auth.username}
                            </Typography>
                            <Typography variant="caption" sx={{color: 'text.secondary'}}>
                                {auth.role}
                            </Typography>
                        </Box>
                        <OptionsMenu/>
                    </Stack>
                </>
            ) : (
                <Stack
                    direction="column"
                    sx={{
                        p: 2,
                        gap: 1,
                        alignItems: 'center',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Link to={"login"}>
                        <Button variant="outlined" fullWidth startIcon={<LoginRounded/>}>
                            Login
                        </Button>
                    </Link>
                </Stack>
            )}
        </Drawer>
    );
}
