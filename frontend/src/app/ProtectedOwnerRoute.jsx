import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";

export function ProtectedOwnerRoute({ children }) {
  const { ownerToken, isOwner } = useAuth();
  if (!ownerToken || !isOwner) {
    return <Navigate to={ROUTES.home} replace />;
  }
  return children;
}
