import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { verifySession } from '../services/supabase';

interface ProtectedRouteProps {
  children: ReactNode;
  condition: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  condition, 
  redirectTo = '/'
}) => {
  const { state } = useUser();
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const isValid = await verifySession(state.sessionId);
      setIsValidSession(isValid);
    };

    checkSession();
  }, [state.sessionId]);

  // Show nothing while checking session
  if (isValidSession === null) {
    return null;
  }

  // Redirect if session is invalid or condition is not met
  if (!isValidSession || !condition) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;