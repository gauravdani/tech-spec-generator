import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  subscription: {
    tier: string;
    status: 'active' | 'inactive' | 'trial';
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // TODO: Implement actual API call to validate token
          // For now, just simulate a logged-in user
          setUser({
            id: '1',
            email: 'user@example.com',
            name: 'Test User',
            subscription: {
              tier: 'Professional',
              status: 'active'
            }
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // TODO: Implement actual API call
      // For now, just simulate a successful login
      setUser({
        id: '1',
        email,
        name: 'Test User',
        subscription: {
          tier: 'Professional',
          status: 'active'
        }
      });
      localStorage.setItem('auth_token', 'dummy_token');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // TODO: Implement actual API call
      // For now, just simulate a successful signup
      setUser({
        id: '1',
        email,
        name,
        subscription: {
          tier: 'Starter',
          status: 'trial'
        }
      });
      localStorage.setItem('auth_token', 'dummy_token');
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 