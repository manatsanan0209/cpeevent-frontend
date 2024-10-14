import { Route, Routes } from 'react-router-dom';

import LoginPage from './pages/login';

import IndexPage from '@/pages/index';
import DocsPage from '@/pages/docs';
import PricingPage from '@/pages/pricing';
import BlogPage from '@/pages/blog';
import AboutPage from '@/pages/about';
import ProtectedLayout from '@/layouts/ProtectedLayout';
import AllEvent from "./components/all-event";

function App() {
   return (
      <Routes>
         <Route element={<IndexPage />} path="/" />
         <Route element={<DocsPage />} path="/docs" />
         <Route element={<PricingPage />} path="/pricing" />
         <Route element={<BlogPage />} path="/blog" />
         <Route element={<AboutPage />} path="/about" />
         <Route element={<LoginPage />} path="/login" />
         <Route
            element={
               <ProtectedLayout requiredAccess="1">
                  <Routes>
                     <Route element={<AboutPage />} path="/some" />
                     <Route element={<BlogPage />} path="/another" />
                     {/* Add more protected routes here */}
                  </Routes>
               </ProtectedLayout>
            }
            path="/protected/*"
         />
        <Route element={<AllEvent />} path="/all-event" />
    </Routes>
   );
}

export default App;
