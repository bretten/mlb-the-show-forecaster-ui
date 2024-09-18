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
import {SportsBaseball} from "@mui/icons-material";

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
                        Title
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
                <ToggleColorMode data-screenshot="toggle-mode" mode={mode} toggleColorMode={toggleColorMode}/>
            </Box>

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
                    alt="Username"
                    src="vite.svg"
                    sx={{width: 36, height: 36}}
                />
                <Box sx={{mr: 'auto'}}>
                    <Typography variant="body2" sx={{fontWeight: 500, lineHeight: '16px'}}>
                        Username
                    </Typography>
                    <Typography variant="caption" sx={{color: 'text.secondary'}}>
                        user@example.com
                    </Typography>
                </Box>
                <OptionsMenu/>
            </Stack>
        </Drawer>
    );
}
