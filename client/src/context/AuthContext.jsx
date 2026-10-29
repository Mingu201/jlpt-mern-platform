import { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('jlpt_token'));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const res = await axiosClient.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.warn('Phiên đăng nhập hết hạn:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axiosClient.get('/srs/stats');
      setStats(res.data);
    } catch (err) {
      console.warn('Lỗi lấy thống kê:', err.message);
    }
  };

  const login = async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    localStorage.setItem('jlpt_token', res.token);
    setToken(res.token);
    setUser(res.data);
    await fetchStats();
    return res.data;
  };

  const register = async (name, email, password, targetLevel = 'N5') => {
    const res = await axiosClient.post('/auth/register', { name, email, password, targetLevel });
    localStorage.setItem('jlpt_token', res.token);
    setToken(res.token);
    setUser(res.data);
    await fetchStats();
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('jlpt_token');
    setToken(null);
    setUser(null);
    setStats(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        stats,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshStats: fetchStats
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
