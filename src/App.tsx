import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';

import LoginPage from './pages/login';
import Event from './pages/Event';
import SettingsPage from './pages/settings';
import SignupPage from './pages/signup';
import Custom404 from './pages/Custom404';
import { AuthContext } from './context/AuthContext';
import MembersPage from './components/post/members';
import Post from './pages/Post';
import AllPostEvent from './components/post/AllPostEvent';
import PostDetail from './components/post/postDetail';
import VoteDetail from './components/post/voteDetail';
import FormDetail from './components/post/formDetail';
import CreateEventPage from './pages/createEvent';
import UpdateEventPage from './pages/updateEvent';

import IndexPage from '@/pages/index';
import DocsPage from '@/pages/docs';
import PricingPage from '@/pages/pricing';
import BlogPage from '@/pages/blog';
import AboutPage from '@/pages/about';
import ProtectedLayout from '@/layouts/ProtectedLayout';
import CalendarPage from '@/pages/calendar';
import TodoPage from '@/pages/todo';

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
            <Route
                element={user ? <Navigate to="/" /> : <SignupPage />}
                path="/signup"
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
                                <Route
                                    element={
                                        <Navigate to="/settings/profile" />
                                    }
                                    path="/settings"
                                />
                                <Route
                                    element={<SettingsPage />}
                                    path="/settings/:section"
                                />
                                <Route
                                    element={
                                        <Post>
                                            <Outlet />
                                        </Post>
                                    }
                                    path="/workspace/:eventid"
                                >
                                    <Route index element={<AllPostEvent />} />
                                    <Route
                                        element={<PostDetail />}
                                        path="post/:postid"
                                    />
                                    <Route
                                        element={<MembersPage />}
                                        path="/workspace/:eventid/members"
                                    />
                                </Route>
                                <Route
                                    element={
                                        <ProtectedLayout requiredAccess="2">
                                            <CreateEventPage />
                                        </ProtectedLayout>
                                    }
                                    path="/events/create"
                                />
                                <Route
                                    element={
                                        <ProtectedLayout requiredAccess="2">
                                            <UpdateEventPage />
                                            {/* <CreateEventPage /> */}
                                        </ProtectedLayout>
                                    }
                                    path="/events/update/:eventid"
                                />
                            </Routes>
                        </ProtectedLayout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
                path="*"
            />
            <Route element={<Event />} path="/events" />
            <Route
                element={
                    <Post>
                        <Outlet />
                    </Post>
                }
                path="/workspace/:eventid"
            >
                <Route index element={<AllPostEvent />} />
                <Route element={<PostDetail />} path="post/:postid" />
                <Route element={<VoteDetail />} path="vote/:postid" />
                <Route element={<FormDetail />} path="form/:postid" />
            </Route>
            <Route element={<CalendarPage />} path="/calendar" />
            <Route element={<TodoPage />} path="/todo" />
        </Routes>
    );
}

export default App;
