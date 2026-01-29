import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useProfileStore } from "@/store/profileStore";

export const ProtectedRoute = () => {
    const { isAuthenticated } = useProfileStore();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to auth page if not logged in
        // Save current location to redirect back after login (optional enhancement)
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // Authorized - render child routes
    return <Outlet />;
};
