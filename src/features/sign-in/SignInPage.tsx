import { Container } from '@mui/material';
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import SignInForm from './components/SignInForm';

const SignInPage: React.FC = () => {
    const { accessCode } = useParams<{ accessCode?: string }>();
    const auth = useAuth();
    const navigate = useNavigate();
    
    // If authentication state changes and we have an access code, redirect to join-event
    useEffect(() => {

        console.log('Initial auth state for sign in page:', auth.isAuthenticated());
        if (auth.isAuthenticated() && accessCode) {
            console.log("User is already authenticated, redirecting to join event with code:", accessCode);
            navigate(`/join-event/${accessCode}`, { replace: true });
        } else if (auth.isAuthenticated() && !accessCode) {
            console.log("User is already authenticated, redirecting to home page.");
            navigate(`/my-events`, { replace: true });
        }
    }, [auth, accessCode, navigate]);

    return (
        <Container>
            <SignInForm accessCode={accessCode} />
        </Container>
    );
};

export default SignInPage;