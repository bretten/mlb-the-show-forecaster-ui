import {useAuth} from "../../contexts/AuthContext.ts";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const verifyIntervalMs = import.meta.env.VITE_VERIFY_INTERVAL_MS as number;

/**
 * Verifies that the user is authenticated by polling the verification endpoint
 * @constructor
 */
export const AuthenticationVerification = () => {
    const authContext = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            authContext.verify(() => {
            }, () => {
                navigate("/login", {replace: true, state: {from: location}});
            });
        }, verifyIntervalMs);

        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [authContext, authContext.isAuthenticated, navigate]);

    return null;
}