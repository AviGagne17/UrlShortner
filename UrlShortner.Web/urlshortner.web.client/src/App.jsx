import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ShortenUrl from "./pages/ShortenUrl";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
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