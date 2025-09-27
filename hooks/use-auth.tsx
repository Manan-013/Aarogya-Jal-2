import { useState, useEffect, useContext, createContext, useMemo } from 'react';

interface AuthContextType {
  token: string | null;
  login: (jwtToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Set a mock token for frontend development without a backend
    const mockToken = 'mock-jwt-token';
    setToken(mockToken);
    localStorage.setItem('jwt_token', mockToken);
  }, []);

  const login = (jwtToken: string) => {
    // Mock login doesn't need to do anything
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('jwt_token');
  };

  const value = useMemo(
    () => ({
      token,
      login,
      logout,
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}