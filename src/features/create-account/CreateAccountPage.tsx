import { Container } from '@mui/material';
import React, { useEffect } from 'react';
import CreateAccountForm from './components/CreateAccountForm';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

const CreateAccountPage: React.FC = () => {
    const { accessCode } = useParams<{ accessCode?: string }>();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    // If authentication state changes and we have an access code, redirect to join-event
    useEffect(() => {
        if (isAuthenticated() && accessCode) {
            console.log("User is already authenticated, redirecting to join event with code:", accessCode);
            navigate(`/join-event/${accessCode}`, { replace: true });
        }
    }, [isAuthenticated, accessCode, navigate]);

    return (
        <Container>
            <CreateAccountForm accessCode={accessCode} />
        </Container>
    );
};

export default CreateAccountPage;