import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import { Provider } from './provider.tsx';
import '@/styles/globals.css';
import './api/axios-config';
import AuthProvider from './context/AuthProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
   <>
      <BrowserRouter>
         <Provider>
            <AuthProvider>
               <App />
            </AuthProvider>
         </Provider>
      </BrowserRouter>
   </>,
);
