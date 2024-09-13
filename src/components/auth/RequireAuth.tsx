import {AuthContext} from "../../contexts/AuthContext.ts";
import {Navigate, useLocation} from "react-router-dom";
import React from "react";

/**
 * Component that forces nested elements to require authentication
 * @param children
 * @constructor
 */
export const RequireAuth = ({children}: { children: React.ReactNode }) => {
    const auth = React.useContext(AuthContext);
    const location = useLocation();

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    return children;
}