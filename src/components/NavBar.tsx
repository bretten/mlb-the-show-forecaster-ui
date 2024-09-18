import React from "react";
import {AppBar, Toolbar} from "@mui/material";
import Stack from "@mui/material/Stack";
import {MenuRounded, SportsBaseball} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import {MenuButton} from "./dashboard/components/MenuButton.tsx";
import SideMenuMobile from "./dashboard/components/SideMenuMobile.tsx";

/**
 * Defines a navigation bar UI component
 *
 * @constructor
 */
export const NavBar = () => {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                display: {xs: 'auto', md: 'none'},
                boxShadow: 0,
                bgcolor: 'background.paper',
                backgroundImage: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
                top: '0px',
            }}
        >
            <Toolbar variant="regular">
                <Stack
                    direction="row"
                    sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexGrow: 1,
                        width: '100%',
                    }}
                >
                    <Stack direction="row" spacing={1} sx={{justifyContent: 'center'}}>
                        <SportsBaseball/>
                        <Typography variant="h4" component="h1" sx={{color: 'text.primary'}}>
                            Title
                        </Typography>
                    </Stack>
                    <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuRounded/>
                    </MenuButton>
                    <SideMenuMobile open={open} toggleDrawer={toggleDrawer}/>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}