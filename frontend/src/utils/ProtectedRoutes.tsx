import { GET_AUTH_USER } from "@/graphql/query/user.query";
import { useQuery } from "@apollo/client";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const location = useLocation();
  const { data, loading, error } = useQuery(GET_AUTH_USER, {
    fetchPolicy: 'network-only', // Always fetch fresh data
  });

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If there's an error or no authenticated user, redirect to login
  if (error || !data?.authenticatedUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If we have a valid user, render the protected routes
  return <Outlet />;
};

export default ProtectedRoutes;
