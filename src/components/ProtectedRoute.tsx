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
        setIsValidSession(true); // Allow access for new users without session
        return;
      }

      try {
        const isValid = await verifySession(state.sessionId);
        setIsValidSession(isValid);
      } catch (error) {
        console.error('Error verifying session:', error);
        setIsValidSession(true); // Allow access on error to maintain user experience
      }
    };

    checkSession();
  }, [state.sessionId]);

  // Show nothing while checking session
  if (isValidSession === null) {
    return null;
  }

  // Allow access if the condition is met and either there's no session or the session is valid
  if (condition && isValidSession) {
    return <>{children}</>;
  }

  return <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;