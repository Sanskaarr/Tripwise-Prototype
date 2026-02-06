import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useProfileStore } from "@/store/profileStore";
import { useEffect, useState } from "react";

export const ProtectedRoute = () => {
    const { isAuthenticated, token, validateSession } = useProfileStore();
    const location = useLocation();
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        // If we have a token but aren't authenticated (e.g. after refresh/update),
        // try to validate the session
        if (!isAuthenticated && token) {
            const verify = async () => {
                setIsVerifying(true);
                await validateSession();
                setIsVerifying(false);
            };
            verify();
        }
    }, [isAuthenticated, token, validateSession]);

    // If fully authenticated, render content
    if (isAuthenticated) {
        return <Outlet />;
    }

    // If we have a token and are checking it (or about to), show nothing or loader
    // This prevents the flicker/redirect while restoring session
    if (token || isVerifying) {
        // You could return a loading spinner here
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    // Valid session not found - redirect to auth
    // Redirect to auth page if not logged in
    // Save current location to redirect back after login (optional enhancement)
    return <Navigate to="/auth" state={{ from: location }} replace />;
};
