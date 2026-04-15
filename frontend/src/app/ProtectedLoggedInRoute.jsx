import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";

/** Requires any valid session (customer or restaurant partner). */
export function ProtectedLoggedInRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />;
  }

  return children;
}
