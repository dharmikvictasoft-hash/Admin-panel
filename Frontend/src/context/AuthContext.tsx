import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LoginResponse } from "../services/auth";

type AuthUser = LoginResponse["user"];

type AuthContextValue = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const parseJwtPayload = (token: string): Record<string, any> | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const normalized = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    const json = atob(normalized);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const userFromToken = (token: string): AuthUser | null => {
  const payload = parseJwtPayload(token);
  if (!payload) return null;

  const firstName =
    payload.fname || payload.firstName || payload.given_name || "";
  const lastName =
    payload.lname || payload.lastName || payload.family_name || "";

  let fname = String(firstName);
  let lname = String(lastName);

  if (!fname && !lname && payload.name) {
    const parts = String(payload.name).trim().split(/\s+/);
    fname = parts[0] || "";
    lname = parts.slice(1).join(" ");
  }

  return {
    _id: String(payload._id || payload.id || payload.sub || ""),
    fname,
    lname,
    email: String(payload.email || ""),
    provider: payload.provider ? String(payload.provider) : undefined,
    avatar: payload.avatar
      ? String(payload.avatar)
      : payload.picture
        ? String(payload.picture)
        : undefined,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const parsedUser = userFromToken(token);
    if (parsedUser && (parsedUser.email || parsedUser.fname || parsedUser.lname)) {
      setUser(parsedUser);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
