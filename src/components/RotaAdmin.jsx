import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RotaAdmin({ children }) {
  const { user } = useAuth();
  if (!user || user.perfil !== 'admin') return <Navigate to="/login" replace />;
  return children;
}
