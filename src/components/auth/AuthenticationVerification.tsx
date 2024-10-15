import {useAuth} from "../../contexts/AuthContext.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";

const verifyIntervalMs = import.meta.env.VITE_VERIFY_INTERVAL_MS as number;

export interface AuthenticationVerificationProps {
    callback: (...args: any[]) => Promise<void>;
}

/**
 * Checks that the user is authenticated by polling the auth context verification
 * @constructor
 */
export const AuthenticationVerification = ({callback}: AuthenticationVerificationProps) => {
    const authContext = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            if (!authContext.isAuthenticated) {
                if (location.pathname === "/login") return;

                navigate("/login", {replace: true, state: {from: location}});
                return;
            }

            authContext.verify(async () => {
                await callback();
            }, () => {
                // Navigate to the login page
                navigate("/login", {replace: true, state: {from: location}});
            });
        }, verifyIntervalMs);

        return () => clearInterval(interval);
    }, [authContext, authContext.isAuthenticated, navigate]);

    return null;
}