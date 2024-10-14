import {useAuth} from "../../contexts/AuthContext.ts";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const verifyIntervalMs = import.meta.env.VITE_VERIFY_INTERVAL_MS as number;

/**
 * Checks that the user is authenticated by polling the auth context verification
 * @constructor
 */
export const AuthenticationVerification = () => {
    const authContext = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            authContext.verify(() => {
                // No action
            }, () => {
                // Navigate to the login page
                navigate("/login", {replace: true, state: {from: location}});
            });
        }, verifyIntervalMs);

        return () => clearInterval(interval);
    }, [authContext, authContext.isAuthenticated, navigate]);

    return null;
}