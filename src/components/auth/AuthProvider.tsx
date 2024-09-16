import React, {useState} from "react";
import {AuthContext} from "../../contexts/AuthContext.ts";

const loginUri = import.meta.env.VITE_LOGIN_URI;
const logoutUri = import.meta.env.VITE_LOGOUT_URI;

/**
 * Auth provider for the whole application
 * @param children Any nested elements that need to reference the AuthProvider
 * @constructor
 */
export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');

    const login = async (username: string, password: string, loginSuccessCallback: VoidFunction, loginFailedCallback: VoidFunction) => {
        const response = await fetch(loginUri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });

        if (!response.ok) {
            setIsAuthenticated(false);
            loginFailedCallback();
        } else {
            setUsername(username);
            const responseJson = await response.json();
            setRole(responseJson['role']);
            setIsAuthenticated(true);
            loginSuccessCallback();
        }
    };

    const logout = async (logoutSuccessCallback: VoidFunction) => {
        const response = await fetch(logoutUri, {
            method: 'POST'
        });
        if (response.ok) {
            setUsername('');
            setRole('');
            setIsAuthenticated(false);
            logoutSuccessCallback();
        }
    };

    const value = {isAuthenticated, username, role, login, logout};
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}