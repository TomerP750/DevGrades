import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../../../layout/Navbar";
import { MessageButton } from "../../messages/components/floating_button/MessageButton";
import { useIncomingMessages } from "../../messages/hooks/useIncomingMessages";

export function ProtectedRoute() {

    const { user, isLoading } = useAuth();
    const location = useLocation();
    useIncomingMessages();

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