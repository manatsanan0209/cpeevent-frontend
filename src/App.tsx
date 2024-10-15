import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/login';
import Event from './pages/Event';
import Custom404 from './pages/Custom404';

import IndexPage from '@/pages/index';
import DocsPage from '@/pages/docs';
import PricingPage from '@/pages/pricing';
import BlogPage from '@/pages/blog';
import AboutPage from '@/pages/about';
import ProtectedLayout from '@/layouts/ProtectedLayout';
import CalendarPage from "@/pages/calendar";
import TodoPage from "@/pages/todo";

function App() {
   return (
      <Routes>
         <Route element={<IndexPage />} path="/" />
         <Route element={<DocsPage />} path="/docs" />
         <Route element={<PricingPage />} path="/pricing" />
         <Route element={<BlogPage />} path="/blog" />
         <Route element={<AboutPage />} path="/about" />
         <Route element={<LoginPage />} path="/login" />
         <Route element={<Custom404 />} path="/404" />
         <Route element={<Navigate replace to="/404" />} path="*" />
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
         <Route element={<Event />} path="/events" />
         <Route element={<CalendarPage />} path="/calendar" />
         <Route element={<TodoPage />} path="/todo" />
      </Routes>
   );
}

export default App;
