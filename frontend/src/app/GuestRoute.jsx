import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";

export function GuestRoute({ children }) {
  const { userToken, ownerToken } = useAuth();
  if (userToken || ownerToken) {
    return <Navigate to={ROUTES.home} replace />;
  }
  return children;
}
