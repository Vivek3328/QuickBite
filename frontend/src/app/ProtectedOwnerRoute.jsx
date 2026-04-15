import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";

export function ProtectedOwnerRoute({ children }) {
  const { ownerToken, isOwner } = useAuth();
  const location = useLocation();

  if (!ownerToken || !isOwner) {
    return (
      <Navigate to={ROUTES.addRestaurant} replace state={{ from: location.pathname }} />
    );
  }

  return children;
}
