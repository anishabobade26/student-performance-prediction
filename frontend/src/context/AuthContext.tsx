import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  register: (userData: { username: string; email: string; password: string; full_name?: string }) => Promise<void>;
  loginAsDemo: (role: 'admin' | 'student') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('student_ai_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('student_ai_token');
      const storedUser = localStorage.getItem('student_ai_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify with backend
          const currentUser = await api.auth.me();
          setUser(currentUser);
          localStorage.setItem('student_ai_user', JSON.stringify(currentUser));
        } catch (e) {
          console.warn('Session expired or invalid. Resetting state.');
          localStorage.removeItem('student_ai_token');
          localStorage.removeItem('student_ai_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const saveAuthSession = (authData: AuthResponse) => {
    setToken(authData.access_token);
    setUser(authData.user);
    localStorage.setItem('student_ai_token', authData.access_token);
    localStorage.setItem('student_ai_user', JSON.stringify(authData.user));
  };

  const login = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      const authData = await api.auth.login(credentials);
      saveAuthSession(authData);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { username: string; email: string; password: string; full_name?: string }) => {
    setIsLoading(true);
    try {
      const authData = await api.auth.register(userData);
      saveAuthSession(authData);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async (role: 'admin' | 'student') => {
    if (role === 'admin') {
      await login({ username: 'admin', password: 'Admin@12345' });
    } else {
      // Register or login a quick demo student
      try {
        await login({ username: 'demo_student', password: 'DemoStudent@123' });
      } catch (e) {
        await register({
          username: 'demo_student',
          email: 'demostudent@studentai.io',
          password: 'DemoStudent@123',
          full_name: 'Demo Student Evaluator'
        });
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('student_ai_token');
    localStorage.removeItem('student_ai_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
