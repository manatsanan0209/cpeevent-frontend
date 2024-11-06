import { Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from 'react';

import LoginPage from './pages/login';
import Custom404 from './pages/Custom404';
import { AuthContext } from './context/AuthContext';
import Post from './pages/Post';

import IndexPage from '@/pages/index';
import DocsPage from '@/pages/docs';
import PricingPage from '@/pages/pricing';
import BlogPage from '@/pages/blog';
import AboutPage from '@/pages/about';
import ProtectedLayout from '@/layouts/ProtectedLayout';
import CalendarPage from '@/pages/calendar';
import TodoPage from '@/pages/todo';
import Event from '@/pages/Event';

function App() {
    const { user } = useContext(AuthContext);

    return (
        <Routes>
            <Route element={<IndexPage />} path="/" />
            <Route element={<DocsPage />} path="/docs" />
            <Route element={<PricingPage />} path="/pricing" />
            <Route element={<BlogPage />} path="/blog" />
            <Route element={<AboutPage />} path="/about" />
            <Route
                element={user ? <Navigate to="/" /> : <LoginPage />}
                path="/login"
            />
            <Route element={<Custom404 />} path="/404" />
            {/* <Route element={<Navigate replace to="/404" />} path="*" /> */}
            <Route element={<CalendarPage />} path="/calendar" />
            <Route element={<TodoPage />} path="/todo" />
            <Route
                element={
                    user ? (
                        <ProtectedLayout requiredAccess="1">
                            <Routes>
                                <Route element={<Event />} path="/events" />
                            </Routes>
                        </ProtectedLayout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
                path="*"
            />
            <Route element={<Event />} path="/events" />
            <Route element={<Post />} path="/workspace/:eventid" />
            <Route element={<CalendarPage />} path="/calendar" />
            <Route element={<TodoPage />} path="/todo" />
        </Routes>
    );
}

export default App;
