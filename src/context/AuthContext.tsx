import { createContext, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { AuthUser } from "../types/user";
import { getToken, removeToken, setToken } from "../utils/storage";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (tokenValue: string, userValue?: AuthUser | null) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, updateToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login: (tokenValue, userValue) => {
        setToken(tokenValue);
        updateToken(tokenValue);
        if (userValue) setUser(userValue);
      },
      logout: () => {
        removeToken();
        updateToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
