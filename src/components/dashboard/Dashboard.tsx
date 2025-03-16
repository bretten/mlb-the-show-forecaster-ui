import {Box, createTheme, CssBaseline, PaletteMode, ThemeProvider} from "@mui/material";
import getDashboardTheme from "./theme/getDashboardTheme.tsx";
import {SideMenu} from "./components/SideMenu.tsx";
import React from "react";
import {NavBar} from "../NavBar.tsx";
import {alpha} from "@mui/material/styles";
import {Navigate, Route, Routes} from "react-router-dom";
import {RequireAuth} from "../auth/RequireAuth.tsx";
import {Jobs} from "../../pages/Jobs.tsx";
import {Data} from "../../pages/Data.tsx";
import {Login} from "../../pages/Login.tsx";
import Stack from "@mui/material/Stack";

export const Dashboard = () => {
    const [mode, setMode] = React.useState<PaletteMode>('light');
    const dashboardTheme = createTheme(getDashboardTheme(mode));
    // This code only runs on the client side, to determine the system color preference
    React.useEffect(() => {
        // Check if there is a preferred mode in localStorage
        const savedMode = localStorage.getItem('themeMode') as PaletteMode | null;
        if (savedMode) {
            setMode(savedMode);
        } else {
            // If no preference is found, it uses system preference
            const systemPrefersDark = window.matchMedia(
                '(prefers-color-scheme: dark)',
            ).matches;
            setMode(systemPrefersDark ? 'dark' : 'light');
        }
    }, []);

    const toggleColorMode = () => {
        const newMode = mode === 'dark' ? 'light' : 'dark';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode); // Save the selected mode to localStorage
    };

    return (
        <ThemeProvider theme={dashboardTheme}>
            <CssBaseline enableColorScheme/>
            <Box sx={{display: 'flex'}}>
                <SideMenu mode={mode} toggleColorMode={toggleColorMode}/>
                <NavBar mode={mode} toggleColorMode={toggleColorMode}/>

                <Box
                    component="main"
                    sx={(theme) => ({
                        flexGrow: 1,
                        backgroundColor: alpha(theme.palette.background.default, 1),
                        overflow: 'auto',
                    })}
                >
                    <Stack
                        spacing={2}
                        sx={{
                            pb: 10,
                            mt: {xs: 8, md: 0},
                        }}
                    >
                        <div>
                            <Routes>
                                <Route path="/" element={<Data/>}/>
                                <Route path="/jobs" element={<RequireAuth><Jobs/></RequireAuth>}/>
                                <Route path="/login" element={<Login/>}/>
                                <Route path="*" element={<Navigate to="/" replace/>}/>
                            </Routes>
                        </div>
                    </Stack>
                </Box>
            </Box>

        </ThemeProvider>
    );
}