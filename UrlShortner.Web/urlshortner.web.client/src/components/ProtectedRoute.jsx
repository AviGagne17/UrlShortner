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
        return <p>Checking authentication...</p>;
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;