import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useProfileStore } from "@/store/profileStore";
import { useEffect, useRef, useState } from "react";
import { sessionCheckState } from "@/lib/sessionCheckState";

export const ProtectedRoute = () => {
    const { isAuthenticated, validateSession } = useProfileStore();
    const location = useLocation();
    const [isVerifying, setIsVerifying] = useState(!sessionCheckState.validated);
    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        if (sessionCheckState.validated) return;

        // Cookie-based auth: isAuthenticated in the store is optimistic (persisted).
        // Always validate against the server once per browser session so a stale
        // persisted flag can't bypass a missing/expired auth_token cookie.
        // sessionCheckState.validated is reset to false by the 401 interceptor so
        // an expired cookie triggers re-validation on the next protected route visit.
        const verify = async () => {
            setIsVerifying(true);
            await validateSession();
            sessionCheckState.validated = true;
            setIsVerifying(false);
        };
        verify();
    }, [validateSession]);

    if (isVerifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Outlet />;
    }

    return <Navigate to="/auth" state={{ from: location }} replace />;
};
