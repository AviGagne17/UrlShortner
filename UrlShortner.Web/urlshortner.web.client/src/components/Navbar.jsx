import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

function Navbar() {

    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    if (location.pathname === "/login") {
        return null;
    }

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container">

                <NavLink className="navbar-brand" to="/">
                    URL Shortener
                </NavLink>

                <div className="navbar-nav">
                    <NavLink
                        className="nav-link"
                        to="/shorten"
                    >
                        Shorten URL
                    </NavLink>

                    <NavLink
                        className="nav-link"
                        to="/urls"
                    >
                        My URLs
                    </NavLink>
                </div>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;