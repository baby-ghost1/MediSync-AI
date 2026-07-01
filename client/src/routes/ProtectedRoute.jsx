import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // -----------------------------
  // Show Loader while checking auth
  // -----------------------------
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="animate-pulse text-lg font-semibold">
          Loading...
        </h2>
      </div>
    );
  }

  // -----------------------------
  // User not logged in
  // -----------------------------
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // -----------------------------
  // Role Based Authorization
  // -----------------------------
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user?.role)
  ) {
    const dashboardMap = {
      patient: "/patient/dashboard",
      doctor: "/doctor/dashboard",
      admin: "/admin/dashboard",
    };
    return (
      <Navigate
        to={dashboardMap[user?.role] || "/"}
        replace
      />
    );
  }

  // -----------------------------
  // Render Nested Routes
  // -----------------------------
  return children ? children : <Outlet />;
};

export default ProtectedRoute;