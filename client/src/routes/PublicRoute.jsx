import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const roleDashboardMap = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  admin: "/admin/dashboard",
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // -----------------------------
  // Wait until auth state is known
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
  // Already Logged In
  // -----------------------------
  if (isAuthenticated) {
    const redirectPath =
      roleDashboardMap[user?.role] || "/";

    return (
      <Navigate
        to={redirectPath}
        replace
      />
    );
  }

  // -----------------------------
  // Guest User
  // -----------------------------
  return children ? children : <Outlet />;
};

export default PublicRoute;