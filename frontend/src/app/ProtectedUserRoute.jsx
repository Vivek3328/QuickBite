import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";

export function ProtectedUserRoute({ children }) {
  const { userToken } = useAuth();
  if (!userToken) {
    return <Navigate to={ROUTES.home} replace />;
  }
  return children;
}
