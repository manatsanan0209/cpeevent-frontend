import { useState, useEffect } from 'react';

import { axiosAPIInstance } from '../api/axios-config';

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
            await axiosAPIInstance.post('v1/user/logout');

            setUser(null);
            setToken('');
            setRefreshToken('');
            setAccess('');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('access');
        } catch (error) {
            throw new Error('Logout failed');
        } finally {
            window.location.reload();
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
