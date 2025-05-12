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
      if (!state.sessionId) {
        setIsValidSession(false);
        return;
      }

      try {
        const isValid = await verifySession(state.sessionId);
        setIsValidSession(isValid);
      } catch (error) {
        console.error('Error verifying session:', error);
        setIsValidSession(false);
      }
    };

    checkSession();
  }, [state.sessionId]);

  // Show nothing while checking session
  if (isValidSession === null) {
    return null;
  }

  // Only allow access if both the condition is met AND the session is valid
  if (isValidSession && condition) {
    return <>{children}</>;
  }

  return <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;