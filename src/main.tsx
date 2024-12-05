import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App.tsx';
import { Provider } from './provider.tsx';
import '@/styles/globals.css';
import './api/axios-config';
import AuthProvider from './context/AuthProvider.tsx';

const queryClient = new QueryClient({
    // defaultOptions: {
    //     queries: {
    //         staleTime: 1000 * 60, // 1 minutes
    //         refetchOnWindowFocus: false,
    //     },
    // },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Provider>
                <AuthProvider>
                    <App />
                    <ToastContainer position="top-right" />
                </AuthProvider>
            </Provider>
        </BrowserRouter>
    </QueryClientProvider>,
);
