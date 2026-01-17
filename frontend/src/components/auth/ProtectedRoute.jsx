import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
