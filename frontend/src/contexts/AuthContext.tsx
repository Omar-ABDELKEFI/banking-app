import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/auth';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      // Here you would typically validate the token and fetch user data
      // For now, we'll just set isAuthenticated
    }
  }, []);

  const login = (token: string) => {
    authService.setToken(token);
    // Here you would typically fetch and set user data
    navigate('/');
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: authService.isAuthenticated(),
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
