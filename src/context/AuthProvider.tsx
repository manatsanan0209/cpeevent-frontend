import { useState, useEffect } from 'react';
import axios from 'axios';

import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
   const [user, setUser] = useState<string | null>(
      localStorage.getItem('user'),
   );
   const [token, setToken] = useState<string>(
      localStorage.getItem('token') || '',
   );
   const [refresh_token, setRefreshToken] = useState<string>(
      localStorage.getItem('refresh_token') || '',
   );
   const [access, setAccess] = useState<string>(
      localStorage.getItem('access') || '',
   );

   useEffect(() => {
      localStorage.setItem('user', user || '');
      localStorage.setItem('token', token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('access', access);
   }, [user, token, refresh_token, access]);

   const logout = async () => {
      try {
         const token = localStorage.getItem('token');

         const response = await axios.post(
            '/api/user/logout',
            {},
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            },
         );

         setUser(null);
         setToken('');
         setRefreshToken('');
         setAccess('');
         localStorage.removeItem('user');
         localStorage.removeItem('token');
         localStorage.removeItem('refresh_token');
         localStorage.removeItem('access');
         window.location.reload();

         return response;
      } catch (error) {
         throw new Error('Logout failed');
      }
   };

   return (
      <AuthContext.Provider
         value={{
            user,
            token,
            refresh_token,
            access,
            setUser,
            setToken,
            setRefreshToken,
            setAccess,
            logout,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};

export default AuthProvider;
