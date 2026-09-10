import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ShortenUrl from "./pages/ShortenUrl";
import Urls from "./pages/Urls";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route
                    path="/urls"
                    element={
                        <ProtectedRoute>
                            <Urls />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/shorten"
                    element={
                        <ProtectedRoute>
                            <ShortenUrl />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;