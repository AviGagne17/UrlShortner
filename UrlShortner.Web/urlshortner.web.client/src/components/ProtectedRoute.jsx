import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuthentication } from "../services/authService";

function ProtectedRoute({ children }) {
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        checkAuthentication()
            .then(result => {
                setAuthenticated(result);
            });
    }, []);

    if (authenticated === null) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">
                        Checking authentication...
                    </span>
                </div>
            </div>
        );
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;