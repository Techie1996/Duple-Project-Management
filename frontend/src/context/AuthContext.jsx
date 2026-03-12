import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    // Optional: decode JWT or call /auth/me if backend provides it
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ id: payload.sub ?? payload.userId, email: payload.email ?? '' });
    } catch {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (email, password) => {
      const res = await api.login(email, password);
      const data = res?.data ?? res;
      const token = data?.accessToken ?? data?.token;
      if (token) {
        localStorage.setItem('accessToken', token);
        const refresh = data?.refreshToken ?? data?.refresh;
        if (refresh) localStorage.setItem('refreshToken', refresh);
        const u = data?.user ?? {};
        setUser({ id: u.id ?? u._id, email: u.email ?? email, name: u.name });
        return res;
      }
      throw new Error(res?.message ?? 'Login failed');
    },
    []
  );

  const register = useCallback(
    async (name, email, password) => {
      const res = await api.register(name, email, password);
      const data = res?.data ?? res;
      const token = data?.accessToken ?? data?.token;
      if (token) {
        localStorage.setItem('accessToken', token);
        const refresh = data?.refreshToken ?? data?.refresh;
        if (refresh) localStorage.setItem('refreshToken', refresh);
        const u = data?.user ?? {};
        setUser({ id: u.id ?? u._id, email: u.email ?? email, name: u.name });
        return res;
      }
      throw new Error(res?.message ?? 'Registration failed');
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  const value = { user, loading, login, register, logout, loadUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
