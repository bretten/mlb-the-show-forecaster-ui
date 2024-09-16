import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/AuthContext.ts";
import {useContext} from "react";

/**
 * Defines a navigation bar UI component
 *
 * @constructor
 */
export const NavBar = () => {
    const {isAuthenticated, username, role, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <ul>
            {
                isAuthenticated &&
                (
                    <li>
                        Hello, {username} ({role})!
                    </li>
                )
            }
            <li>
                <Link to="/">Jobs</Link>
            </li>
            <li>
                <Link to="/data">Data</Link>
            </li>
            {
                isAuthenticated &&
                (
                    <li>
                        <Link to="#" onClick={(e) => {
                            e.preventDefault();
                            logout(() => navigate("/"));
                        }}>Logout</Link>
                    </li>
                )
            }


        </ul>
    );
}