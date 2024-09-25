import React, {useState} from "react";
import {AuthContext} from "../../contexts/AuthContext.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;
const loginUri = import.meta.env.VITE_LOGIN_URI;
const logoutUri = import.meta.env.VITE_LOGOUT_URI;
const verifyUri = import.meta.env.VITE_VERIFY_URI;

/**
 * Auth provider for the whole application
 * @param children Any nested elements that need to reference the AuthProvider
 * @constructor
 */
export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const isAdmin = role == "Admins";

    const login = async (username: string, password: string, loginSuccessCallback: VoidFunction, loginFailedCallback: VoidFunction) => {
        const response = await fetch(baseUrl + loginUri, {
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
        const response = await fetch(baseUrl + logoutUri, {
            method: 'POST'
        });
        if (response.ok) {
            setUsername('');
            setRole('');
            setIsAuthenticated(false);
            logoutSuccessCallback();
        }
    };

    const verify = async (verifySuccessCallback: VoidFunction, verifyFailedCallback: VoidFunction) => {
        const response = await fetch(baseUrl + verifyUri, {
            method: 'POST'
        });
        if (!response.ok) {
            setUsername('');
            setRole('');
            setIsAuthenticated(false);
            verifyFailedCallback();
        } else {
            const responseJson = await response.json();
            setUsername(responseJson['username']);
            setRole(responseJson['role']);
            setIsAuthenticated(true);
            verifySuccessCallback();
        }
    };

    const value = {isAuthenticated, username, role, isAdmin, login, logout, verify};
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}