import { useAuthContext } from '../context/AuthContext';

export function useAuth() {
  const { user, login, logout } = useAuthContext();
  
  const hasRole = (role) => {
    return user?.role === role;
  };

  return { user, login, logout, hasRole };
}
