import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const location = useLocation();

    // If authenticated and trying to access login or register, redirect to dashboard
    if (token && (location.pathname === '/' || location.pathname === '/register')) {
        return <Navigate to="/dashboard" replace />;
    }

    // If not authenticated and trying to access dashboard, redirect to login
    if (!token && location.pathname === '/dashboard') {
        return <Navigate to="/" replace />;
    }

    // Otherwise, render the children
    return children;
};

export default ProtectedRoute;