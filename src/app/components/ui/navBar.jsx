import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getLoggedStatus } from "../../store/users";
import NavProfile from "./navProfile";

const NavBar = () => {
    const isLoggedIn = useSelector(getLoggedStatus());
    return (
        <nav className="navbar bg-light shadow mb-3 rounded">
            <div className="container-fluid">
                <ul className="nav">
                    <li className="nav-item">
                        <Link className="nav-link " aria-current="page" to="/">
                            Main
                        </Link>
                    </li>
                    {(isLoggedIn && (<>
                        <li className="nav-item">
                            <Link className="nav-link " aria-current="page" to="/users">
                                Users
                            </Link>
                        </li>
                    </>))}
                </ul>
                <div className="d-flex">
                    {(
                        isLoggedIn ? (
                            <NavProfile />
                        ) : (
                            <Link className="nav-link " aria-current="page" to="/login">
                                Login
                            </Link>
                        )
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
