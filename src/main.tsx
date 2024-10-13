import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import { Provider } from './provider.tsx';
import '@/styles/globals.css';
import './api/axios-config';

ReactDOM.createRoot(document.getElementById('root')!).render(
   <>
      <BrowserRouter>
         <Provider>
            <App />
         </Provider>
      </BrowserRouter>
   </>,
);
