import React, {useContext, useState} from "react";
import {AuthContext} from "../contexts/AuthContext.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {Alert, Box, FormControl, Input, InputLabel} from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import {useLayout} from "../contexts/LayoutContext.ts";

/**
 * Defines a Login UI component
 * - Allows the user to login
 *
 * @constructor
 */
export const Login = () => {
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {setIsLoading} = useLayout();

    const handleLogin = async (event: React.FormEvent) => {
        setIsLoading(true);
        setError("");
        event.preventDefault();

        login(username, password, () => {
            setIsLoading(false);
            navigate(from, {replace: true});
        }, () => {
            setIsLoading(false);
            setError('Login failed. Please try again.');
        })
    }

    return (
        <Box
            component="form"
            onSubmit={handleLogin}
            justifyContent="center"
            alignItems="center"
            sx={{
                display: 'flex',
                mt: '10px',
                p: 1.5,
            }}>

            <Stack spacing={1} direction="column" sx={{mb: 2}}>
                <h2>Login</h2>
                <div>
                    {error && <Alert severity="error">{error}</Alert>}
                </div>

                <Divider/>
                <FormControl variant="standard">
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <Input id="username"
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                           aria-label="username"
                           required/>
                </FormControl>

                <FormControl variant="standard">
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input id="password"
                           type="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           aria-label="password"
                           required/>
                </FormControl>

                <FormControl variant="standard">
                    <Button color="primary" type="submit">Login</Button>
                </FormControl>
            </Stack>
        </Box>
    )
}