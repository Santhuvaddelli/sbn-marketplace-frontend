import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const token = localStorage.getItem("accessToken");
    // or "token" – use the SAME key you set on login

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
