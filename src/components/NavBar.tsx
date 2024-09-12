import {Link} from "react-router-dom";

/**
 * Defines a navigation bar UI component
 *
 * @constructor
 */
export const NavBar = () => {

    return (
        <ul>
            <li>
                <Link to="/">Jobs</Link>
            </li>
            <li>
                <Link to="/data">Data</Link>
            </li>

        </ul>
    );
}