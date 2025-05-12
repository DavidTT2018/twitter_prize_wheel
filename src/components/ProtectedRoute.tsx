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
  const [isValidSession, setIsValidSession] = useState<boolean>(true);

  useEffect(() => {
    const checkSession = async () => {
      if (!state.sessionId) {
        setIsValidSession(true);
        return;
      }

      try {
        const isValid = await verifySession(state.sessionId);
        setIsValidSession(isValid);
      } catch (error) {
        // If there's an error checking the session, we'll allow access
        console.error('Error verifying session:', error);
        setIsValidSession(true);
      }
    };

    checkSession();
  }, [state.sessionId]);

  // Show nothing while checking session
  if (isValidSession === null) {
    return null;
  }

  // Allow access if either the condition is met or we're ignoring session validation
  if (isValidSession && condition) {
    return <>{children}</>;
  }

  return <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;