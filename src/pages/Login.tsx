import React, {useContext, useState} from "react";
import {AuthContext} from "../contexts/AuthContext.ts";
import {useLocation, useNavigate} from "react-router-dom";

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

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        login(username, password, () => {
            navigate(from, {replace: true});
        }, () => {
            setError('Login failed. Please try again.');
        })
    }

    return (
        <>
            <h2>Login</h2>

            <div>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </div>

            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </>
    )
}