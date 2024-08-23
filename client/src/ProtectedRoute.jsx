import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.currentUser);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    return user ? <Outlet /> : null;
};

export default ProtectedRoute;
