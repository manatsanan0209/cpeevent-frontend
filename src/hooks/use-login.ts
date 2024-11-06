import { useState, useContext } from 'react';
import axios from 'axios';

import { AuthContext } from '@/context/AuthContext';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setUser, setAccess, setToken, setRefreshToken } =
        useContext(AuthContext);

    const login = async (userID: string, password: string) => { //userID is student ID
        setLoading(true);
        setError(null);
        try {
            const payload = { "studentid": userID, "password": password }; //Bind the userID to be a "studentid" in JSON
            const response = await axios.post('v1/user/login', payload);

            // Assuming response contains user, token, and refresh_token
            const { user, access, token, refresh_token } = response.data.data;

            setUser(user);
            setAccess(access);
            setToken(token);
            setRefreshToken(refresh_token);

            localStorage.setItem('user', user);
            localStorage.setItem('access', access);
            localStorage.setItem('token', token);
            localStorage.setItem('refresh_token', refresh_token);

            return response.data;
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};
