import {NavBar} from "./NavBar.tsx";
import {Route, Routes} from "react-router-dom";
import {Jobs} from "../pages/Jobs.tsx";
import {Data} from "../pages/Data.tsx";
import {Login} from "../pages/Login.tsx";

/**
 * Represents the Layout of the application
 *
 * @constructor
 */
export const Layout = () => {

    return (
        <>
            <div>
                <NavBar/>
            </div>
            <div>
                <Routes>
                    <Route path="/" element={<Jobs/>}/>
                    <Route path="/data" element={<Data/>}/>
                    <Route path="/login" element={<Login/>}/>
                </Routes>
            </div>
        </>
    );
}