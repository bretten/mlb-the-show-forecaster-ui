import React from "react";

/**
 * Defines the AuthContext
 */
export interface AuthContextType {
    isAuthenticated: boolean;
    username: string;
    role: string;
    login: (username: string, password: string, loginSuccessCallback: VoidFunction, loginFailedCallback: VoidFunction) => void;
    logout: (logoutSuccessCallback: VoidFunction) => void;
    verify: (verifySuccessCallback: VoidFunction, verifyFailedCallback: VoidFunction) => void;
}

/**
 * Context for the currently authenticated user. Provides authorization information
 */
export const AuthContext = React.createContext<AuthContextType>(null!);

export const useAuth = () => {
    return React.useContext(AuthContext);
}