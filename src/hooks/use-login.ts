import { useState } from 'react';
import axios from 'axios';

export const useLogin = () => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const login = async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
         const payload = { email: email, password: password };

         console.log('Login request payload:', payload);
         const response = await axios.post('/api/user/login', payload);

         // Handle successful login (e.g., store token, redirect, etc.)
         return response.data;
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   return { login, loading, error };
};
