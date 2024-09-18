import {useAuth} from "../../contexts/AuthContext.ts";
import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";

/**
 * Component that forces nested elements to require authentication
 * @param children
 * @constructor
 */
export const RequireAuth = ({children}: { children: React.ReactNode }) => {
    const auth = useAuth();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        auth.verify(() => {
            setIsAuthenticated(true);
        }, () => {
            navigate("/login", {replace: true, state: {from: location}});
        });
    }, [auth, isAuthenticated, location, navigate]);

    return isAuthenticated ? children : <h3>Loading</h3>;
}