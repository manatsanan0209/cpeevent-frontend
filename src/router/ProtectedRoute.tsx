import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '@/context/AuthContext';

interface ProtectedRouteProps {
   children: React.ReactNode;
   requiredAccess: string;
}

const ProtectedRoute = ({ children, requiredAccess }: ProtectedRouteProps) => {
   const { user, access } = useContext(AuthContext);

   if (!user || parseInt(access) < parseInt(requiredAccess)) {
      // Redirect to login page if not authenticated or role does not match
      return <Navigate to="/login" />;
   }

   // Render the protected component if authenticated and role matches
   return <>{children}</>;
};

export default ProtectedRoute;
