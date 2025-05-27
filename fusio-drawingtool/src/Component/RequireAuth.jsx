// src/components/RequireAuth.js
import { useGetMeQuery } from "../features/auth/authSlice";
import { Navigate, useLocation } from "react-router";

const RequireAuth = ({ children }) => {
  const { data: user, isLoading } = useGetMeQuery();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

export default RequireAuth;
