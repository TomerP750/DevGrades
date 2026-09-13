import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthenticatedNavbar } from "./AuthenticatedNavbar";

export function ProtectedRoute() {

    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/sign-in" state={{ from: location }} replace />;
    }

    return (
        <>
            <AuthenticatedNavbar />
            <Outlet />
        </>
    );
}