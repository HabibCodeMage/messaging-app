'use client';
import api from '@/api';
import { useRouter } from 'next/navigation';
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useRef,
} from 'react';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
  loadingApp: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingApp, setLoadingApp] = useState<boolean>(true);

  const router = useRouter();
  const initialRender = useRef(true);

  const validateToken = async () => {
    try {
      const response = await api.auth.getUser();
      toast(`Welcome ${response.data?.name}`);
      setUser(response.data);
    } catch (error) {
      router.push('/login');
    } finally {
      setLoadingApp(false);
    }
  };

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      const token = localStorage.getItem('token');
      api.setToken(token as string);
      if (token) {
        // Fetch user details using the token
        validateToken();
      } else {
        setLoadingApp(false);
        // Redirect to login if no token found
        router.push('/login');
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, logout, loadingApp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
