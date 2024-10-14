import { createContext } from 'react';

interface ProviderProps {
   user: string | null;
   token: string;
   refresh_token: string;
   access: string;
   setUser: (user: string | null) => void;
   setToken: (token: string) => void;
   setRefreshToken: (refreshToken: string) => void;
   setAccess: (access: string) => void;
   logout: () => Promise<void>;
}

const AuthContext = createContext<ProviderProps>({
   user: null,
   token: '',
   refresh_token: '',
   access: '',
   setUser: () => {},
   setToken: () => {},
   setRefreshToken: () => {},
   setAccess: () => {},
   logout: async () => {},
});

export { AuthContext };
export type { ProviderProps };
