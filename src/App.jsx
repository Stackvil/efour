import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Eager load all pages for instant navigation - eliminate lazy loading lag
import Home from './pages/Home';
import Dine from './pages/Dine';
import Login from './pages/Login';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import YourTickets from './pages/YourTickets';
import Success from './pages/Success';

import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <React.Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    {/* Public Layout Routes */}
                    <Route element={<Layout><Outlet /></Layout>}>
                        <Route path="/" element={<Home />} />
                        <Route path="/dine" element={<Dine />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />

                        <Route path="/tickets" element={<YourTickets />} />
                        <Route path="/success" element={<Success />} />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute role="admin">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                </Routes>
            </React.Suspense>
        </Router>
    );
}

export default App;
