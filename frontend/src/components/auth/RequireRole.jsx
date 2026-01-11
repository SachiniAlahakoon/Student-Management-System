import { Navigate } from "react-router-dom";

export default function RequireRole({ allowedRoles, children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
