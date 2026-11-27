import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, session } from '../api/client';

const AuthContext = createContext(null);

// Backend roles → dashboard.
export const DASHBOARD_PATHS = {
  FAN: '/dashboard/fan/profile',
  CONTESTANT: '/dashboard/contestant/public-profile',
  ADMIN: '/dashboard/admin/contestants',
  MODERATOR: '/dashboard/admin/contestants',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => session.get()?.user ?? null);
  const [ready, setReady] = useState(false);

  // Keep in sync with the session (other tabs, token refresh, logout on expiry).
  useEffect(() => {
    const sync = () => setUser(session.get()?.user ?? null);
    window.addEventListener('bf:session', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('bf:session', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  // On load, confirm the stored session is still valid and refresh the user.
  useEffect(() => {
    if (!session.get()?.accessToken) {
      setReady(true);
      return;
    }
    api('/auth/me')
      .then((data) => session.update({ user: data.user }))
      .catch((err) => {
        if (err.status === 401 || err.status === 403) session.clear();
      })
      .finally(() => setReady(true));
  }, []);

  const saveSession = (data) => {
    session.set({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user });
    return data.user;
  };

  // role: 'fan' | 'contestant' | 'admin' (the login tab)
  const login = useCallback(async ({ email, password, role, remember }) => {
    const data = await api('/auth/login', { method: 'POST', body: { email, password, role, remember }, auth: false });
    return saveSession(data);
  }, []);

  const register = useCallback(async (form) => {
    const data = await api('/auth/register', { method: 'POST', body: form, auth: false });
    return saveSession(data);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = session.get()?.refreshToken;
    session.clear();
    if (refreshToken) await api('/auth/logout', { method: 'POST', body: { refreshToken }, auth: false }).catch(() => {});
  }, []);

  const refreshUser = useCallback(async () => {
    const data = await api('/auth/me');
    session.update({ user: data.user });
    return data.user;
  }, []);

  const setCurrentUser = useCallback((u) => session.update({ user: u }), []);

  const value = useMemo(
    () => ({ user, ready, isLoggedIn: Boolean(user), login, register, logout, refreshUser, setCurrentUser }),
    [user, ready, login, register, logout, refreshUser, setCurrentUser]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
