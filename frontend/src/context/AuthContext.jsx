import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { STORAGE_KEYS } from "@/constants/storage";

const AuthContext = createContext(null);

function readFromStorage() {
  return {
    userToken: localStorage.getItem(STORAGE_KEYS.userToken),
    ownerToken: localStorage.getItem(STORAGE_KEYS.ownerToken),
    role: localStorage.getItem(STORAGE_KEYS.role),
  };
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readFromStorage);

  useEffect(() => {
    const onStorage = (e) => {
      if (
        e.key === STORAGE_KEYS.userToken ||
        e.key === STORAGE_KEYS.ownerToken ||
        e.key === STORAGE_KEYS.role
      ) {
        setAuth(readFromStorage());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const sync = useCallback(() => {
    setAuth(readFromStorage());
  }, []);

  const loginUser = useCallback((token) => {
    localStorage.setItem(STORAGE_KEYS.userToken, token);
    localStorage.removeItem(STORAGE_KEYS.ownerToken);
    localStorage.removeItem(STORAGE_KEYS.role);
    setAuth(readFromStorage());
  }, []);

  const loginOwner = useCallback((token) => {
    localStorage.setItem(STORAGE_KEYS.ownerToken, token);
    localStorage.setItem(STORAGE_KEYS.role, "owner");
    localStorage.removeItem(STORAGE_KEYS.userToken);
    setAuth(readFromStorage());
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.userToken);
    localStorage.removeItem(STORAGE_KEYS.ownerToken);
    localStorage.removeItem(STORAGE_KEYS.role);
    setAuth(readFromStorage());
  }, []);

  const value = useMemo(() => {
    const { userToken, ownerToken, role } = auth;
    const isUser = Boolean(userToken);
    const isOwner = Boolean(ownerToken) && role === "owner";
    const isLoggedIn = isUser || isOwner;
    return {
      userToken,
      ownerToken,
      role,
      isUser,
      isOwner,
      isLoggedIn,
      loginUser,
      loginOwner,
      logout,
      sync,
    };
  }, [auth, loginUser, loginOwner, logout, sync]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
