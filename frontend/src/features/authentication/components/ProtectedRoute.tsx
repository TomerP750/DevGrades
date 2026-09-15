import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../../../layout/Navbar";
import { MessageButton } from "../../../layout/MessageButton";

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
            <Navbar />
            <MessageButton />
            <Outlet />
        </>
    );
}