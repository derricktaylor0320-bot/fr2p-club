import { useState } from "react";

const ADMIN_KEY_STORAGE = "fr2p_admin_key";

export function useAdminAuth() {
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem(ADMIN_KEY_STORAGE) || "");
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem(ADMIN_KEY_STORAGE));

  const login = (key: string) => {
    localStorage.setItem(ADMIN_KEY_STORAGE, key);
    setAdminKey(key);
    setAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_KEY_STORAGE);
    setAdminKey("");
    setAuthenticated(false);
  };

  return { adminKey, authenticated, login, logout };
}

export function getAdminHeaders(): Record<string, string> {
  const key = localStorage.getItem(ADMIN_KEY_STORAGE);
  return key ? { "x-admin-key": key } : {};
}
