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
    console.log("AuthProvider: useEffect");
    // Attempt to load token from localStorage on initial load
    const storedToken = localStorage.getItem('jwt_token');
    console.log("AuthProvider: storedToken", storedToken);
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (jwtToken: string) => {
    setToken(jwtToken);
    localStorage.setItem('jwt_token', jwtToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('jwt_token');
  };

  console.log("AuthProvider: rendering with token", token);

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
